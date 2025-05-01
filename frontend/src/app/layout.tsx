import { ACCESS_TOKEN_KEY } from "@/common/constants"
import Header from "@/components/Header"
import { Toaster } from "@/components/ui/sonner"
import ReactQueryProvider from "@/utils/ReactQueryProvider"
import { NextIntlClientProvider } from "next-intl"
import { getLocale } from "next-intl/server"
import { Open_Sans } from "next/font/google"
import { cookies } from "next/headers"
import "./globals.css"

const openSans = Open_Sans()

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await getLocale()
  const isCookieExist = (await cookies()).has(ACCESS_TOKEN_KEY)

  return (
    <html lang={locale} className={openSans.className}>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <NextIntlClientProvider>
        <ReactQueryProvider>
          <body className="h-screen w-full">
            <Header isCookieExist={isCookieExist} />
            {children}
            <Toaster />
          </body>
        </ReactQueryProvider>
      </NextIntlClientProvider>
    </html>
  )
}
