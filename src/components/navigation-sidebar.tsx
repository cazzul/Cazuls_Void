"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, Dumbbell, Activity, Mountain, User } from "lucide-react";

const navigation = [
  { name: "Overview", href: "/", icon: Home, color: "oklch(0.488 0.243 264.376)" },
  { name: "Calendar", href: "/calendar", icon: Calendar, color: "oklch(0.696 0.17 162.48)" },
  { name: "Lifts", href: "/lifts", icon: Dumbbell, color: "oklch(0.627 0.265 303.9)" },
  { name: "Running", href: "/running", icon: Activity, color: "oklch(0.769 0.188 70.08)" },
  { name: "MTB", href: "/mtb", icon: Mountain, color: "oklch(0.645 0.246 16.439)" },
];

export default function NavigationSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 flex flex-col border-r" style={{ backgroundColor: 'oklch(0.205 0 0)', borderColor: 'oklch(0.269 0 0)' }}>
      <div className="p-6 border-b" style={{ borderColor: 'oklch(0.269 0 0)' }}>
        <h1 className="text-2xl font-bold" style={{ color: 'oklch(0.488 0.243 264.376)', fontFamily: 'var(--font-rebels, Orbitron)' }}>
          CAZULS VOID
        </h1>
        <p className="text-sm" style={{ color: 'oklch(0.708 0 0)', fontFamily: 'var(--font-main, Exo 2)' }}>Fitness Tracker</p>
      </div>
      
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
            >
              {IconComponent && (
                <IconComponent 
                  className="mr-3 h-5 w-5" 
                  style={{ color: item.color }} 
                />
              )}
              <span style={{ color: 'oklch(0.985 0 0)' }}>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
} 