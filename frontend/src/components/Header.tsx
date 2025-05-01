"use client"

import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { useTranslations } from "next-intl"
import { useLoginStore } from "@/zustand/useLoginStore"
import { Button } from "./ui/button"
import { useRouter } from "next/navigation"
import { useCallback, useEffect } from "react"
import { useDoctorStore } from "@/zustand/useDoctorStore"
import { getDoctorDetails, handleLogout as logout } from "@/api/action"
import {
  DropdownMenu,
  DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "./ui/dropdown-menu"

type Props = {
  isCookieExist: boolean
}

export default function Header({ isCookieExist }: Props) {
  const { isLoggedIn, setIsLoggedIn } = useLoginStore((state) => state)
  const { initials, setDoctorDetails, setInitials } = useDoctorStore(
    (state) => state
  )

  const t = useTranslations()
  const router = useRouter()
  
  const navigateToProfile = useCallback(() => {
    router.push("/profile")
  }, [])

  const handleLogout = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setIsLoggedIn(false)
    logout()
    router.push("/login")
  }, [])

  useEffect(() => {
    setIsLoggedIn(isCookieExist)
  }, [])

  useEffect(() => {
    if (isCookieExist) {
      const fetchDoctorData = async () => {
        const data = await getDoctorDetails()
        if (data) {
          setDoctorDetails(data)
          setInitials(
            `${data.firstName?.at(0)?.toUpperCase()}${data.lastName?.at(0)?.toUpperCase()}`
          )
        }
      }
      fetchDoctorData()
    }
  }, [isCookieExist])

  return (
    <nav className="w-full px-6 py-4 shadow-md max-md:px-1 max-md:py-2">
      <div className={`flex justify-between items-center mx-20 max-md:mx-6 ${isLoggedIn ? "max-md:flex-col" : ""}`}>
        <div>
          <Link href="/" className="text-2xl max-sm:text-sm sm:max-lg:text-lg font-semibold text-blue-900">
            {t("DoctorBuddy")}
          </Link>
        </div>
        {isLoggedIn ? (
          <div className="flex items-center max-sm:text-sm">
            <Link href={"/patients"} className="mx-8 max-md:mx-2">
              {t("Patients")}
            </Link>
            <Link href={"/treatments"} className="mx-8 max-md:mx-2">
              {t("Treatments")}
            </Link>
            <Link href={"/payments"} className="mx-8 max-md:mx-2">
              {t("Payments")}
            </Link>
            <Link href="/profile" className="hover:underline mx-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar>
                    <AvatarImage src="../assets/images/profile.png" />
                    <AvatarFallback className="text-black">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>{t("MyAccount")}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={navigateToProfile}>
                    {t("Profile")}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="bg-rose-600 text-white hover:!bg-rose-700 hover: !text-white cursor-pointer"
                    onClick={handleLogout}
                  >
                    {t("Logout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </Link>
          </div>
        ) : (
          <Button
            className="bg-white border-2 border-gray-200 text-sm text-gray-500 hover:text-blue-500 hover:border-blue-400 hover:bg-white cursor-pointer max-md:w-30 max-md:text-xs"
            onClick={() => router.push("/login")}
          >{`${t("Login")} / ${t("SignUp")}`}</Button>
        )}
      </div>
    </nav>
  )
}
