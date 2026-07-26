import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,

} from "@/components/ui/sidebar"
 
export function AppSidebar() {
  return (
    <Sidebar variant="floating" >
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup />
        <SidebarMenu>
           <SidebarMenuItem>
                <SidebarMenuButton>
                  <a href="/#">Dashboard</a>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton>
                  <a href="/brodovi">Brodovi</a>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton>
                  <a href="/rezervacije">Rezervacije</a>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton>
                  <a href="/prihodi">Prihodi</a>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}