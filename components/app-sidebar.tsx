import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { logoutUserAction } from '@/lib/actions/auth-actions';
export function AppSidebar() {
  return (
    <Sidebar variant="floating">
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
          <SidebarMenuItem>
            <SidebarMenuButton>
              <a href="/cijene">Cijene</a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <a href="/signin">Sign in</a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <a href="/signup">Sign up</a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <form action={logoutUserAction}>
              <SidebarMenuButton render={<button type="submit" />}>Odjava</SidebarMenuButton>
            </form>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>{' '}
    </Sidebar>
  );
}
