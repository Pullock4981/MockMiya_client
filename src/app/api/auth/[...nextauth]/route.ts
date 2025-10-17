import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import {
  canAttemptLogin,
  recordLoginAttempt,
  getBlockedUntil,
} from "@/lib/loginRateLimiter";

interface GoogleProfile {
  email?: string;
  name?: string;
  given_name?: string;
  family_name?: string;
}

interface AuthUser {
  id: string;
  name?: string | null;
  email: string;
  role: string;
}

const handler = NextAuth({
  providers: [
    // ---------- GOOGLE LOGIN ----------
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // ---------- CREDENTIAL LOGIN ----------
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        const email = credentials.email.trim().toLowerCase();

        // 🔗 connect to MongoDB
        await connectDB();

        // 🔍 Find user
        const user = await User.findOne({ email });

        if (!user) {
          recordLoginAttempt(email, false);
          throw new Error("Email not found");
        }

        if (!user.isVerified) {
          recordLoginAttempt(email, false);
          throw new Error("Please verify your email first");
        }

        // 🔐 Compare password
        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordCorrect) {
          recordLoginAttempt(email, false);
          throw new Error("Password is incorrect");
        }

        // ✅ Success: Reset failed attempts
        recordLoginAttempt(email, true);

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role || "user",
        };
      },
    }),
  ],

  // ---------- SESSION ----------
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // ---------- CALLBACKS ----------
  callbacks: {
    async signIn({ account, profile }) {
      await connectDB();

      // 🟢 GOOGLE SIGN-IN LOGIC
      if (account?.provider === "google") {
        const googleProfile = profile as GoogleProfile;
        const email = googleProfile.email;
        if (!email) return false;

        let dbUser = await User.findOne({ email });

        if (!dbUser) {
          dbUser = new User({
            email,
            name:
              googleProfile.name ||
              `${googleProfile.given_name || ""} ${
                googleProfile.family_name || ""
              }`.trim(),
            role: "user",
            isVerified: true,
            password: "",
          });
          await dbUser.save();
        } else if (!dbUser.isVerified) {
          dbUser.isVerified = true;
          await dbUser.save();
        }
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        const authUser = user as AuthUser;
        token.id = authUser.id ?? token.id;
        token.name = authUser.name ?? token.name;
        token.email = authUser.email ?? token.email;
        token.role = authUser.role ?? token.role ?? "user";
      }
      return token;
    },

    async session({ session, token }) {
      session.user = {
        id: token.id as string,
        name: token.name as string,
        email: token.email as string,
        role: token.role as string,
      };
      return session;
    },
  },

  // ---------- CUSTOM PAGES ----------
  pages: {
    signIn: "/auth",
  },

  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
