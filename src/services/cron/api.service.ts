"use client";
import { satellite } from "@/config/api.config";
import { APIBaseResponse } from "@/interfaces/api.interface";
import { errorMessage } from "@/utils/error.util";

export interface ICronJobStatus {
  name: string;
  expression: string;
}

export interface ICronStatusResponse {
  jobs: Record<string, ICronJobStatus>;
  availableJobs: string[];
  totalJobs: number;
}

export interface ICleanupPreview {
  totalExpiredCount: number;
  expiredByStatus: Record<string, number>;
  oldestEntry: string | null;
  cutoffDate: string;
}

export interface IManualRunResponse {
  jobName: string;
  executedAt: string;
}

export interface IControlJobResponse {
  jobName: string;
  action: string;
  timestamp: string;
}

export interface ICleanupRunResponse {
  type: string;
  daysOld: number;
  result: any;
  executedAt: string;
}

const API_BASE_PATH = "/api/v1/cron";

export const apiGetCronJobsStatus = async () => {
  try {
    const res = await satellite.get<APIBaseResponse<ICronStatusResponse>>(
      `${API_BASE_PATH}/status`
    );
    return res.data;
  } catch (e) {
    return errorMessage<ICronStatusResponse>(e);
  }
};

export const apiRunJobManually = async (jobName: string) => {
  try {
    const res = await satellite.post<APIBaseResponse<IManualRunResponse>>(
      `${API_BASE_PATH}/run/${jobName}`
    );
    return res.data;
  } catch (e) {
    return errorMessage<IManualRunResponse>(e);
  }
};

export const apiControlJob = async (jobName: string, action: "start" | "stop") => {
  try {
    const res = await satellite.patch<APIBaseResponse<IControlJobResponse>>(
      `${API_BASE_PATH}/control/${jobName}`,
      { action }
    );
    return res.data;
  } catch (e) {
    return errorMessage<IControlJobResponse>(e);
  }
};

export const apiGetCleanupPreview = async (daysOld: number = 1) => {
  try {
    const res = await satellite.get<APIBaseResponse<ICleanupPreview>>(
      `${API_BASE_PATH}/cleanup/preview`,
      { params: { daysOld } }
    );
    return res.data;
  } catch (e) {
    return errorMessage<ICleanupPreview>(e);
  }
};

export const apiRunCleanupManually = async (
  type: "full" | "queue" | "cache" | "status",
  daysOld: number = 1,
  statuses?: string[]
) => {
  try {
    const res = await satellite.post<APIBaseResponse<ICleanupRunResponse>>(
      `${API_BASE_PATH}/cleanup/run`,
      { type, daysOld, statuses }
    );
    return res.data;
  } catch (e) {
    return errorMessage<ICleanupRunResponse>(e);
  }
};