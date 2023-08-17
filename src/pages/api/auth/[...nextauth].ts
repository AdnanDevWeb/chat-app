import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient, Session, User } from "@prisma/client"
import NextAuth, { NextAuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"

interface CustomToken extends Session {
  user: {
    id: string;
    name: string;
    email: string;
    picture: string;
    bio: string;
  };
}

const prisma = new PrismaClient()
export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
   pages: {
    signIn: '/signin'
   },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID!,
            clientSecret: process.env.GOOGLE_SECRET!
        }),
        GithubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!
        })
    ],
    callbacks: {
        async jwt({ token }: {token: CustomToken}) {
            if (token) {
              // Check if the token has expired
              if (Date.now()  / 1000 > Number(token.expires)) {
                // Token has expired, log the user out
                return null; // Returning null effectively logs the user out
              }
          
              // You can add custom claims to the token
              token.user = {
                id: token.id,
                name: token.user.id,
                email: token.user.email,
                picture: token.user.picture,
                bio: token.user.bio,
              };
            }
          
            return token;
          },          
        async session({session, user, token}){
            const userData = await prisma.user.findUnique({
                where: { id: user.id },
                select: {
                    bio: true,
                    image: true,
                },
            }) as User

            if(session){
                session.user.bio = userData.bio
                session.user.image = userData.image
            }
            console.log(session)
            return session
            
        }
    }
}

export default NextAuth(authOptions)