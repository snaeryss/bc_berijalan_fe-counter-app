"use client";
import React from "react";
import { IQueue, TQueueStatusAction } from "@/interfaces/services/queue.interface";
import Button from "../atoms/Button";
import Badge from "../atoms/Badge";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface QueueTableProps {
  queues: IQueue[];
  selectedQueues: number[];
  onSelectionChange: (id: number) => void;
  onSelectAll: (queues: IQueue[]) => void;
  onEdit: (queue: IQueue) => void;
  onDelete: (queue: IQueue) => void;
}

const QueueTable: React.FC<QueueTableProps> = ({ queues, onEdit, onDelete, selectedQueues, onSelectionChange, onSelectAll}) => {
  if (!queues || queues.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500">
        <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-4xl text-gray-400">
            upcoming
            </span>
        </div>
        <p className="text-lg">Tidak ada data antrian</p>
        <p className="text-sm text-gray-400 mt-1">Coba buat antrian baru untuk memulai.</p>
      </div>
    );
  }

  const getBadgeVariant = (status: IQueue['status']) => {
    switch (status) {
      case "CLAIMED": return "warning";
      case "CALLED": return "primary";
      case "SERVED": return "success";
      case "SKIPPED": return "danger";
      case "RELEASED": return "default";
      case "RESET": return "info";
      default: return "default";
    }
  };

  const isAllSelected = queues.length > 0 && selectedQueues.length === queues.length;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="p-4">
              <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                checked={isAllSelected}
                onChange={() => onSelectAll(queues)}
              />
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">No. Antrian</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Counter</th>
            <th scope="col" className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Waktu Dibuat</th>
            <th scope="col" className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Aksi</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {queues.map((queue) => (
            <tr key={queue.id} className="hover:bg-gray-50 transition-colors">
              <td className="p-4">
                <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  checked={selectedQueues.includes(queue.id)}
                  onChange={() => onSelectionChange(queue.id)}
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-bold text-gray-900">{queue.number}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-800">{queue.counter?.name || "-"}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <Badge variant={getBadgeVariant(queue.status)}>{queue.status}</Badge>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {format(new Date(queue.createdAt), "dd MMM yyyy, HH:mm", { locale: id })}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                <div className="flex items-center justify-center space-x-2">
                  <Button size="sm" variant="outline" onClick={() => onEdit(queue)}>
                    Edit
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => onDelete(queue)}>
                    Hapus
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QueueTable;