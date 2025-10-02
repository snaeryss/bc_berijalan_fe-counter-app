"use client";
import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { IQueue, ICreateQueueRequest, IUpdateQueueRequest } from "@/interfaces/services/queue.interface";
import { IQueueSchema, VQueueSchema } from "@/schemas/queue.schema";
import Button from "../atoms/Button";
import Input from "../atoms/Input";
import Select from "../atoms/Select";
import { useGetAllCounters } from "@/services/counter/wrapper.service";

interface QueueFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ICreateQueueRequest | IUpdateQueueRequest) => void;
  queue?: IQueue | null;
  isLoading: boolean;
}

const QueueFormModal: React.FC<QueueFormModalProps> = ({ isOpen, onClose, onSubmit, queue, isLoading }) => {
  const isEditMode = !!queue;
  const { data: countersData } = useGetAllCounters(true);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<IQueueSchema>({
    resolver: yupResolver(VQueueSchema as any),
    defaultValues: {
      counter_id: undefined,
      queue_number: undefined,
      status: "CLAIMED",
    }
  });

  useEffect(() => {
    if (isOpen) {
      if (isEditMode && queue) {
        
        reset({
          
          counter_id: queue.counterId,
          queue_number: queue.number,
          status: queue.status,
        });
      } else {
        reset({
          counter_id: undefined,
          queue_number: undefined,
          status: "CLAIMED",
        });
      }
    }
  }, [isOpen, isEditMode, queue, reset]);
  
  if (!isOpen) return null;

  const handleFormSubmit = (data: IQueueSchema) => {
    if (isEditMode && queue) {
      onSubmit({ ...data, id: queue.id });
    } else {
      onSubmit(data as ICreateQueueRequest);
    }
  };

  const counterOptions = countersData?.data?.map(c => ({ value: c.id.toString(), label: c.name })) || [];
  const statusOptions = ["CLAIMED", "CALLED", "SERVED", "SKIPPED", "RELEASED", "RESET"].map(s => ({ value: s, label: s }));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
       <div className="flex items-center justify-center min-h-screen p-4 text-center">
        <div className="fixed inset-0 transition-opacity -z-10 backdrop-blur-sm" aria-hidden="true" onClick={onClose}>
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <div className="inline-block w-full max-w-md my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
          <div className="p-6">
            <h3 className="text-lg font-bold leading-6 text-gray-900">
              {isEditMode ? "Edit Antrian" : "Buat Antrian Baru"}
            </h3>
          </div>
          <hr/>
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <div className="p-6 space-y-4">
              <Controller
                name="counter_id"
                control={control}
                render={({ field }) => (
                  <Select
                    label="Counter"
                    options={[{ value: "", label: "Pilih Counter" }, ...counterOptions]}
                    error={errors.counter_id?.message}
                    fullWidth
                    value={field.value || ""} 
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                )}
              />
               <Input
                label="Nomor Antrian"
                type="number"
                fullWidth
                {...register("queue_number")}
                error={errors.queue_number?.message}
              />
              {isEditMode && (
                 <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Select
                        label="Status"
                        options={statusOptions}
                        error={errors.status?.message}
                        fullWidth
                        {...field}
                      />
                    )}
                  />
              )}
            </div>
            <div className="bg-gray-50 px-6 py-3 text-right space-x-2">
              <Button variant="secondary" type="button" onClick={onClose}>
                Batal
              </Button>
              <Button type="submit" isLoading={isLoading}>
                {isEditMode ? "Simpan Perubahan" : "Buat"}
              </Button>
            </div>
          </form>
        </div>
       </div>
    </div>
  );
};

export default QueueFormModal;