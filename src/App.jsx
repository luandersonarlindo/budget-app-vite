import { LayoutDashboard, TrendingUp, Wallet } from 'lucide-react'
import { useState } from 'react'
import BudgetModule from './components/BudgetModule'
import BusinessModule from './components/BusinessModule'
import ThemeToggle from './components/ThemeToggle'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger
} from './components/ui/sidebar'

function App() {
  const [activeModule, setActiveModule] = useState('budget')

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <div className="px-2 py-2">
            <div className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-600">
                <Wallet className="h-4 w-4 text-white" />
              </div>
              <div className="group-data-[collapsible=icon]:hidden">
                <div className="text-sm font-semibold leading-tight">Budget App</div>
                <div className="text-xs text-muted-foreground">Finance Workspace</div>
              </div>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Módulos</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeModule === 'budget'}
                  onClick={() => setActiveModule('budget')}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Orçamentos
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeModule === 'business'}
                  onClick={() => setActiveModule('business')}
                >
                  <TrendingUp className="h-4 w-4" />
                  Negócio
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        <SidebarSeparator />
        <SidebarRail />
      </Sidebar>

      <SidebarInset>
        <div className="flex items-center justify-between gap-2 p-4 border-b">
          <SidebarTrigger />
          <ThemeToggle />
        </div>

        <div className="px-4 pb-6 pt-4">
          {activeModule === 'budget' && <BudgetModule />}
          {activeModule === 'business' && <BusinessModule />}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default App