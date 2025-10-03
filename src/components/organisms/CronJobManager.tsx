"use client";
import React, { useState } from "react";
import Card from "../atoms/Card";
import {
  useGetCronJobsStatus,
  useRunJobManually,
  useControlJob,
  useGetCleanupPreview,
  useRunCleanupManually,
} from "@/services/cron/wrapper.service";
import { Loader } from "../atoms/Loader";
import Badge from "../atoms/Badge";
import Button from "../atoms/Button";
import toast from "react-hot-toast";

const CronJobManager: React.FC = () => {
  const { data: cronStatusData, isLoading, refetch } = useGetCronJobsStatus();
  const runJobMutation = useRunJobManually();
  const controlJobMutation = useControlJob();
  const runCleanupMutation = useRunCleanupManually();

  const [previewDays, setPreviewDays] = useState(1);
  const { data: previewData, refetch: refetchPreview, isFetching: isPreviewLoading } = useGetCleanupPreview(previewDays);

  const [showCleanupModal, setShowCleanupModal] = useState(false);
  const [cleanupType, setCleanupType] = useState<"full" | "queue" | "cache" | "status">("full");
  const [cleanupDays, setCleanupDays] = useState(1);

  const cronJobs = cronStatusData?.data?.jobs;
  const availableJobs = cronStatusData?.data?.availableJobs || [];

  const handleRunJob = async (jobName: string) => {
    try {
      const result = await runJobMutation.mutateAsync(jobName);
      if (result.status) {
        toast.success(`Job "${jobName}" berhasil dijalankan!`);
      } else {
        toast.error(result.message || "Gagal menjalankan job");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat menjalankan job");
    }
  };

  const handleControlJob = async (jobName: string, action: "start" | "stop") => {
    try {
      const result = await controlJobMutation.mutateAsync({ jobName, action });
      if (result.status) {
        toast.success(`Job "${jobName}" berhasil ${action === "start" ? "dijalankan" : "dihentikan"}!`);
      } else {
        toast.error(result.message || `Gagal ${action} job`);
      }
    } catch (error) {
      toast.error(`Terjadi kesalahan saat ${action} job`);
    }
  };

  const handlePreviewCleanup = async () => {
    try {
      await refetchPreview();
      toast.success("Preview cleanup berhasil dimuat");
    } catch (error) {
      toast.error("Gagal memuat preview cleanup");
    }
  };

  const handleRunCleanup = async () => {
    try {
      const result = await runCleanupMutation.mutateAsync({
        type: cleanupType,
        daysOld: cleanupDays,
      });
      if (result.status) {
        toast.success(`Cleanup "${cleanupType}" berhasil dijalankan!`);
        setShowCleanupModal(false);
      } else {
        toast.error(result.message || "Gagal menjalankan cleanup");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat menjalankan cleanup");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Manajemen Cron Job
            </h2>
            <p className="text-gray-500 mt-1">
              Pantau dan kelola tugas terjadwal di server.
            </p>
          </div>
          <Button
            onClick={() => refetch()}
            leftIcon={<span className="material-symbols-outlined">refresh</span>}
            isLoading={isLoading}
          >
            Refresh
          </Button>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold mb-4">Status Cron Job</h3>
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader />
          </div>
        ) : cronJobs && availableJobs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama Job
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jadwal (Expression)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {availableJobs.map((jobName) => {
                  const jobDetails = cronJobs[jobName];
                  if (!jobDetails) return null;

                  return (
                    <tr key={jobName}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {jobDetails.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                        {jobDetails.expression}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Badge variant="success">Aktif</Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleRunJob(jobName)}
                          isLoading={runJobMutation.isPending}
                          leftIcon={<span className="material-symbols-outlined text-sm">play_arrow</span>}
                        >
                          Run
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleControlJob(jobName, "stop")}
                          isLoading={controlJobMutation.isPending}
                          leftIcon={<span className="material-symbols-outlined text-sm">pause</span>}
                        >
                          Stop
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center py-10 text-gray-500">
            Tidak dapat memuat status cron job atau tidak ada job yang tersedia.
          </p>
        )}
      </Card>

      <Card>
        <h3 className="text-lg font-semibold mb-4">Preview Cleanup</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Umur Data (Hari)
              </label>
              <input
                type="number"
                min="1"
                max="365"
                value={previewDays}
                onChange={(e) => setPreviewDays(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="pt-6">
              <Button
                onClick={handlePreviewCleanup}
                isLoading={isPreviewLoading}
                leftIcon={<span className="material-symbols-outlined">preview</span>}
              >
                Load Preview
              </Button>
            </div>
          </div>

          {previewData?.data && (
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Total Data Kadaluarsa:</span>
                <span className="text-lg font-bold text-red-600">
                  {previewData.data.totalExpiredCount}
                </span>
              </div>
              
              <div className="border-t pt-3">
                <p className="text-sm font-medium text-gray-700 mb-2">Per Status:</p>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(previewData.data.expiredByStatus).map(([status, count]) => (
                    <div key={status} className="flex justify-between text-sm">
                      <span className="text-gray-600">{status}:</span>
                      <span className="font-semibold">{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {previewData.data.oldestEntry && (
                <div className="border-t pt-3">
                  <p className="text-sm text-gray-600">
                    Data tertua: {new Date(previewData.data.oldestEntry).toLocaleString('id-ID')}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold mb-4">Manual Cleanup</h3>
        <p className="text-gray-600 text-sm mb-4">
          Jalankan proses cleanup secara manual tanpa menunggu jadwal otomatis.
        </p>
        <Button
          onClick={() => setShowCleanupModal(true)}
          leftIcon={<span className="material-symbols-outlined">delete_sweep</span>}
        >
          Jalankan Cleanup
        </Button>
      </Card>

      {showCleanupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Jalankan Manual Cleanup</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipe Cleanup
                </label>
                <select
                  value={cleanupType}
                  onChange={(e) => setCleanupType(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="full">Full Cleanup (Queue + Cache)</option>
                  <option value="queue">Queue Only</option>
                  <option value="cache">Cache Only</option>
                  <option value="status">Status-based Cleanup</option>
                </select>
              </div>

              {cleanupType !== "cache" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Umur Data (Hari)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="365"
                    value={cleanupDays}
                    onChange={(e) => setCleanupDays(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                <p className="text-sm text-yellow-800">
                  ⚠️ Peringatan: Aksi ini akan menghapus data secara permanen!
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                onClick={handleRunCleanup}
                isLoading={runCleanupMutation.isPending}
                className="flex-1"
              >
                Jalankan
              </Button>
              <Button
                variant="secondary"
                onClick={() => setShowCleanupModal(false)}
                className="flex-1"
              >
                Batal
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CronJobManager;