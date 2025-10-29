import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodbNative";
import GithubProvider from "next-auth/providers/github";

interface GoogleProfile {
  email?: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  sub?: string;
}

interface AuthUser {
  id: string;
  name?: string | null;
  email: string;
  role: string;
}

export const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
      httpOptions: { timeout: 10000 }, // ⏰ increase to 10s
    }),

    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),

    // ---------- EMAIL/PASSWORD LOGIN ----------
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
        const { db } = await connectDB();
        const users = db.collection("users");

        const user = await users.findOne({ email });
        if (!user) throw new Error("Email not found");
        if (!user.isVerified) throw new Error("Please verify your email first");
        if (!user.password) throw new Error("This account uses Google login.");

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isPasswordCorrect) throw new Error("Password is incorrect");

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role || "user",
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  callbacks: {
    // ---------- SIGN IN CALLBACK ----------
    async signIn({ account, profile }) {
      const { db } = await connectDB();

      if (account?.provider === "google") {
        const googleProfile = profile as GoogleProfile;
        const email = googleProfile.email;
        if (!email) return false;

        const users = db.collection("users");
        const dbUser = await users.findOne({ email });

        if (!dbUser) {
          // Create new Google user WITHOUT password
          const newUser = {
            email,
            name:
              googleProfile.name ||
              `${googleProfile.given_name || ""} ${
                googleProfile.family_name || ""
              }`.trim(),
            role: "user",
            isVerified: true,
            googleId: googleProfile.sub,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          await users.insertOne(newUser);
        } else if (!dbUser.isVerified) {
          await users.updateOne(
            { email },
            { $set: { isVerified: true, updatedAt: new Date() } }
          );
        }
      }

      return true;
    },

    // ---------- JWT CALLBACK ----------
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

    // ---------- SESSION CALLBACK ----------
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

  pages: {
    signIn: "/auth",
  },

  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
