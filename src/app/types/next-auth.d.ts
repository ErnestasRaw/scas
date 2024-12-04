import { DefaultSession, DefaultUser } from "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user?: {
      role?: string;
      id?: string;
    } & DefaultSession["user"];
  }
  
  interface User extends DefaultUser {
    role?: string; 
    _id?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string; 
    _id?: string;
  }
}
