import * as yup from 'yup'

export const VQueueSchema = yup.object().shape({
  counter_id: yup
    .number()
    .required('Counter wajib dipilih')
    .typeError('Counter wajib dipilih'),
  queue_number: yup
    .number()
    .required('Nomor antrian wajib diisi')
    .min(1, 'Nomor antrian minimal 1')
    .typeError('Nomor antrian harus berupa angka'),
  status: yup
    .string()
    .oneOf(["CLAIMED", "CALLED", "SERVED", "SKIPPED", "RELEASED", "RESET"])
    .optional(),
});

export type IQueueSchema = yup.InferType<typeof VQueueSchema>;