"use client"

import Link from 'next/link'
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from './ui/sidebar'
import { useLoginStore } from '@/zustand/useLoginStore'

const items = [
  {
    title: "Home",
    url: "/",
  },
  {
    title: "Patients",
    url: "/patients",
  },
  {
    title: "Treatments",
    url: "/treatments",
  },
  {
    title: "Payments",
    url: "/payments",
  },
]

export default function AppSidebar() {
  const isLoggedIn = useLoginStore((state) => state.isLoggedIn)

  if(!isLoggedIn) {
    return null
  }

  return (
    <Sidebar>
      <SidebarContent className='bg-slate-900 text-white shadow-md'>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}> 
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
