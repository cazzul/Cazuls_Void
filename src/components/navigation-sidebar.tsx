"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, Dumbbell, Activity, Mountain, User, ChevronLeft, ChevronRight } from "lucide-react";

const navigation = [
  { name: "Overview", href: "/", icon: Home, color: "var(--color-accent)" },
  { name: "Calendar", href: "/calendar", icon: Calendar, color: "var(--color-border)" },
  { name: "Lifts", href: "/lifts", icon: Dumbbell, color: "var(--color-lifting)" },
  { name: "Running", href: "/running", icon: Activity, color: "var(--color-running)" },
  { name: "MTB", href: "/mtb", icon: Mountain, color: "var(--color-mtb)" },
];

export default function NavigationSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Auto-collapse on mobile screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) { // md breakpoint
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };

    // Set initial state
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside 
      className={`flex flex-col border-r transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-16' : 'w-64'
      }`} 
      style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)' }}
    >
      {/* Header Section */}
      <div className="p-6 border-b relative" style={{ borderColor: 'var(--color-border)' }}>
        {!isCollapsed && (
          <>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-rebels, Orbitron)' }}>
              CAZULS VOID
            </h1>
            <p className="text-sm" style={{ color: 'var(--color-secondary)', fontFamily: 'var(--font-main, Exo 2)' }}>Fitness Tracker</p>
          </>
        )}
        
        {/* Toggle Button */}
        <button
          onClick={toggleSidebar}
          className={`absolute top-1/2 transform -translate-y-1/2 p-2 rounded-lg hover:scale-105 transition-all duration-200 ${
            isCollapsed ? 'right-2' : '-right-3'
          }`}
          style={{
            backgroundColor: 'var(--color-active)',
            color: 'var(--color-foreground)',
            border: '2px solid var(--color-border)'
          }}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const IconComponent = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center w-full p-3 rounded-lg hover:scale-105 transition-all duration-200 ${
                isActive ? 'opacity-100' : 'hover:opacity-80'
              }`}
              style={{ 
                backgroundColor: isActive ? 'var(--color-hover)' : 'transparent'
              }}
              title={isCollapsed ? item.name : undefined}
            >
              {IconComponent && (
                <IconComponent 
                  className={`h-5 w-5 ${isCollapsed ? 'mx-auto' : 'mr-3'}`} 
                  style={{ color: item.color }} 
                />
              )}
              {!isCollapsed && (
                <span style={{ color: 'var(--color-foreground)' }}>{item.name}</span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
} 