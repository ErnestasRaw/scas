import { DefaultSession, DefaultUser } from "next-auth";
import "next-auth/jwt";
import userRoles from "@/models/User/userRoles";
 

declare module "next-auth" {
  interface Session {
    user?: {
      role?: userRoles;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role?: string; 
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: userRoles; 
  }
}
