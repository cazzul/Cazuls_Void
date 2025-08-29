"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, Dumbbell, Activity, Mountain, User, ChevronLeft, ChevronRight } from "lucide-react";

const navigation = [
  { name: "Overview", href: "/", icon: Home, color: "oklch(0.488 0.243 264.376)" },
  { name: "Calendar", href: "/calendar", icon: Calendar, color: "oklch(0.696 0.17 162.48)" },
  { name: "Lifts", href: "/lifts", icon: Dumbbell, color: "oklch(0.627 0.265 303.9)" },
  { name: "Running", href: "/running", icon: Activity, color: "oklch(0.769 0.188 70.08)" },
  { name: "MTB", href: "/mtb", icon: Mountain, color: "oklch(0.645 0.246 16.439)" },
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
      style={{ backgroundColor: 'oklch(0.205 0 0)', borderColor: 'oklch(0.269 0 0)' }}
    >
      {/* Header Section */}
      <div className="p-6 border-b relative" style={{ borderColor: 'oklch(0.269 0 0)' }}>
        {!isCollapsed && (
          <>
            <h1 className="text-2xl font-bold" style={{ color: 'oklch(0.488 0.243 264.376)', fontFamily: 'var(--font-rebels, Orbitron)' }}>
              CAZULS VOID
            </h1>
            <p className="text-sm" style={{ color: 'oklch(0.708 0 0)', fontFamily: 'var(--font-main, Exo 2)' }}>Fitness Tracker</p>
          </>
        )}
        
        {/* Toggle Button */}
        <button
          onClick={toggleSidebar}
          className={`absolute top-1/2 transform -translate-y-1/2 p-2 rounded-lg hover:scale-105 transition-all duration-200 ${
            isCollapsed ? 'right-2' : '-right-3'
          }`}
          style={{ 
            backgroundColor: 'oklch(0.269 0 0)', 
            color: 'oklch(0.985 0 0)',
            border: '2px solid oklch(0.269 0 0)'
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
                backgroundColor: isActive ? 'oklch(0.269 0 0)' : 'transparent'
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
                <span style={{ color: 'oklch(0.985 0 0)' }}>{item.name}</span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
} 