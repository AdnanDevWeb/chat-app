import { Account, Session as PrismaSession } from "@prisma/client";
import { User } from "next-auth";
import type { Session } from 'next-auth'

import type { JWT } from 'next-auth/jwt'

declare module 'next-auth'{
    interface Session{
        user: User & {
            id: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
            bio: string;
            account: Account[],
            sessions: PrismaSession[]
        }
    }
}


type UserId = string

declare module 'next-auth/jwt' {
  interface JWT {
    id: UserId
  }
}