'use client'
import React from 'react'
import Card from '../atoms/Card'
import { EQueueStatus, IQueue } from '@/interfaces/services/queue.interface'
import { cn } from '@/utils/classname.util'
import Badge from '../atoms/Badge'

interface QueueCardProps {
  // Kita akan meng-cast tipe `queue` di dalam komponen untuk mengakomodasi `queueNumber`
  queue: any 
  className?: string
}

const QueueCard: React.FC<QueueCardProps> = ({ queue, className }) => {
  const getStatusInfo = () => {
    switch (queue.status) {
      case 'CALLED':
        return { variant: 'primary', text: 'Sedang Dipanggil', icon: 'campaign' };
      case 'SERVED':
        return { variant: 'success', text: 'Selesai Dilayani', icon: 'task_alt' };
      case 'SKIPPED':
        return { variant: 'danger', text: 'Dilewati', icon: 'skip_next' };
      case 'CLAIMED':
      default:
        return { variant: 'warning', text: 'Sedang Menunggu', icon: 'hourglass_top' };
    }
  }

  const { variant, text, icon } = getStatusInfo();

  // Format time from ISO string
  const formatTime = (isoString: string) => {
    const date = new Date(isoString)
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <Card
      variant="outline"
      className={cn('transition-all', className)}
    >
      <div className="flex items-center justify-between">
        {/* Left Side: Queue Number and Counter */}
        <div className="flex items-center gap-4">
            <div className="flex flex-col items-center justify-center bg-gray-100 rounded-lg w-24 h-24">
                <span className="text-xs text-gray-500">Nomor</span>
                {/* =====================================================
                  PERBAIKAN FINAL: Menggunakan `queue.queueNumber`
                  =====================================================
                */}
                <span className="text-4xl font-bold text-gray-800">{queue.queueNumber}</span>
            </div>
            <div>
                <h3 className="text-lg font-semibold text-gray-800">
                    {queue.counter ? queue.counter.name : "Belum ada counter"}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                    Waktu Klaim: {formatTime(queue.createdAt)}
                </p>
            </div>
        </div>

        {/* Right Side: Status Badge */}
        <Badge variant={variant as any} size="lg" icon={<span className="material-symbols-outlined text-base">{icon}</span>}>
            {text}
        </Badge>
      </div>
    </Card>
  )
}

export default QueueCard