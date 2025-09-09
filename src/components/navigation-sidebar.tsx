"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, Dumbbell, Activity, Mountain, User, ChevronLeft, ChevronRight } from "lucide-react";

const navigation = [
  { name: "Overview", href: "/", icon: Home, color: "oklch(74.1% 0.054 62.9)" }, // Terracotta
  { name: "Calendar", href: "/calendar", icon: Calendar, color: "oklch(90% 0.012 235)" }, // Spring Rain
  { name: "Lifts", href: "/lifts", icon: Dumbbell, color: "oklch(68.6% 0.021 73.1)" }, // Latte
  { name: "Running", href: "/running", icon: Activity, color: "oklch(93.5% 0.005 250)" }, // Cool Gray
  { name: "MTB", href: "/mtb", icon: Mountain, color: "oklch(79.6% 0.025 76.5)" }, // Dusk
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
      style={{ backgroundColor: 'oklch(87.1% 0.018 78.4)', borderColor: 'oklch(90% 0.012 235)' }} // Sweet Beige background, Spring Rain border
    >
      {/* Header Section */}
      <div className="p-6 border-b relative" style={{ borderColor: 'oklch(90% 0.012 235)' }}> {/* Spring Rain border */}
        {!isCollapsed && (
          <>
            <h1 className="text-2xl font-bold" style={{ color: 'oklch(74.1% 0.054 62.9)', fontFamily: 'var(--font-rebels, Orbitron)' }}> {/* Terracotta */}
              CAZULS VOID
            </h1>
            <p className="text-sm" style={{ color: 'oklch(91% 0.007 90)', fontFamily: 'var(--font-main, Exo 2)' }}>Fitness Tracker</p> {/* Taupe */}
          </>
        )}
        
        {/* Toggle Button */}
        <button
          onClick={toggleSidebar}
          className={`absolute top-1/2 transform -translate-y-1/2 p-2 rounded-lg hover:scale-105 transition-all duration-200 ${
            isCollapsed ? 'right-2' : '-right-3'
          }`}
          style={{
            backgroundColor: 'oklch(79.6% 0.025 76.5)', // Dusk
            color: 'oklch(68.6% 0.021 73.1)', // Latte
            border: '2px solid oklch(90% 0.012 235)' // Spring Rain
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
                backgroundColor: isActive ? 'oklch(88.7% 0.009 89.1)' : 'transparent' // Oat for active state
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
                <span style={{ color: 'oklch(68.6% 0.021 73.1)' }}>{item.name}</span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
} 