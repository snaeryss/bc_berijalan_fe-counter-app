"use client";
import React from "react";
import Button from "../atoms/Button";
import { ICounter } from "@/interfaces/services/counter.interface";
import { Loader } from "../atoms/Loader"; // Import komponen Loader

interface CounterDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  counterData: (ICounter & { activeQueueNumber?: number | null; activeQueueStatus?: string | null; }) | null;
  isLoading: boolean;
}

const CounterDetailModal: React.FC<CounterDetailModalProps> = ({
  isOpen,
  onClose,
  counterData,
  isLoading,
}) => {
  if (!isOpen) return null;

  const formatStatus = (status: string | null | undefined) => {
    if (!status) return "0";
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-4 text-center">
        <div
          className="fixed inset-0 transition-opacity -z-10 backdrop-blur-sm"
          aria-hidden="true"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div className="inline-block w-full max-w-md my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
          <div className="p-6">
            <h3 className="text-lg font-bold leading-6 text-gray-900">
              {counterData?.name || "..."}
            </h3>
          </div>

          <hr />
          <div className="p-6">
            {isLoading ? (
              <div className="flex justify-center items-center h-24">
                <Loader size="lg" />
              </div>
            ) : (
              <div className="space-y-4 text-sm">
                <div className="flex items-center justify-between">
                  <p className="text-gray-600 flex items-center">
                    <span className="material-symbols-outlined text-base mr-2">confirmation_number</span>
                    Nomor Antrian Aktif
                  </p>
                  <p className="font-semibold  rounded">
                    {counterData?.activeQueueNumber || "0"}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-gray-600 flex items-center">
                    <span className="material-symbols-outlined text-base mr-2">hourglass_empty</span>
                    Status Antrian Aktif
                  </p>
                  <p className="font-semibold text-gray-800">
                    {formatStatus(counterData?.activeQueueStatus)}
                  </p>
                </div>
                 <div className="flex items-center justify-between">
                  <p className="text-gray-600 flex items-center">
                    <span className="material-symbols-outlined text-base mr-2">group</span>
                    Maksimal Antrian
                  </p>
                  <p className="font-semibold text-gray-800">
                    {counterData?.maxQueue}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-gray-50 px-6 py-3 text-right">
            <Button variant="secondary" onClick={onClose}>
              Tutup
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CounterDetailModal;