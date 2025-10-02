"use client";
import React, { useEffect } from "react";
import Card from "../atoms/Card";
import { ICurrentQueuesResponse } from "@/interfaces/services/queue.interface";
import CurrentQueueDisplay from "../molecules/CurrentQueueDisplay";
import { useGetCurrentQueues } from "@/services/queue/wrapper.service";
import { useQueryClient } from "@tanstack/react-query"; 

interface QueueDisplayBoardProps {
  className?: string;
}

const QueueDisplayPage: React.FC<QueueDisplayBoardProps> = ({ className }) => {
  const { data: currentQueues } = useGetCurrentQueues();

  const queryClient = useQueryClient();

  useEffect(() => {

    const refetchCurrentQueues = () => {
      console.log("SSE event received! Refetching current queues...");
      queryClient.invalidateQueries({ queryKey: ["queues", "current"] });
    };

    
    const eventsToListen: string[] = [
      "queue_claimed",
      "queue_released",
      "queue_called",
      "queue_skipped",
      "queue_reset",
      "all_queues_reset",
    ];

    const unsubscribers = eventsToListen.map(event => 
      addEventListener(event, refetchCurrentQueues)
    );

  }, [addEventListener, queryClient]);

  return (
    <div className={className}>
      <Card className="mb-6">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
          PAPAN INFORMASI ANTRIAN
        </h2>
        <p className="text-center text-gray-600">
          Berikut status antrian yang sedang dilayani pada masing-masing counter
        </p>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(currentQueues?.data || [])
          .filter(
            (counter: ICurrentQueuesResponse) => counter?.isActive === true
          )
          .map((counter: ICurrentQueuesResponse) => {
            return (
              <CurrentQueueDisplay
                key={counter.id}
                counterName={counter.name || "Counter"}
                queueNumber={counter.currentQueue}
                status={counter.status || "RELEASED"}
              />
            );
          })}

        {(currentQueues?.data || []).filter(
          (counter: ICurrentQueuesResponse) => counter?.isActive === true
        ).length === 0 && (
          <div className="col-span-full text-center py-10 text-gray-500">
            Tidak ada counter yang aktif saat ini.
          </div>
        )}
      </div>
    </div>
  );
};

export default QueueDisplayPage;