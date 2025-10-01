"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  apiCreateCounter,
  apiDeleteCounter,
  apiGetAllCounters,
  apiGetCounterById,
  apiUpdateCounter,
  apiUpdateCounterStatus,
} from "./api.service";
import {
  ICreateCounterRequest,
  IUpdateCounterRequest,
} from "@/interfaces/services/counter.interface";
import toast from "react-hot-toast";

const COUNTER_KEYS = {
  all: (includeInactive: boolean) => ["counters", { includeInactive }] as const,
  byId: (id: number) => ["counters", id] as const,
};

export const useGetAllCounters = (includeInactive = false) => {
  return useQuery({
    queryKey: COUNTER_KEYS.all(includeInactive),
    queryFn: () => apiGetAllCounters(includeInactive),
  });
};

export const useGetCounterById = (id: number) => {
  return useQuery({
    queryKey: COUNTER_KEYS.byId(id),
    queryFn: () => apiGetCounterById(id),
    enabled: !!id,
  });
};

export const useCreateCounter = () => {
  return useMutation({
    mutationFn: (data: ICreateCounterRequest) => apiCreateCounter(data),
    onSuccess: (response) => {
      if (response?.status) {
        toast.success("Counter berhasil dibuat");
      }
    },
  });
};

export const useUpdateCounter = () => {
  return useMutation({
    mutationFn: (data: IUpdateCounterRequest) => apiUpdateCounter(data),
    onSuccess: (response) => {
      if (response?.status) {
        toast.success("Counter berhasil diperbarui");
      }
    },
  });
};

export const useDeleteCounter = () => {
  return useMutation({
    mutationFn: (id: number) => apiDeleteCounter(id),
    onSuccess: (response) => {
      if (response?.status) {
        toast.success("Counter berhasil dihapus");
      }
    },
  });
};

export const useUpdateCounterStatus = () => {
  return useMutation({
    mutationFn: (data: { id: number; status: "active" | "inactive" }) =>
      apiUpdateCounterStatus(data),
    onSuccess: (response) => {
      if (response?.status) {
        toast.success("Status counter berhasil diperbarui");
      }
    },
  });
};