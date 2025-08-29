"use client";

import { useState, useEffect } from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavigationSidebar from "@/components/navigation-sidebar";

const inter = Inter({ subsets: ["latin"] });

function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-right">
      <p className="text-lg font-bold" style={{ color: 'oklch(0.488 0.243 264.376)' }}>
        {time.toLocaleTimeString()}
      </p>
      <p className="text-xs" style={{ color: 'oklch(0.708 0 0)' }}>
        {time.toLocaleDateString()}
      </p>
    </div>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} font-mono`} style={{ backgroundColor: 'oklch(0.145 0 0)', color: 'oklch(0.985 0 0)' }}>
        <div className="flex h-screen">
          <NavigationSidebar />
          <main className="flex-1 overflow-auto">
            {/* Global Header with Clock */}
            <header className="flex justify-end items-center p-6 border-b" style={{ borderColor: 'oklch(0.269 0 0)', backgroundColor: 'oklch(0.145 0 0)' }}>
              <Clock />
            </header>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
