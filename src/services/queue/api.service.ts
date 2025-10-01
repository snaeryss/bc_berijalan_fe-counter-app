"use server";

import { satellite } from "@/config/api.config";
import { APIBaseResponse } from "@/interfaces/api.interface";
import {
  IClaimQueueResponse,
  ICreateQueueRequest,
  ICurrentQueuesResponse,
  IGetQueueMetricsResponse,
  INextQueueRequest,
  INextQueueResponse,
  IQueue,
  IReleaseQueueRequest,
  IResetQueuesRequest,
  IResetQueuesResponse,
  ISkipQueueRequest,
  ISkipQueueResponse,
  IUpdateQueueRequest,
} from "@/interfaces/services/queue.interface";
import { errorMessage } from "@/utils/error.util";

const API_BASE_PATH = "/api/v1/queues";

export const apiGetMetrics = async () => {
  try {
    const res = await satellite.get<APIBaseResponse<IGetQueueMetricsResponse>>(
      `${API_BASE_PATH}/metrics`
    );
    return res.data;
  } catch (e) {
    return errorMessage<IGetQueueMetricsResponse>(e);
  }
};

export const apiClaimQueue = async () => {
  try {
    const res = await satellite.post<APIBaseResponse<IClaimQueueResponse>>(
      `${API_BASE_PATH}/claim`
    );
    return res.data;
  } catch (e) {
    return errorMessage<IClaimQueueResponse>(e);
  }
};

export const apiReleaseQueue = async (data: IReleaseQueueRequest) => {
  try {
    const res = await satellite.post<APIBaseResponse<{ success: boolean }>>(
      `${API_BASE_PATH}/release`,
      data
    );
    return res.data;
  } catch (e) {
    return errorMessage<{ success: boolean }>(e);
  }
};

export const apiGetCurrentQueues = async () => {
  try {
    const res = await satellite.get<APIBaseResponse<ICurrentQueuesResponse[]>>(
      `${API_BASE_PATH}/current`
    );
    return res.data;
  } catch (e) {
    return errorMessage<ICurrentQueuesResponse[]>(e);
  }
};

export const apiSearchQueue = async (queueNumberOrCounterName: string) => {
  try {
    const res = await satellite.get<APIBaseResponse<IQueue[]>>(
      `${API_BASE_PATH}/search`,
      { params: { q: queueNumberOrCounterName } }
    );
    return res.data;
  } catch (e) {
    return errorMessage<IQueue[]>(e);
  }
};

export const apiNextQueue = async (data: INextQueueRequest) => {
  try {
    const res = await satellite.post<APIBaseResponse<INextQueueResponse>>(
      `${API_BASE_PATH}/next`,
      data
    );
    return res.data;
  } catch (e) {
    return errorMessage<INextQueueResponse>(e);
  }
};

export const apiResetQueues = async (data: IResetQueuesRequest) => {
  try {
    const res = await satellite.post<APIBaseResponse<IResetQueuesResponse>>(
      `${API_BASE_PATH}/reset`,
      data
    );
    return res.data;
  } catch (e) {
    return errorMessage<IResetQueuesResponse>(e);
  }
};

export const apiSkipQueue = async (data: ISkipQueueRequest) => {
  try {
    const res = await satellite.post<APIBaseResponse<ISkipQueueResponse>>(
      `${API_BASE_PATH}/skip`,
      data
    );
    return res.data;
  } catch (e) {
    return errorMessage<ISkipQueueResponse>(e);
  }
};

export const apiGetAllQueues = async (params: any) => {
  try {
    const res = await satellite.get<APIBaseResponse<IQueue[]>>(`${API_BASE_PATH}/`, { params });
    return res.data;
  } catch (e) {
    return errorMessage<IQueue[]>(e);
  }
};

export const apiGetQueueById = async (id: number) => {
  try {
    const res = await satellite.get<APIBaseResponse<IQueue>>(`${API_BASE_PATH}/${id}`);
    return res.data;
  } catch (e) {
    return errorMessage<IQueue>(e);
  }
};

export const apiCreateQueue = async (data: ICreateQueueRequest) => {
  try {
    const res = await satellite.post<APIBaseResponse<IQueue>>(`${API_BASE_PATH}/create`, data);
    return res.data;
  } catch (e) {
    return errorMessage<IQueue>(e);
  }
};

export const apiUpdateQueue = async (data: IUpdateQueueRequest) => {
  try {
    const id = data.id;
    const { id: _, ...rest } = data;
    const res = await satellite.put<APIBaseResponse<IQueue>>(`${API_BASE_PATH}/${id}`, rest);
    return res.data;
  } catch (e) {
    return errorMessage<IQueue>(e);
  }
};

export const apiDeleteQueue = async (id: number) => {
  try {
    const res = await satellite.delete<APIBaseResponse<{ success: boolean }>>(`${API_BASE_PATH}/${id}`);
    return res.data;
  } catch (e) {
    return errorMessage<{ success: boolean }>(e);
  }
};
