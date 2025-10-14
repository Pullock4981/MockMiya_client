import { DefaultSession, DefaultUser, JWT as DefaultJWT } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string;
      role: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    name?: string;
    role: string;
  }

  interface JWT extends DefaultJWT {
    id: string;
    name?: string;
    email: string;
    role: string;
  }
}
