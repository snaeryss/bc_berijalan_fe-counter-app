"use client";
import { IQueue } from "@/interfaces/services/queue.interface";
import { useSearchQueue } from "@/services/queue/wrapper.service";
import React, { useState } from "react";
import Button from "../atoms/Button";
import Card from "../atoms/Card";
import Input from "../atoms/Input";
import QueueCard from "../molecules/QueueCard";
import { Loader } from "../atoms/Loader";

interface QueueStatusCheckerProps {
  className?: string;
}

const QueueStatusChecker: React.FC<QueueStatusCheckerProps> = ({
  className,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");

  const {
    data: queueResults,
    isLoading,
    isFetching,
  } = useSearchQueue(submittedQuery, !!submittedQuery);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmittedQuery(searchQuery);
  };

  const queues = queueResults?.data || [];
  const notFound = submittedQuery && !isFetching && queues.length === 0;

  return (
    <div className={className}>
      <Card className="mb-6">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
          Cek Status Antrian
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Masukkan nomor antrian atau nama counter untuk memeriksa status
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nomor Antrian atau Nama Counter"
            placeholder="Contoh: 123 atau Counter A"
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={
              <span className="material-symbols-outlined">search</span>
            }
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              isLoading={isLoading || isFetching}
              disabled={!searchQuery || isLoading || isFetching}
            >
              Cari Antrian
            </Button>
          </div>
        </form>
      </Card>

      {(isLoading || isFetching) && <Loader />}

      {!isFetching && queues.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Hasil Pencarian:</h3>
          {queues.map((queue) => (
            <QueueCard key={queue.id} queue={queue} />
          ))}
        </div>
      )}

      {notFound && (
        <Card variant="outline" className="text-center py-6 text-gray-500">
          Antrian dengan nomor atau nama counter <strong>{submittedQuery}</strong> tidak ditemukan.
        </Card>
      )}
    </div>
  );
};

export default QueueStatusChecker;