import { useState } from 'react'
import BudgetModule from './components/BudgetModule'
import BusinessModule from './components/BusinessModule'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarFooter,
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
      <Sidebar>
        <SidebarHeader>
          <div className="px-2">
            <div className="text-lg font-semibold leading-tight">Budget App</div>
            <div className="text-xs text-muted-foreground">Finance Workspace</div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Modules</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeModule === 'budget'}
                  onClick={() => setActiveModule('budget')}
                >
                  Budget
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeModule === 'business'}
                  onClick={() => setActiveModule('business')}
                >
                  Business
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarSeparator />
        <SidebarFooter>
          <div className="px-2 text-xs text-muted-foreground">v1.0 • LQA</div>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      <SidebarInset>
        <div className="flex items-center gap-2 p-4">
          <SidebarTrigger />
          <h1 className="text-2xl font-bold">Budget App</h1>
        </div>

        <div className="px-4 pb-6">
          {activeModule === 'budget' && <BudgetModule />}
          {activeModule === 'business' && <BusinessModule />}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default App