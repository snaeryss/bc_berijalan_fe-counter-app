"use server";
import { satellite } from "@/config/api.config";
import { APIBaseResponse } from "@/interfaces/api.interface";
import {
  ICounter,
  ICreateCounterRequest,
  IUpdateCounterRequest,
} from "@/interfaces/services/counter.interface";
import { errorMessage } from "@/utils/error.util";

const API_BASE_PATH = "/api/v1/counters";

export const apiGetAllCounters = async (includeInactive = false) => {
  try {
    const res = await satellite.get<APIBaseResponse<ICounter[]>>(
      `${API_BASE_PATH}/`,
      {
        params: { include_inactive: includeInactive },
      }
    );
    return res.data;
  } catch (e) {
    return errorMessage<ICounter[]>(e);
  }
};

export const apiGetCounterById = async (id: number) => {
  try {
    const res = await satellite.get<APIBaseResponse<ICounter>>(
      `${API_BASE_PATH}/${id}`
    );
    return res.data;
  } catch (e) {
    return errorMessage<ICounter>(e);
  }
};

export const apiCreateCounter = async (data: ICreateCounterRequest) => {
  try {
    const res = await satellite.post<APIBaseResponse<ICounter>>(
      `${API_BASE_PATH}/create`,
      data
    );
    return res.data;
  } catch (e) {
    return errorMessage<ICounter>(e);
  }
};

export const apiUpdateCounter = async (data: IUpdateCounterRequest) => {
  try {
    const id = data.id;
    delete data.id;
    const res = await satellite.put<APIBaseResponse<ICounter>>(
      `${API_BASE_PATH}/${id}`,
      data
    );
    return res.data;
  } catch (e) {
    return errorMessage<ICounter>(e);
  }
};

export const apiDeleteCounter = async (id: number) => {
  try {
    const res = await satellite.delete<APIBaseResponse<{ success: boolean }>>(
      `${API_BASE_PATH}/${id}`
    );
    return res.data;
  } catch (e) {
    return errorMessage<{ success: boolean }>(e);
  }
};

export const apiUpdateCounterStatus = async ({
  id,
  status,
}: {
  id: number;
  status: "active" | "inactive";
}) => {
  try {
    const res = await satellite.patch<APIBaseResponse<ICounter>>(
      `${API_BASE_PATH}/${id}/status`,
      { status }
    );
    return res.data;
  } catch (e) {
    return errorMessage<ICounter>(e);
  }
};