"use client";
import { ICounter } from "@/interfaces/services/counter.interface";
import { EQueueStatus, IQueue } from "@/interfaces/services/queue.interface";
import React from "react";
import Button from "../atoms/Button";
import Card from "../atoms/Card";
import Select from "../atoms/Select";
import CurrentQueueDisplay from "../molecules/CurrentQueueDisplay";
import { useGetAllCounters } from "@/services/counter/wrapper.service";
import { useNextQueue, useSkipQueue } from "@/services/queue/wrapper.service";
import { useCounterAppStore } from "@/stores/global-states/counter/counter-app.store";
import toast from "react-hot-toast";

interface CounterOperatorProps {
  className?: string;
}

const CounterOperator: React.FC<CounterOperatorProps> = ({ className }) => {
  const { selectedCounter, setSelectedCounter, currentQueue, setCurrentQueue } = useCounterAppStore();

  const { data: countersData } = useGetAllCounters(); 
  const { mutate: nextQueue, isPending: isNexting } = useNextQueue();
  const { mutate: skipQueue, isPending: isSkipping } = useSkipQueue();

  const activeCounters: ICounter[] = countersData?.data?.filter(c => c.isActive) || [];

  const handleCounterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const counterId = parseInt(e.target.value);
    const counter = activeCounters.find((c) => c.id === counterId);
    setSelectedCounter(counter || null);
    
    setCurrentQueue(null);
  };

  const handleNextQueue = () => {
    if (!selectedCounter) {
      toast.error("Silakan pilih counter terlebih dahulu.");
      return;
    }
    nextQueue(
      { counter_id: selectedCounter.id },
      {
        onSuccess: (res) => {
          if (res.status && res.data) {
            setCurrentQueue(res.data.queue);
          }
        },
      }
    );
  };

  const handleSkipQueue = () => {
    if (!selectedCounter) {
      toast.error("Silakan pilih counter terlebih dahulu.");
      return;
    }
    skipQueue(
      { counter_id: selectedCounter.id },
      {
        onSuccess: (res) => {
          if (res.status && res.data) {

            setCurrentQueue(res.data.nextQueue || null);
            toast.success(`Antrian nomor ${res.data.skippedQueue.number} telah dilewati.`);
          }
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
          label="Pilih Counter"
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
          <CurrentQueueDisplay
            counterName={selectedCounter.name}
            queueNumber={currentQueue?.number || null}
            status={currentQueue?.status || "RELEASED"}
          />

          <div className="flex gap-4">
            <Button
              fullWidth
              leftIcon={
                <span className="material-symbols-outlined">arrow_forward</span>
              }
              onClick={handleNextQueue}
              isLoading={isNexting}
              disabled={isNexting || isSkipping}
            >
              Panggil Antrian Berikutnya
            </Button>

            {currentQueue && currentQueue.status === "CALLED" && (
              <Button
                fullWidth
                variant="danger"
                leftIcon={
                  <span className="material-symbols-outlined">skip_next</span>
                }
                onClick={handleSkipQueue}
                isLoading={isSkipping}
                disabled={isNexting || isSkipping}
              >
                Lewati Antrian
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
