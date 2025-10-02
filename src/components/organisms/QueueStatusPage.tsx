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
        <div className="text-center">
            <div className="bg-green-500 rounded-full p-4 mb-6 inline-block">
              <span className="material-symbols-outlined text-white text-4xl">
                search
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Cek Status Antrian Anda
            </h2>
            <p className="text-gray-500 mb-8">
            Masukkan nomor antrian atau nama counter untuk melihat status terkini.
            </p>
        </div>

        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <Input
            placeholder="Contoh: 123 atau Counter A"
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-grow"
          />
          <Button
            type="submit"
            isLoading={isLoading || isFetching}
            disabled={!searchQuery || isLoading || isFetching}
            className="flex-shrink-0"
          >
            Cari
          </Button>
        </form>
      </Card>

      {(isLoading || isFetching) && <Loader />}

      {!isFetching && queues.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700 px-1">Hasil Pencarian:</h3>
          {queues.map((queue) => (
            <QueueCard key={queue.id} queue={queue} />
          ))}
        </div>
      )}

      {notFound && (
        <Card variant="outline" className="text-center py-10">
           <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-4xl text-gray-400">
                quiz
                </span>
            </div>
          <p className="text-lg text-gray-500">Antrian tidak ditemukan</p>
          <p className="text-sm text-gray-400 mt-1">
            Pastikan nomor antrian atau nama counter "<strong>{submittedQuery}</strong>" sudah benar.
          </p>
        </Card>
      )}
    </div>
  );
};

export default QueueStatusChecker;

