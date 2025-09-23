'use client';


import {
  BarChart3,
  Bot,
  Code,
  FileEdit,
  FileText,
  LogOut,
  MessageSquare,
  Mic,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Settings,
  Shield,
  TrendingUp,
  User,
  Users,
  Video,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useActiveTab } from '../dashcontext/ActiveTabContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  collapsed?: boolean;
  setCollapsed?: (value: boolean) => void;
}

const Sidebar = ({ collapsed: collapsedProp, setCollapsed: setCollapsedProp }: SidebarProps) => {
  const { activeTab, setActiveTab } = useActiveTab();

  const sidebarItems = [
    {
      id: 'overview',
      name: 'Dashboard',
      icon: BarChart3,
      section: 'main',
      path: '/dashboard/overview',
    },
    {
      id: 'resume',
      name: 'Resume Builder',
      icon: FileText,
      section: 'main',
      path: '/dashboard/resume',
    },
    {
      id: 'analyzer',
      name: 'Job Analyzer',
      icon: Search,
      section: 'main',
      path: '/dashboard/analyzer',
    },
    {
      id: 'cover',
      name: 'Cover Letter',
      icon: FileEdit,
      section: 'main',
      path: '/dashboard/cover',
    },
    {
      id: 'text-interview',
      name: 'Text Interview',
      icon: MessageSquare,
      section: 'interviews',
      path: '/dashboard/text-interview',
    },
    {
      id: 'voice-interview',
      name: 'Voice Interview',
      icon: Mic,
      section: 'interviews',
      path: '/dashboard/voice-interview',
    },
    {
      id: 'video-interview',
      name: 'Video Interview',
      icon: Video,
      section: 'interviews',
      path: '/dashboard/video-interview',
    },
    {
      id: 'coding',
      name: 'Coding Challenges',
      icon: Code,
      section: 'practice',
      path: '/dashboard/coding',
    },
    {
      id: 'analytics',
      name: 'Analytics',
      icon: TrendingUp,
      section: 'insights',
      path: '/dashboard/analytics',
    },
    { id: 'admin', name: 'Admin', icon: Shield, section: 'admin', path: '/dashboard/admin' },
    {
      id: 'admin-console',
      name: 'Admin Console',
      icon: Settings,
      section: 'admin',
      path: '/dashboard/admin-console',
    },
    {
      id: 'user-management',
      name: 'User Management',
      icon: Users,
      section: 'admin',
      path: '/dashboard/user-management',
    },
    { id: 'profile', name: 'Profile', icon: User, section: 'account', path: '/dashboard/profile' },
  ];

  const sections = {
    main: 'Core Features',
    interviews: 'Interview Practice',
    practice: 'Skills Practice',
    insights: 'Insights',
    admin: 'Administration',
    account: 'Account',
  };

  const [collapsed, setCollapsedState] = useState<boolean>(
    collapsedProp ?? (typeof window !== 'undefined' ? window.innerWidth < 768 : false)
  );
  const [width, setWidth] = useState<number>(collapsed ? 70 : 256);
  const [dragging, setDragging] = useState(false);
  const sidebarRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (collapsedProp !== undefined) {
      setCollapsedState(collapsedProp);
      setWidth(collapsedProp ? 70 : 256);
    }
  }, [collapsedProp]);

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      setCollapsedState(isMobile);
      setWidth(isMobile ? 70 : 256);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (dragging && sidebarRef.current) {
        document.body.style.userSelect = 'none';
        let newWidth = e.clientX - sidebarRef.current.getBoundingClientRect().left;
        if (newWidth < 70) newWidth = 70;
        if (newWidth > 300) newWidth = 256;
        setWidth(newWidth);
        const newCollapsed = newWidth < 100;
        setCollapsedState(newCollapsed);
        if (setCollapsedProp) setCollapsedProp(newCollapsed);
      }
    };
    const handleMouseUp = () => {
      setDragging(false);
      document.body.style.userSelect = 'auto';
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'auto';
    };
  }, [dragging, setCollapsedProp]);

  const toggleCollapsed = () => {
    const newCollapsed = !collapsed;
    setCollapsedState(newCollapsed);
    setWidth(newCollapsed ? 70 : 256);
    if (setCollapsedProp) setCollapsedProp(newCollapsed);
  };

  const groupedItems = sidebarItems.reduce((acc, item) => {
    if (!acc[item.section]) acc[item.section] = [];
    acc[item.section].push(item);
    return acc;
  }, {} as Record<string, typeof sidebarItems>);

  return (
    <aside
      ref={sidebarRef}
      className="bg-card border-r border-border transition-all duration-300 flex flex-col relative overflow-hidden"
      style={{ width: `${width}px`, flexShrink: 0 }}
    >
      {/* Logo + Toggle */}
      <div className="flex items-center h-[78px] px-4 border-b border-border justify-between flex-shrink-0">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gradient-to-r from-green-primary to-green-accent rounded-lg flex items-center justify-center">
            <Bot className="h-5 w-5 text-primary-foreground" />
          </div>
          {!collapsed && <span className="ml-2 text-xl font-bold gradient-text">MockMiya</span>}
        </div>

        <button onClick={toggleCollapsed} className="p-2 rounded-md hover:bg-muted transition">
          {collapsed ? (
            <PanelLeftOpen className="h-5 w-5" />
          ) : (
            <PanelLeftClose className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-6 overflow-y-auto custom-scroll">
        {Object.entries(groupedItems).map(([sectionKey, items]) => (
          <div key={sectionKey} className="space-y-2">
            {!collapsed && (
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3">
                {sections[sectionKey as keyof typeof sections]}
              </h3>
            )}
            {items.map((item) => (
              <Link key={item.id} href={item.path} passHref>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full sidebar-button flex items-center rounded-lg px-3 py-2 text-sm transition-colors ${
                    activeTab === item.id
                      ? 'active-button'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  } ${collapsed ? 'justify-center' : ''}`}
                >
                  <item.icon className="h-4 w-4" />
                  {!collapsed && <span className="ml-3">{item.name}</span>}
                </button>
              </Link>
            ))}
          </div>
        ))}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-border flex-shrink-0">
        {!collapsed && (
          <div className="flex items-center space-x-3 mb-4">
            <Avatar>
              <AvatarFallback className="bg-green-primary text-primary-foreground">
                JD
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-sm">John Doe</p>
              <p className="text-xs text-muted-foreground">john@example.com</p>
            </div>
          </div>
        )}
        <Button variant="outline" size="sm" className="w-full">
          <LogOut className="h-3 w-3 mr-2" />
          {!collapsed && 'Sign Out'}
        </Button>
      </div>

      {/* Drag Handle */}
      <div
        onMouseDown={() => setDragging(true)}
        className={`w-1 cursor-col-resize h-full absolute right-0 top-0 z-10 ${
          dragging ? 'bg-indigo-500' : 'hover:bg-indigo-300'
        }`}
      />
    </aside>
  );
};

export default Sidebar;
