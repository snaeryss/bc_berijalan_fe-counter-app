"use client";
import React from "react";
import { cn } from "@/utils/classname.util";
import Nav from "../organisms/Nav";
import Button from "../atoms/Button";
import { logoutAction } from "@/actions/auth.actions";
import { useTransition } from "react";

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(() => {
      logoutAction();
    });
  };
  return (
    <div
      className={cn(
        "w-64 border-r border-gray-200 bg-white h-screen",
        className
      )}
    >
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <h1 className="text-xl font-bold text-gray-800">Queue Management</h1>
        <p className="text-sm text-gray-500">Sistem Manajemen Antrian</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <Nav />
      </div>

      <div className="p-4 border-t border-gray-200 flex-shrink-0">
        <Button
          fullWidth
          variant="outline"
          leftIcon={<span className="material-symbols-outlined">logout</span>}
          onClick={handleLogout}
          isLoading={isPending}
          disabled={isPending}
          className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
        >
          Logout
        </Button>
        <div className="text-xs text-gray-400 mt-4 text-center">
          &copy; {new Date().getFullYear()} Ageng Bootcamp by Berijalan
        </div>
      </div>
    </div>
  );
};

export default Sidebar;