// src/app/admin/page.tsx

"use server";

import AdminManagement from "@/components/organisms/AdminManagement";
import DashboardLayout from "@/components/organisms/DashboardLayout"; // 1. Import DashboardLayout

export default async function AdminPage() {
  // 2. Bungkus AdminManagement dengan DashboardLayout
  return (
    <DashboardLayout>
      <AdminManagement />
    </DashboardLayout>
  );
}