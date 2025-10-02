"use client";
import {
  ICounter,
  ICreateCounterRequest,
  IUpdateCounterRequest,
} from "@/interfaces/services/counter.interface";
import React, { useState } from "react";
import Button from "../atoms/Button";
import Card from "../atoms/Card";
import CounterCard from "../molecules/CounterCard";
import CounterForm from "../molecules/CounterForm";
import CounterDetailModal from "../molecules/CounterDetailModal";

import {
  useGetAllCounters,
  useCreateCounter,
  useUpdateCounter,
  useDeleteCounter,
  useUpdateCounterStatus,
  useGetCounterById,
} from "@/services/counter/wrapper.service";

interface CounterManagerProps {
  className?: string;
}

const CounterManager: React.FC<CounterManagerProps> = ({ className }) => {
  const [isAddingCounter, setIsAddingCounter] = useState(false);
  const [editingCounter, setEditingCounter] = useState<ICounter | null>(null);
  const [selectedCounter, setSelectedCounter] = useState<ICounter | null>(null);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [detailCounterId, setDetailCounterId] = useState<number | null>(null);

  const { data: countersData, refetch: refetchCounters } =
    useGetAllCounters(true);
  const { mutate: createCounter, isPending: isCreating } = useCreateCounter();
  const { mutate: updateCounter, isPending: isUpdating } = useUpdateCounter();
  const { mutate: deleteCounter, isPending: isDeleting } = useDeleteCounter();
  const { mutate: updateStatus, isPending: isUpdatingStatus } =
    useUpdateCounterStatus();

  const { data: detailData, isLoading: isFetchingDetail } = useGetCounterById(
    detailCounterId!
  );

  const counters: ICounter[] = countersData?.data || [];

  const handleSubmit = (
    data: ICreateCounterRequest | IUpdateCounterRequest
  ) => {
    if (editingCounter) {
      updateCounter(
        { ...data, id: editingCounter.id },
        {
          onSuccess: (res) => {
            if (res.status) {
              setEditingCounter(null);
              refetchCounters();
            }
          },
        }
      );
    } else {
      createCounter(data as ICreateCounterRequest, {
        onSuccess: (res) => {
          if (res.status) {
            setIsAddingCounter(false);
            refetchCounters();
          }
        },
      });
    }
  };

  const handleCounterClick = (counter: ICounter) => {
    // Jika form sedang aktif, jangan lakukan apa-apa
    if(isAddingCounter || editingCounter) return;
    setSelectedCounter(counter.id === selectedCounter?.id ? null : counter);
  };

  const handleEditCounter = () => {
    if (selectedCounter) {
      setEditingCounter(selectedCounter);
      setSelectedCounter(null);
    }
  };

  const handleDeleteCounter = () => {
    if (selectedCounter) {
      deleteCounter(selectedCounter.id, {
        onSuccess: (res) => {
          if (res.status) {
            setSelectedCounter(null);
            refetchCounters();
          }
        },
      });
    }
  };

  const handleToggleStatus = () => {
    if (selectedCounter) {
      const newStatus = selectedCounter.isActive ? "inactive" : "active";
      updateStatus(
        { id: selectedCounter.id, status: newStatus },
        {
          onSuccess: (res) => {
            if (res.status) {
              setSelectedCounter(null);
              refetchCounters();
            }
          },
        }
      );
    }
  };

  const handleViewDetails = () => {
    if (selectedCounter) {
      setDetailCounterId(selectedCounter.id);
      setIsDetailModalOpen(true);
    }
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setDetailCounterId(null);
  };

  const handleCancel = () => {
    setIsAddingCounter(false);
    setEditingCounter(null);
  };

  return (
    <div className={className}>
      <Card className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Manajemen Counter
            </h2>
            <p className="text-gray-500 mt-1">Kelola semua counter/loket pelayanan yang tersedia.</p>
          </div>
          {!isAddingCounter && !editingCounter && (
            <Button
              onClick={() => setIsAddingCounter(true)}
              leftIcon={<span className="material-symbols-outlined">add</span>}
            >
              Tambah Counter
            </Button>
          )}
        </div>
      </Card>

      {isAddingCounter || editingCounter ? (
        <Card>
          <div className="flex justify-between items-center mb-4">
             <h3 className="text-lg font-semibold">
                {editingCounter ? "Edit Counter" : "Tambah Counter Baru"}
             </h3>
             <Button variant="ghost" onClick={handleCancel} className="text-gray-500 hover:bg-gray-100">
                Batal
             </Button>
          </div>
          <CounterForm
            counter={editingCounter || undefined}
            onSubmit={handleSubmit}
            isLoading={isCreating || isUpdating}
            isEditMode={!!editingCounter}
          />
        </Card>
      ) : (
        <>
          {selectedCounter && (
             <Card variant="outline" className="mb-6 bg-gray-50">
                <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-700">
                        Aksi untuk: <span className="text-blue-600">{selectedCounter.name}</span>
                    </p>
                    <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={handleViewDetails} leftIcon={<span className="material-symbols-outlined text-base">visibility</span>}>
                            Detail
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleEditCounter} leftIcon={<span className="material-symbols-outlined text-base">edit</span>}>
                            Edit
                        </Button>
                        <Button
                            size="sm"
                            variant={selectedCounter.isActive ? "secondary" : "primary"}
                            onClick={handleToggleStatus} isLoading={isUpdatingStatus}
                            leftIcon={<span className="material-symbols-outlined text-base">{selectedCounter.isActive ? "toggle_off" : "toggle_on"}</span>}
                        >
                            {selectedCounter.isActive ? "Non-aktifkan" : "Aktifkan"}
                        </Button>
                        <Button size="sm" variant="danger" onClick={handleDeleteCounter} isLoading={isDeleting} leftIcon={<span className="material-symbols-outlined text-base">delete</span>}>
                            Hapus
                        </Button>
                    </div>
                </div>
            </Card>
          )}

          {counters.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {counters.map((counter) => (
                <CounterCard
                  key={counter.id}
                  counter={counter}
                  isSelected={selectedCounter?.id === counter.id}
                  onClick={handleCounterClick}
                />
              ))}
            </div>
          ) : (
             <div className="text-center py-16">
                <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="material-symbols-outlined text-4xl text-gray-400">
                    store
                    </span>
                </div>
                <p className="text-lg text-gray-500">Belum ada counter.</p>
                <p className="text-sm text-gray-400 mt-1">Klik 'Tambah Counter' untuk membuat yang baru.</p>
            </div>
          )}
        </>
      )}
      <CounterDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        counterData={detailData?.data || null}
        isLoading={isFetchingDetail}
      />
    </div>
  );
};

export default CounterManager;