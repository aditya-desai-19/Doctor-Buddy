"use client"

import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { useTranslations } from "next-intl"
import { useLoginStore } from "@/zustand/useLoginStore"
import { SidebarTrigger } from "./ui/sidebar"

export default function Header() {
  const isLoggedIn = useLoginStore((state) => state.isLoggedIn)

  const t = useTranslations()

  return (
    <nav className="w-full px-6 py-4 bg-blue-600 text-white shadow-md">
      <div className="max-w-7xl flex justify-between items-center">
        <div>
          {isLoggedIn && <SidebarTrigger style={{marginRight: 10}}/>}
          <Link href="/" className="text-2xl font-bold">
            {t("DoctorBuddy")}
          </Link>
        </div>
        {isLoggedIn && (
          <div className="space-x-4">
            <Link href="/profile" className="hover:underline">
              <Avatar>
                <AvatarImage src="../assets/images/profile.png" />
                <AvatarFallback className="text-black">CN</AvatarFallback>
              </Avatar>
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
