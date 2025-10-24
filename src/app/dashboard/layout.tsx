'use client';

import { ReactNode, useState } from 'react';
import { DashboardHeader } from './components/DashboardHeader';
import Sidebar from './components/Sidebar';
import { ActiveTabProvider } from './dashcontext/ActiveTabContext';
import { ThemeProvider } from '@/components/ui/ThemeProvider';
import { AuthProvider } from '../../context/AuthContext/AuthContext';

interface LayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: LayoutProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <ThemeProvider>
      <AuthProvider>
        <ActiveTabProvider>
          <div className="h-screen bg-background text-foreground flex w-full overflow-hidden">
            {/* Sidebar */}
            <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

            {/* Main content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
              <DashboardHeader />
              <main className="flex-1 p-6 overflow-y-auto custom-scroll">{children}</main>
            </div>
          </div>
        </ActiveTabProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
