"use server";
import DashboardLayout from "@/components/organisms/DashboardLayout";
import CronJobManager from "@/components/organisms/CronJobManager";

export default async function CronManagementPage() {
  return (
    <DashboardLayout>
      <CronJobManager />
    </DashboardLayout>
  );
}