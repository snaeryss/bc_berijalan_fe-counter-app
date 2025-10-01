"use server";
import DashboardLayout from "@/components/organisms/DashboardLayout";
import QueueManagementPage from "@/components/organisms/QueueManagementPage";

export default async function Page() {
  return (
    <DashboardLayout>
      <QueueManagementPage />
    </DashboardLayout>
  );
}