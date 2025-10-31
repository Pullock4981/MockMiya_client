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
import { useAuth } from '@/context/AuthContext/AuthContext';
import Swal from 'sweetalert2';
import Logo from '@/components/layout/Logo';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  collapsed?: boolean;
  setCollapsed?: (value: boolean) => void;
}

const MOBILE_QUERY = '(max-width: 767px)';

const Sidebar = ({ collapsed: collapsedProp, setCollapsed: setCollapsedProp }: SidebarProps) => {
  const { user, logout } = useAuth();
  const { activeTab, setActiveTab } = useActiveTab();
  const pathname = usePathname();

  const sidebarItems = [
    { id: 'overview', name: 'Dashboard', icon: BarChart3, section: 'main', path: '/dashboard' },
    { id: 'resume', name: 'Resume Builder', icon: FileText, section: 'main', path: '/dashboard/resume' },
    { id: 'analyzer', name: 'Job Analyzer', icon: Search, section: 'main', path: '/dashboard/job-analyzer' },
    { id: 'cover', name: 'Cover Letter', icon: FileEdit, section: 'main', path: '/dashboard/cover' },
    { id: 'text-interview', name: 'Text Interview', icon: MessageSquare, section: 'interviews', path: '/dashboard/text-interview' },
    { id: 'voice-interview', name: 'Voice Interview', icon: Mic, section: 'interviews', path: '/dashboard/voice-interview' },
    { id: 'video-interview', name: 'Video Interview', icon: Video, section: 'interviews', path: '/dashboard/live-interview' },
    { id: 'coding', name: 'Coding Challenges', icon: Code, section: 'practice', path: '/dashboard/coding-challenges' },
    { id: 'analytics', name: 'Analytics', icon: TrendingUp, section: 'insights', path: '/dashboard/analytics' },
    { id: 'admin', name: 'Admin Panel', icon: Shield, section: 'admin', path: '/dashboard/admin/panel' },
    { id: 'admin-console', name: 'Admin Console', icon: Settings, section: 'admin', path: '/dashboard/admin/console' },
    { id: 'user-management', name: 'User Management', icon: Users, section: 'admin', path: '/dashboard/admin/user-management' },
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

  const isAdmin = user?.role === 'System Admin' || user?.role === 'Admin';

  // Filter items based on role: hide main dashboard for admins (per your request),
  // hide admin items for normal users.
  let filteredSidebarItems = sidebarItems.filter(item => {
    if (isAdmin && item.path === '/dashboard') return false; // hide main dashboard for admin users
    if (!isAdmin && item.section === 'admin') return false; // hide admin items for normal users
    return true;
  });

  // move admin items to top when admin
  if (isAdmin) {
    const adminItems = filteredSidebarItems.filter(item => item.section === 'admin');
    const otherItems = filteredSidebarItems.filter(item => item.section !== 'admin');
    filteredSidebarItems = [...adminItems, ...otherItems];
  }

  const groupedItems = filteredSidebarItems.reduce((acc, item) => {
    if (!acc[item.section]) acc[item.section] = [];
    acc[item.section].push(item);
    return acc;
  }, {} as Record<string, typeof filteredSidebarItems>);

  // --- State: mobile detection & collapsed ---
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(MOBILE_QUERY).matches;
  });

  const [collapsed, setCollapsedState] = useState<boolean>(() => {
    if (typeof window === 'undefined') return collapsedProp ?? false;
    return window.matchMedia(MOBILE_QUERY).matches ? true : (collapsedProp ?? false);
  });

  const [width, setWidth] = useState<number>(collapsed ? 70 : 256);
  const [dragging, setDragging] = useState(false);
  const sidebarRef = useRef<HTMLDivElement | null>(null);

  // keep parent informed if prop is controlled
  useEffect(() => {
    if (collapsedProp !== undefined) {
      setCollapsedState(collapsedProp);
      setWidth(collapsedProp ? 70 : 256);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collapsedProp]);

  // matchMedia listener for mobile (force collapsed on mobile)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mq = window.matchMedia(MOBILE_QUERY);

    const handleChange = (e: MediaQueryListEvent) => {
      const matches = e.matches;
      setIsMobile(matches);

      if (matches) {
        setCollapsedState(true);
        setWidth(70);
        if (setCollapsedProp) setCollapsedProp(true);
      } else {
        if (collapsedProp === undefined) {
          setCollapsedState(false);
          setWidth(256);
          if (setCollapsedProp) setCollapsedProp(false);
        }
      }
    };

    // initial check
    setIsMobile(mq.matches);
    if (mq.matches) {
      setCollapsedState(true);
      setWidth(70);
    } else {
      if (collapsedProp === undefined) {
        setCollapsedState(false);
        setWidth(256);
      }
    }

    // modern API
    if (mq.addEventListener) {
      mq.addEventListener('change', handleChange);
    } else {
      // legacy Safari support
      mq.addListener(handleChange);
    }

    return () => {
      if (mq.removeEventListener) {
        mq.removeEventListener('change', handleChange);
      } else {
        mq.removeListener(handleChange);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  // Drag behaviour: disabled on mobile
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (dragging && sidebarRef.current && !isMobile) {
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
      if (!isMobile) setDragging(false);
      document.body.style.userSelect = 'auto';
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'auto';
    };
  }, [dragging, isMobile, setCollapsedProp]);

  // Toggle (disabled on mobile)
  const toggleCollapsed = () => {
    if (isMobile) return;
    const newCollapsed = !collapsed;
    setCollapsedState(newCollapsed);
    setWidth(newCollapsed ? 70 : 256);
    if (setCollapsedProp) setCollapsedProp(newCollapsed);
  };

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out from your account!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Logout",
    });

    if (result.isConfirmed) {
      try {
        await logout();
        await Swal.fire({
          title: "Logged Out!",
          text: "You have been logged out successfully.",
          icon: "success",
          timer: 1800,
          showConfirmButton: false,
        });
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Logout failed');
        Swal.fire({ title: "Failed!", text: error.message, icon: "error" });
      }
    }
  };

  // ----------- AUTO-ACTIVE: sync activeTab with current pathname ------------
  useEffect(() => {
    if (!pathname) return;

    // choose the best match: the sidebar item whose path is a prefix of pathname
    // and has the longest matching path (so /dashboard/admin/panel matches that item, not /dashboard)
    let bestMatch: (typeof filteredSidebarItems)[number] | undefined = undefined;
    for (const item of filteredSidebarItems) {
      if (!item.path) continue;
      const p = item.path.endsWith('/') ? item.path.slice(0, -1) : item.path;
      if (pathname === p || pathname.startsWith(p + '/') || pathname.startsWith(p)) {
        if (!bestMatch || (item.path.length > bestMatch.path.length)) {
          bestMatch = item;
        }
      }
    }
    if (bestMatch) {
      setActiveTab(bestMatch.id);
    }
    // if nothing matches, don't change activeTab
  }, [pathname, filteredSidebarItems, setActiveTab]);

  return (
    <aside
      ref={sidebarRef}
      className="bg-card border-r border-border transition-all duration-300 flex flex-col relative overflow-hidden"
      style={{ width: `${width}px`, flexShrink: 0 }}
    >
      {/* Logo + Toggle */}
      <div className="flex items-center justify-between h-[75px] px-4 border-b border-border relative">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gradient-to-r from-green-primary to-green-accent rounded-lg flex items-center justify-center">
            <Bot className="h-5 w-5 text-primary-foreground" />
          </div>
          {!collapsed && <Logo />}
        </div>

        <button
          onClick={toggleCollapsed}
          aria-label={isMobile ? 'Toggle disabled on mobile' : (collapsed ? 'Expand sidebar' : 'Collapse sidebar')}
          disabled={isMobile}
          className={`p-2 rounded-md transition ${collapsed ? 'absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2' : ''} ${isMobile ? 'opacity-40 cursor-not-allowed' : 'hover:bg-muted/30'}`}
        >
          {collapsed ? <PanelLeftOpen className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-6 overflow-y-auto custom-scroll">
        {Object.entries(groupedItems).map(([sectionKey, items]) => (
          <div key={sectionKey} className="space-y-2">
            {!collapsed && (
              <h3 className="text-xs font-semibold uppercase tracking-wider px-3">
                {sections[sectionKey as keyof typeof sections]}
              </h3>
            )}
            {items.map(item => {
              const isActive = activeTab === item.id;
              return (
                <Link key={item.id} href={item.path}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full sidebar-button flex items-center rounded-lg px-3 py-2 text-sm transition-colors ${isActive ? ' bg-primary text-black' : ' hover:text-foreground hover:bg-primary/30'} ${collapsed ? 'justify-center' : ''}`}>
                  <item.icon className="h-4 w-4" />
                  {!collapsed && <span className="ml-3">{item.name}</span>}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-border flex-shrink-0">
        {!collapsed && (
          <div className="flex items-center space-x-3 mb-4">
            <Avatar>
              <AvatarFallback className="bg-green-primary text-primary-foreground">
                {user?.name?.[0] || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-sm">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 px-3 py-2 text-sm text-error hover:bg-warning/50 rounded-md hover:scale-105 transition-transform"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>

      {/* Drag Handle (disabled on mobile) */}
      <div
        onMouseDown={() => {
          if (!isMobile) setDragging(true);
        }}
        className={`w-1 cursor-col-resize h-full absolute right-0 top-0 z-10 ${dragging && !isMobile ? 'bg-indigo-500' : 'hover:bg-indigo-300'} ${isMobile ? 'pointer-events-none' : ''}`}
        aria-hidden={isMobile}
      />
    </aside>
  );
};

export default Sidebar;
