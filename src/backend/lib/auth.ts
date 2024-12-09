import { connectDB } from "./mongodb";
import User from "@/models/User";
import type { NextAuthOptions } from "next-auth";
import credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions  = {
    providers: [
      credentials({
        name: "Credentials",
        id: "credentials",
        credentials: {
          email: { label: "Email", type: "text" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
          await connectDB();
          const user = await User.findOne({
            email: credentials?.email,
          }).select("+password +role +_id");
          
          if (!user) throw new Error("Wrong Email");

          const passwordMatch = await bcrypt.compare(
            credentials!.password,
            user.password
          );

          if (!passwordMatch) throw new Error("Wrong Password");

          return { ...user.toObject(), role: user.role, _id: user._id.toString() };
        },
      }),
    ],
    session: {
      strategy: "jwt",
    },
    callbacks: {
      async jwt({ token, user }) {
        if (user) {
          token.role = user.role;
          token._id = user._id; 
        }
        return token;
      },
      async session({ session, token }) {
        if (token) {
          session.user = {
            ...session.user, 
            role: token.role,
            _id: token._id, 
          };
        }
        return session;
      },
    },
  };