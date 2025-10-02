"use client";
import React, { useState } from "react";
import Card from "../atoms/Card";
import Button from "../atoms/Button";
import QueueTable from "./QueueTable";
import {
  useGetAllQueues,
  useCreateQueue,
  useUpdateQueue,
  useDeleteQueue,
  useResetQueues,
  useBulkDeleteQueues,
} from "@/services/queue/wrapper.service";
import {
  IQueue,
  ICreateQueueRequest,
  IUpdateQueueRequest,
  TQueueStatusAction,
} from "@/interfaces/services/queue.interface";
import QueueFormModal from "./QueueFormModal";

const QueueManagementPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQueue, setEditingQueue] = useState<IQueue | null>(null);
  const [selectedQueues, setSelectedQueues] = useState<number[]>([]);

  const { data: queuesData, isLoading, refetch } = useGetAllQueues({});
  const { mutate: createQueue, isPending: isCreating } = useCreateQueue();
  const { mutate: updateQueue, isPending: isUpdating } = useUpdateQueue();
  const { mutate: deleteQueue, isPending: isDeleting } = useDeleteQueue();
  const { mutate: resetAllQueues, isPending: isResetting } = useResetQueues();
  const { mutate: bulkDelete, isPending: isBulkDeleting } =
    useBulkDeleteQueues();

  const handleOpenCreate = () => {
    setEditingQueue(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (queue: IQueue) => {
    setEditingQueue(queue);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingQueue(null);
  };

  const handleSubmit = (data: ICreateQueueRequest | IUpdateQueueRequest) => {
    const action = editingQueue ? updateQueue : createQueue;
    action(data as any, {
      onSuccess: (res) => {
        if (res.status) {
          handleCloseModal();
          refetch();
        }
      },
    });
  };

  const handleDelete = (queue: IQueue) => {
    if (
      window.confirm(
        `Apakah Anda yakin ingin menghapus antrian nomor ${queue.number}?`
      )
    ) {
      deleteQueue(queue.id, {
        onSuccess: (res) => {
          if (res.status) {
            refetch();
          }
        },
      });
    }
  };

  const handleResetAll = () => {
    if (
      window.confirm(
        "Apakah Anda yakin ingin mereset SEMUA antrian yang aktif? Aksi ini tidak bisa dibatalkan."
      )
    ) {
      resetAllQueues(
        {},
        {
          onSuccess: (res) => {
            if (res.status) {
              refetch();
            }
          },
        }
      );
    }
  };

  const handleSelectionChange = (id: number) => {
    setSelectedQueues((prev) =>
      prev.includes(id)
        ? prev.filter((queueId) => queueId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = (queues: IQueue[]) => {
    if (selectedQueues.length === queues.length) {
      setSelectedQueues([]);
    } else {
      setSelectedQueues(queues.map((q) => q.id));
    }
  };

  const handleBulkDelete = () => {
    if (
      window.confirm(
        `Apakah Anda yakin ingin menghapus ${selectedQueues.length} antrian terpilih?`
      )
    ) {
      bulkDelete(selectedQueues, {
        onSuccess: (res) => {
          if (res.status) {
            setSelectedQueues([]);
            refetch();
          }
        },
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Manajemen Antrian
            </h2>
            <p className="text-gray-600 mt-1">
              Kelola semua antrian yang ada di sistem.
            </p>
          </div>
          <div className="flex gap-2">
            {selectedQueues.length > 0 ? (
              <Button
                variant="danger"
                onClick={handleBulkDelete}
                isLoading={isBulkDeleting}
                leftIcon={
                  <span className="material-symbols-outlined">delete</span>
                }
              >
                Hapus {selectedQueues.length} item
              </Button>
            ) : (
              <>
                <Button
                  variant="secondary"
                  leftIcon={
                    <span className="material-symbols-outlined">refresh</span>
                  }
                  onClick={handleResetAll}
                  isLoading={isResetting}
                >
                  Reset Semua Antrian
                </Button>
                <Button
                  leftIcon={
                    <span className="material-symbols-outlined">add</span>
                  }
                  onClick={handleOpenCreate}
                >
                  Buat Antrian Baru
                </Button>
              </>
            )}
          </div>
        </div>
      </Card>

      <Card>
        {isLoading ? (
          <p>Loading data antrian...</p>
        ) : (
          <QueueTable
            queues={queuesData?.data || []}
            selectedQueues={selectedQueues}
            onSelectionChange={handleSelectionChange}
            onSelectAll={handleSelectAll}
            onEdit={handleOpenEdit}
            onDelete={handleDelete}
          />
        )}
      </Card>

      <QueueFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        queue={editingQueue}
        isLoading={isCreating || isUpdating}
      />
    </div>
  );
};

export default QueueManagementPage;
