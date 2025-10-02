"use client";
import { FC, useState } from "react";
import Button from "../atoms/Button";
import Card from "../atoms/Card";
import {
  useClaimQueue,
  useReleaseQueue,
} from "@/services/queue/wrapper.service";
import { useCounterAppStore } from "@/stores/global-states/counter/counter-app.store";
import toast from "react-hot-toast";

interface QueueTicketProps {
  className?: string;
}

const QueueTicketPage: FC<QueueTicketProps> = ({ className }) => {
  const { claimedQueue, setClaimedQueue } = useCounterAppStore();
  const { mutate: claimQueue, isPending: isClaiming } = useClaimQueue();
  const { mutate: releaseQueue, isPending: isReleasing } = useReleaseQueue();

  const handleClaim = () => {
    claimQueue(undefined, {
      onSuccess: (res) => {
        if (res.status === false || !res.data) {
          return;
        }
        setClaimedQueue({
          counterId: res.data.counterId,
          counterName: res.data.counterName,
          estimatedWaitTime: res.data.estimatedWaitTime,
          position: res.data.positionInQueue,
          queueNumber: res.data.queueNumber,
        });
      },
    });
  };

  const handleReleaseQueue = () => {
    if (!claimedQueue?.counterId || !claimedQueue?.queueNumber) {
      toast.error("No queue to release");
      return;
    }

    releaseQueue(
      {
        counter_id: claimedQueue.counterId,
        queue_number: claimedQueue.queueNumber,
      },
      {
        onSuccess: (res) => {
          if (res.status === false) return;
          setClaimedQueue(null);
        },
      }
    );
  };

  return (
    <Card className={className}>
      <div className="flex flex-col items-center text-center">
        {!claimedQueue ? (
          <>
            <div className="bg-blue-500 rounded-full p-4 mb-6">
              <span className="material-symbols-outlined text-white text-4xl">
                confirmation_number
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Ambil Nomor Antrian Anda</h2>
            <p className="text-gray-500 mb-8 max-w-sm">
              Tekan tombol di bawah untuk mendapatkan nomor antrian dan melihat perkiraan waktu tunggu.
            </p>
            <Button
              size="lg"
              onClick={handleClaim}
              isLoading={isClaiming}
              className="w-full max-w-xs"
            >
              Ambil Nomor
            </Button>
          </>
        ) : (
          <div className="flex flex-col items-center w-full">
             <h2 className="text-2xl font-bold text-gray-800 mb-4">Nomor Antrian Anda</h2>
            <div className="w-full max-w-sm border-2 border-dashed border-gray-300 rounded-xl p-6 bg-gray-50 relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white w-8 h-8 rounded-full border-2 border-dashed border-gray-300"></div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-white w-8 h-8 rounded-full border-2 border-dashed border-gray-300"></div>

                <div className="text-gray-500 mb-1 text-sm">Nomor Anda</div>
                <div className="text-6xl font-bold text-blue-600 mb-2">
                  {claimedQueue?.queueNumber}
                </div>
                <div className="text-lg font-semibold text-gray-700">
                  di {claimedQueue?.counterName}
                </div>

                <hr className="my-6 border-dashed border-gray-300" />
                
                <div className="space-y-3 text-left">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Posisi di antrian:</span>
                        <span className="font-medium text-gray-800">{claimedQueue?.position}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Estimasi waktu tunggu:</span>
                        <span className="font-medium text-gray-800">
                        {claimedQueue?.estimatedWaitTime} menit
                        </span>
                    </div>
                </div>
            </div>

            <p className="text-xs text-gray-400 mt-6 max-w-xs">
              Harap simpan nomor antrian Anda. Anda dapat membatalkan jika berubah pikiran.
            </p>

            <Button
              variant="ghost"
              onClick={handleReleaseQueue}
              isLoading={isReleasing}
              className="mt-4 text-red-600 hover:bg-red-50"
            >
              Batalkan Antrian
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default QueueTicketPage;