"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  apiGetCronJobsStatus,
  apiRunJobManually,
  apiControlJob,
  apiGetCleanupPreview,
  apiRunCleanupManually,
} from "./api.service";

const CRON_KEYS = {
  status: ["cron", "status"] as const,
  preview: (daysOld: number) => ["cron", "preview", daysOld] as const,
};

export const useGetCronJobsStatus = () => {
  return useQuery({
    queryKey: CRON_KEYS.status,
    queryFn: () => apiGetCronJobsStatus(),
    refetchInterval: 30000, 
  });
};

export const useRunJobManually = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (jobName: string) => apiRunJobManually(jobName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CRON_KEYS.status });
    },
  });
};

export const useControlJob = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ jobName, action }: { jobName: string; action: "start" | "stop" }) =>
      apiControlJob(jobName, action),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CRON_KEYS.status });
    },
  });
};

export const useGetCleanupPreview = (daysOld: number = 1) => {
  return useQuery({
    queryKey: CRON_KEYS.preview(daysOld),
    queryFn: () => apiGetCleanupPreview(daysOld),
    enabled: false, // Manual trigger only
  });
};

export const useRunCleanupManually = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({
      type,
      daysOld,
      statuses,
    }: {
      type: "full" | "queue" | "cache" | "status";
      daysOld?: number;
      statuses?: string[];
    }) => apiRunCleanupManually(type, daysOld, statuses),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CRON_KEYS.status });
    },
  });
};