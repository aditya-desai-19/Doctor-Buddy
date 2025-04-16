
import { NextIntlClientProvider } from "next-intl"
import { getLocale } from "next-intl/server"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"
import Header from "@/components/Header"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Open_Sans } from 'next/font/google'

const openSans = Open_Sans()

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await getLocale()
  return (
    <html lang={locale} className={openSans.className}>
      <NextIntlClientProvider>
        <body>
          <SidebarProvider>
            <main className="h-min-screen w-full">
              <Header />
              {children}
            </main>
            <Toaster />
          </SidebarProvider>
        </body>
      </NextIntlClientProvider>
    </html>
  )
}
