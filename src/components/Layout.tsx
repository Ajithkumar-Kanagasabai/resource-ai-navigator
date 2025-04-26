
import React from 'react';
import { Menu, Sun, Moon } from 'lucide-react';
import { Button } from './ui/button';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-[300px] border-r bg-background p-4 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold">Resource BOT</h1>
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Search bar */}
        <div className="relative mb-4">
          <input
            type="search"
            placeholder="Search"
            className="w-full px-4 py-2 border rounded-lg bg-background"
          />
        </div>

        {/* Navigation Items */}
        <div className="space-y-2">
          <div className="px-3 py-2 hover:bg-accent rounded-lg cursor-pointer">
            Today
          </div>
          <div className="px-3 py-2 hover:bg-accent rounded-lg cursor-pointer">
            Previous 7 Days
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="border-b p-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Resource Utilization</h2>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Sun className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Moon className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
