"use client";
import { ICounter } from "@/interfaces/services/counter.interface";
import { IQueue } from "@/interfaces/services/queue.interface";
import React, { useEffect, useState } from "react";
import Button from "../atoms/Button";
import Card from "../atoms/Card";
import Select from "../atoms/Select";
import CurrentQueueDisplay from "../molecules/CurrentQueueDisplay";
import { useGetAllCounters } from "@/services/counter/wrapper.service";
import {
  useGetActiveQueue, // <-- 1. IMPORT HOOK BARU
  useNextQueue,
  useServeQueue,
  useSkipQueue,
} from "@/services/queue/wrapper.service";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useSSEContext } from "./SSEProvider";

interface CounterOperatorProps {
  className?: string;
}

const CounterOperator: React.FC<CounterOperatorProps> = ({ className }) => {
  const [selectedCounter, setSelectedCounter] = useState<ICounter | null>(
    null
  );
  const [currentQueue, setCurrentQueue] = useState<IQueue | null>(null);

  const queryClient = useQueryClient();
  const { addEventListener } = useSSEContext();

  const { data: countersData, refetch: refetchCounters } = useGetAllCounters();
  const { mutate: getActiveQueue, isPending: isFetchingCurrent } =
    useGetActiveQueue(); // <-- 2. INISIALISASI HOOK
  const { mutate: nextQueue, isPending: isNexting } = useNextQueue();
  const { mutate: skipQueue, isPending: isSkipping } = useSkipQueue();
  const { mutate: serveQueue, isPending: isServing } = useServeQueue();

  // ... (useEffect tidak ada perubahan)
  useEffect(() => {
    const handleQueueUpdate = () => {
      console.log(
        "SSE event received! Refetching counters and current queue..."
      );
      refetchCounters();
      toast("Ada update antrian baru!", { icon: "🔔" });
    };

    const eventsToListen: string[] = [
      "queue_claimed",
      "queue_called",
      "queue_skipped",
      "queue_reset",
      "all_queues_reset",
      "queue_released",
      "queue_served",
    ];

    const unsubscribers = eventsToListen.map((event) =>
      addEventListener(event, handleQueueUpdate)
    );

    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    };
  }, [addEventListener, refetchCounters, queryClient]);


  const activeCounters: ICounter[] =
    countersData?.data?.filter((c) => c.isActive) || [];

  const handleCounterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const counterId = parseInt(e.target.value);
    const counter = activeCounters.find((c) => c.id === counterId);
    setSelectedCounter(counter || null);
    setCurrentQueue(null); // Reset saat ganti counter
  };
  
  // 3. BUAT FUNGSI BARU UNTUK FETCH ANTRIAN SAAT INI
  const handleFetchCurrentQueue = () => {
    if (!selectedCounter) return;

    getActiveQueue(selectedCounter.id, {
      onSuccess: (res) => {
        if (res.status && res.data) {
          setCurrentQueue(res.data);
          toast.success(`Antrian saat ini: ${res.data.number}`);
        } else {
          setCurrentQueue(null);
          toast.info("Tidak ada antrian yang sedang dilayani.");
        }
      },
      onError: () => {
        toast.error("Gagal mengambil data antrian saat ini.");
      },
    });
  };


  // ... (handleNextQueue, handleServeQueue, handleSkipQueue tidak ada perubahan)
  const handleNextQueue = () => {
    if (!selectedCounter) {
      toast.error("Silakan pilih counter terlebih dahulu.");
      return;
    }

    // PERBAIKAN: Tambahkan toast loading
    const toastId = toast.loading("Memanggil antrian berikutnya...");

    nextQueue(
      { counter_id: selectedCounter.id },
      {
        onSuccess: (res) => {
          // Dismiss loading toast
          toast.dismiss(toastId);

          // Check if response has error
          if (res?.error) {
            toast.error(res.error.message || "Gagal memanggil antrian berikutnya.");
            return;
          }

          // Check if response status is false
          if (!res?.status) {
            toast.error(res?.message || "Gagal memanggil antrian berikutnya.");
            return;
          }

          // PERBAIKAN UTAMA: Update currentQueue dengan data dari response
          if (res.data?.queue) {
            setCurrentQueue(res.data.queue);
            toast.success(
              `Antrian nomor ${res.data.queue.number} berhasil dipanggil!`,
              { duration: 3000 }
            );
          } else {
            // Jika tidak ada antrian
            toast.info("Tidak ada antrian berikutnya.");
            setCurrentQueue(null);
          }

          // Refetch counters untuk update UI lainnya
          refetchCounters();
        },
        onError: (error: any) => {
          toast.dismiss(toastId);
          toast.error(error?.message || "Terjadi kesalahan pada server.");
        },
      }
    );
  };

  const handleServeQueue = () => {
    if (!selectedCounter || !currentQueue) {
      toast.error("Tidak ada antrian yang sedang dipanggil.");
      return;
    }

    const toastId = toast.loading("Menyelesaikan pelayanan...");

    serveQueue(
      { counter_id: selectedCounter.id },
      {
        onSuccess: (res) => {
          toast.dismiss(toastId);

          if (res?.error) {
            toast.error(res.error.message || "Gagal menyelesaikan pelayanan.");
            return;
          }

          if (res.status) {
            toast.success(
              `Antrian nomor ${currentQueue.number} selesai dilayani.`
            );
            // PERBAIKAN: Reset currentQueue setelah selesai
            setCurrentQueue(null);
            refetchCounters();
          } else {
            toast.error(res?.message || "Gagal menyelesaikan pelayanan.");
          }
        },
        onError: (error: any) => {
          toast.dismiss(toastId);
          toast.error(error?.message || "Terjadi kesalahan pada server.");
        },
      }
    );
  };

  const handleSkipQueue = () => {
    if (!selectedCounter) {
      toast.error("Silakan pilih counter terlebih dahulu.");
      return;
    }

    if (!currentQueue) {
      toast.error("Tidak ada antrian yang sedang dipanggil.");
      return;
    }

    const toastId = toast.loading("Melewati antrian...");

    skipQueue(
      { counter_id: selectedCounter.id },
      {
        onSuccess: (res) => {
          toast.dismiss(toastId);

          if (res?.error) {
            toast.error(res.error.message || "Gagal melewati antrian.");
            return;
          }

          if (res.status && res.data) {
            toast.success(
              `Antrian nomor ${res.data.skippedQueue.number} telah dilewati.`
            );
            // PERBAIKAN: Update dengan antrian berikutnya (jika ada)
            setCurrentQueue(res.data.nextQueue || null);
            refetchCounters();
          } else {
            toast.error(res?.message || "Gagal melewati antrian.");
          }
        },
        onError: (error: any) => {
          toast.dismiss(toastId);
          toast.error(error?.message || "Terjadi kesalahan pada server.");
        },
      }
    );
  };


  return (
    <div className={className}>
      <Card className="mb-6">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
          OPERATOR COUNTER
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Panel untuk operator counter melayani antrian pengunjung
        </p>

        <Select
          label="Pilih Counter Anda"
          fullWidth
          options={[
            { value: "", label: "Pilih Counter", disabled: true },
            ...activeCounters.map((counter) => ({
              value: counter.id.toString(),
              label: counter.name,
              disabled: false,
            })),
          ]}
          value={selectedCounter?.id.toString() || ""}
          onChange={handleCounterChange}
        />
      </Card>

      {selectedCounter ? (
        <div className="space-y-6">
          {/* 4. TAMPILKAN TOMBOL BARU JIKA TIDAK ADA ANTRIAN AKTIF DI LAYAR */}
          {!currentQueue && (
            <Card variant="outline">
              <div className="flex items-center justify-between">
                <p className="text-gray-600">
                  Tidak ada antrian aktif di layar Anda.
                </p>
                <Button
                  onClick={handleFetchCurrentQueue}
                  isLoading={isFetchingCurrent}
                  leftIcon={
                    <span className="material-symbols-outlined">sync</span>
                  }
                >
                  Lihat Antrian Saat Ini
                </Button>
              </div>
            </Card>
          )}

          <CurrentQueueDisplay
            counterName={selectedCounter.name}
            queueNumber={currentQueue?.number || null}
            status={currentQueue?.status || "RELEASED"}
          />

          <div className="flex gap-4">
            {currentQueue && currentQueue.status === "CALLED" ? (
              <>
                <Button
                  fullWidth
                  variant="success"
                  leftIcon={
                    <span className="material-symbols-outlined">
                      check_circle
                    </span>
                  }
                  onClick={handleServeQueue}
                  isLoading={isServing}
                  disabled={isNexting || isSkipping || isServing}
                >
                  Selesai Melayani
                </Button>
                <Button
                  fullWidth
                  variant="danger"
                  leftIcon={
                    <span className="material-symbols-outlined">skip_next</span>
                  }
                  onClick={handleSkipQueue}
                  isLoading={isSkipping}
                  disabled={isNexting || isServing || isSkipping}
                >
                  Lewati Antrian
                </Button>
              </>
            ) : (
              <Button
                fullWidth
                leftIcon={
                  <span className="material-symbols-outlined">
                    arrow_forward
                  </span>
                }
                onClick={handleNextQueue}
                isLoading={isNexting}
                disabled={isNexting || isSkipping || isServing || isFetchingCurrent}
              >
                Panggil Antrian Berikutnya
              </Button>
            )}
          </div>
        </div>
      ) : (
        <Card variant="outline" className="text-center py-8 text-gray-500">
          Silahkan pilih counter untuk mulai melayani antrian
        </Card>
      )}
    </div>
  );
};
export default CounterOperator;