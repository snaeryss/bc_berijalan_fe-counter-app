"use client";
import {
  ICreateQueueRequest,
  INextQueueRequest,
  IReleaseQueueRequest,
  IResetQueuesRequest,
  ISkipQueueRequest,
  IUpdateQueueRequest,
  IUpdateQueueStatusRequest, 
} from "@/interfaces/services/queue.interface";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  apiClaimQueue,
  apiCreateQueue,
  apiDeleteQueue,
  apiGetAllQueues,
  apiGetCurrentQueues,
  apiGetMetrics,
  apiGetQueueById,
  apiNextQueue,
  apiReleaseQueue,
  apiResetQueues,
  apiSearchQueue,
  apiSkipQueue,
  apiUpdateQueue,
  apiBulkDeleteQueue,
  apiServeQueue,
  apiGetActiveQueueByCounterId, 
  apiUpdateQueueStatus, 
} from "./api.service";

const QUEUE_KEYS = {
  all: (params: any) => ["queues", params] as const,
  current: () => ["queues", "current"] as const,
  metrics: () => ["queues", "metrics"] as const,
  search: (query: string) => ["queues", "search", query] as const,
  byId: (id: number) => ["queues", id] as const,
};

export const useGetMetrics = () => {
  return useQuery({
    queryKey: QUEUE_KEYS.metrics(),
    queryFn: () => apiGetMetrics(),
  });
};

export const useGetCurrentQueues = () => {
  return useQuery({
    queryKey: QUEUE_KEYS.current(),
    queryFn: () => apiGetCurrentQueues(),
    refetchInterval: 30000,
    refetchOnWindowFocus: false,
  });
};

export const useSearchQueue = (query: string, enabled: boolean) => {
  return useQuery({
    queryKey: QUEUE_KEYS.search(query),
    queryFn: () => apiSearchQueue(query),
    enabled: enabled && !!query,
  });
};

export const useClaimQueue = () => {
  return useMutation({
    mutationFn: () => apiClaimQueue(),
    onSuccess: (response) => {
      const toastId = toast.loading("Memproses permintaan...", {
        duration: 5000,
      });
      if (response && response.error) {
        toast.error(response.error.message || "Failed to claim queue", {
          id: toastId,
        });
        return;
      }

      if (response && response.status === true) {
        toast.success("Nomor antrian berhasil diambil", { id: toastId });
      } else {
        toast.error(response?.message || "Failed to claim queue", {
          id: toastId,
        });
      }
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to claim queue");
    },
  });
};

export const useReleaseQueue = () => {
  return useMutation({
    mutationFn: (data: IReleaseQueueRequest) => apiReleaseQueue(data),
    onSuccess: (response) => {
      const toastId = toast.loading("Memproses permintaan...", {
        duration: 5000,
      });
      if (response && response.error) {
        toast.error(response.error.message || "Failed to release queue", {
          id: toastId,
        });
        return;
      }

      if (response && response.status === true) {
        toast.success("Nomor antrian berhasil dilepaskan", { id: toastId });
      } else {
        toast.error(response?.message || "Failed to release queue", {
          id: toastId,
        });
      }
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to release queue");
    },
  });
};

export const useNextQueue = () => {
  return useMutation({
    mutationFn: (data: INextQueueRequest) => apiNextQueue(data),
    onSuccess: (response) => {
      if (response && response.error) {
        toast.error(response.error.message || "Gagal memproses antrian berikutnya");
        return;
      }
      if (response && response.status === true) {
      } else {
        toast.error(response?.message || "Gagal memproses antrian berikutnya");
      }
    },
    onError: (error) => {
      toast.error(error?.message || "Gagal memproses antrian berikutnya");
    },
  });
};

export const useSkipQueue = () => {
  return useMutation({
    mutationFn: (data: ISkipQueueRequest) => apiSkipQueue(data),
    onSuccess: (response) => {
      const toastId = toast.loading("Memproses permintaan...", {
        duration: 5000,
      });
      if (response && response.error) {
        toast.error(response.error.message || "Failed to skip queue", {
          id: toastId,
        });
        return;
      }

      if (response && response.status === true) {
        toast.success("Berhasil melewati antrian", { id: toastId });
      } else {
        toast.error(response?.message || "Failed to skip queue", {
          id: toastId,
        });
      }
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to skip queue");
    },
  });
};

export const useResetQueues = () => {
  return useMutation({
    mutationFn: (data: IResetQueuesRequest) => apiResetQueues(data),
    onSuccess: (response) => {
      const toastId = toast.loading("Memproses permintaan...", {
        duration: 5000,
      });
      if (response?.error) {
        toast.error(response.error.message || "Failed to reset queues", {
          id: toastId,
        });
        return;
      }

      if (response && response.status === true) {
        toast.success("Berhasil mereset antrian", { id: toastId });
      } else {
        toast.error(response?.message || "Failed to reset queues", {
          id: toastId,
        });
      }
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to reset queues");
    },
  });
};

export const useGetActiveQueue = () => {
  return useMutation({
    mutationFn: (counterId: number) => apiGetActiveQueueByCounterId(counterId),
  });
};

export const useGetAllQueues = (params: any) => {
  return useQuery({
    queryKey: QUEUE_KEYS.all(params),
    queryFn: () => apiGetAllQueues(params),
  });
};

export const useGetQueueById = (id: number) => {
  return useQuery({
    queryKey: QUEUE_KEYS.byId(id),
    queryFn: () => apiGetQueueById(id),
    enabled: !!id,
  });
};

export const useCreateQueue = () => {
  return useMutation({
    mutationFn: (data: ICreateQueueRequest) => apiCreateQueue(data),
    onSuccess: (response) => {
      const toastId = toast.loading("Membuat antrian...");
      if (response && response.error) {
        toast.error(response.error.message || "Gagal membuat antrian", { id: toastId });
        return;
      }
      if (response && response.status === true) {
        toast.success("Antrian berhasil dibuat", { id: toastId });
      } else {
        toast.error(response?.message || "Gagal membuat antrian", { id: toastId });
      }
    },
    onError: (error) => {
      toast.error(error?.message || "Gagal membuat antrian");
    },
  });
};

export const useUpdateQueue = () => {
  return useMutation({
    mutationFn: (data: IUpdateQueueRequest) => apiUpdateQueue(data),
    onSuccess: (response) => {
      const toastId = toast.loading("Memperbarui antrian...");
      if (response && response.error) {
        toast.error(response.error.message || "Gagal memperbarui antrian", { id: toastId });
        return;
      }
      if (response && response.status === true) {
        toast.success("Antrian berhasil diperbarui", { id: toastId });
      } else {
        toast.error(response?.message || "Gagal memperbarui antrian", { id: toastId });
      }
    },
    onError: (error) => {
      toast.error(error?.message || "Gagal memperbarui antrian");
    },
  });
};

export const useDeleteQueue = () => {
  return useMutation({
    mutationFn: (id: number) => apiDeleteQueue(id),
    onSuccess: (response) => {
      const toastId = toast.loading("Menghapus antrian...");
      if (response && response.error) {
        toast.error(response.error.message || "Gagal menghapus antrian", { id: toastId });
        return;
      }
      if (response && response.status === true) {
        toast.success("Antrian berhasil dihapus", { id: toastId });
      } else {
        toast.error(response?.message || "Gagal menghapus antrian", { id: toastId });
      }
    },
    onError: (error) => {
      toast.error(error?.message || "Gagal menghapus antrian");
    },
  });
};

export const useBulkDeleteQueues = () => {
  return useMutation({
    mutationFn: (ids: number[]) => apiBulkDeleteQueue(ids),
    onSuccess: (response) => {
      if (response.status) {
        toast.success(response.message || "Antrian terpilih berhasil dihapus");
      }
    },
  });
}

export const useServeQueue = () => {
  return useMutation({
    mutationFn: (data: ISkipQueueRequest) => apiServeQueue(data),
    onSuccess: (response) => {
      if (response.status) {
        toast.success("Antrian telah selesai dilayani.");
      }
    },
  });
};

export const useUpdateQueueStatus = () => {
  return useMutation({
    mutationFn: (data: IUpdateQueueStatusRequest) => apiUpdateQueueStatus(data),
    onSuccess: (response) => {
      if (response.status) {
        toast.success(response.message || "Status antrian berhasil diperbarui.");
      }
    },
    onError: (error) => {
      toast.error(error.message || "Gagal memperbarui status antrian.");
    }
  });
};