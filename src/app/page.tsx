//app/page.tsx

import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { Prisma, User } from "@prisma/client";
import { getServerSession } from "next-auth";
import { signIn } from "next-auth/react";
import { redirect } from "next/navigation";

export default async function Home() {

  const session = await getServerSession(authOptions)

  if(!session) redirect('/signin')

  return (
    <div className="bg- w-screen h-screen">
      <h1 className="text-5xl font-bold">Welcome {session.user.email}!</h1>
      <div></div>
      <div></div>
    </div>
  )
}