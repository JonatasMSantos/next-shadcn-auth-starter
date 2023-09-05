import { PrismaAdapter } from "@auth/prisma-adapter";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions } from "next-auth";
import { Adapter } from "next-auth/adapters";
import CredentialProvider from "next-auth/providers/credentials";
import { db as prisma } from "./db";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma as any) as Adapter,
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENTID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialProvider({
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "seuemail@email.com",
        },
        password: { label: "Password", type: "password" },
        name: { label: "Name", type: "text", placeholder: "Seu Nome" },
      },
      async authorize(credentials: any, req): Promise<any> {
        const request = await fetch("http://localhost:3000/api/auth/login", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            username: credentials.email,
            password: credentials.password,
          }),
        });

        const response = await request.json();

        if (!response.ok) {
          throw new Error(response.error);
        } else {
          return response.data;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },

    async session({ session, token }) {
      session.user = token as any;
      return session;
    },

    async signIn({ account, profile }) {
      /*
        console.log(profile?.email);

        try {
          const request = await fetch(
            "http://localhost:3000/api/user/" + profile?.email,
            {
              method: "GET",
              headers: {
                "Content-type": "application/json",
              },
            }
          );

          const response = await request.json();
          console.log("AQUI", response);
        } catch (err) {
          console.log(err);
        }

        throw new Error("Email já existe");
        return false; // Do different verification for other providers that don't have `email_verified`
      */
      return true;
    },
  },
};
