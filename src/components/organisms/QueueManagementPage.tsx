"use client";
import React, { useState } from "react";
import Card from "../atoms/Card";
import Button from "../atoms/Button";
import QueueTable from "./QueueTable";
import { useGetAllQueues, useCreateQueue, useUpdateQueue, useDeleteQueue, useResetQueues } from "@/services/queue/wrapper.service";
import { IQueue, ICreateQueueRequest, IUpdateQueueRequest } from "@/interfaces/services/queue.interface";
import QueueFormModal from "./QueueFormModal";

const QueueManagementPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQueue, setEditingQueue] = useState<IQueue | null>(null);

  // Mengambil data antrian dari API
  const { data: queuesData, isLoading, refetch } = useGetAllQueues({});

  // Hooks untuk mutasi data
  const { mutate: createQueue, isPending: isCreating } = useCreateQueue();
  const { mutate: updateQueue, isPending: isUpdating } = useUpdateQueue();
  const { mutate: deleteQueue, isPending: isDeleting } = useDeleteQueue();
  const { mutate: resetAllQueues, isPending: isResetting } = useResetQueues();

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
      }
    });
  };

  const handleDelete = (queue: IQueue) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus antrian nomor ${queue.number}?`)) {
      deleteQueue(queue.id, {
        onSuccess: (res) => {
          if(res.status) {
            refetch();
          }
        }
      });
    }
  };
  
  const handleResetAll = () => {
    if (window.confirm("Apakah Anda yakin ingin mereset SEMUA antrian yang aktif? Aksi ini tidak bisa dibatalkan.")) {
      resetAllQueues({}, {
        onSuccess: (res) => {
          if (res.status) {
            refetch();
          }
        }
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
            <Button
              variant="secondary"
              leftIcon={<span className="material-symbols-outlined">refresh</span>}
              onClick={handleResetAll}
              isLoading={isResetting}
            >
              Reset Semua Antrian
            </Button>
            <Button
              leftIcon={<span className="material-symbols-outlined">add</span>}
              onClick={handleOpenCreate}
            >
              Buat Antrian Baru
            </Button>
          </div>
        </div>
      </Card>

      <Card>
        {isLoading ? (
          <p>Loading data antrian...</p>
        ) : (
          <QueueTable 
            queues={queuesData?.data || []}
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