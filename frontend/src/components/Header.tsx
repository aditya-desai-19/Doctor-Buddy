"use client"

import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { useTranslations } from "next-intl"
import { useLoginStore } from "@/zustand/useLoginStore"
import { Button } from "./ui/button"
import { useRouter } from "next/navigation"

export default function Header() {
  const isLoggedIn = useLoginStore((state) => state.isLoggedIn)

  const t = useTranslations()
  const router = useRouter()

  return (
    <nav className="w-full px-6 py-4 shadow-md" >
      <div className="flex justify-between items-center mx-20">
        <div>
          <Link href="/" className="text-2xl font-semibold text-blue-900">
            {t("DoctorBuddy")}
          </Link>
        </div>
        {isLoggedIn ? (
          <div className="flex items-center">
            <Link href={"/patients"} className="mx-8">{t("Patients")}</Link>
            <Link href={"/treatments"} className="mx-8">{t("Treatments")}</Link>
            <Link href={"/payments"} className="mx-8">{t("Payments")}</Link>
            <Link href="/profile" className="hover:underline mx-8">
              <Avatar>
                <AvatarImage src="../assets/images/profile.png" />
                <AvatarFallback className="text-black">CN</AvatarFallback>
              </Avatar>
            </Link>
          </div>
        ) : <Button className="bg-white border-2 border-gray-200 text-gray-500 hover:text-blue-500 hover:border-blue-400 hover:bg-white cursor-pointer" onClick={() => router.push("/login")}>{`${t("Login")} / ${t("SignUp")}`}</Button>}
      </div>
    </nav>
  )
}
