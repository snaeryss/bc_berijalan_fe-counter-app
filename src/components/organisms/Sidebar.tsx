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
        "w-64 border-r border-gray-200 bg-white h-screen  justify-between",
        className
      )}
    >
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">Queue Management</h1>
        <p className="text-sm text-gray-500">Sistem Manajemen Antrian</p>
      </div>
      <div className="flex-1 overflow-auto p-4">
        <Nav />
      </div>

      <div className="p-4 border-t border-gray-200 bg">
        <Button
          fullWidth
          leftIcon={<span className="material-symbols-outlined">logout</span>}
          onClick={handleLogout}
          isLoading={isPending}
          disabled={isPending}
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          Logout
        </Button>
        <div className="text-xs text-gray-500 mt-4 text-center">
          &copy; {new Date().getFullYear()} Ageng Bootcamp by Berijalan
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
