'use client'
import Link from "next/link";
import React, { useEffect } from "react";
import Card from "../atoms/Card";
import { useGetMetrics } from "@/services/queue/wrapper.service";
import { useQueryClient } from "@tanstack/react-query";
import { useSSEContext } from "./SSEProvider"; 

const DashboardPage = () => {
  const { data: metricsData } = useGetMetrics();
  const metrics = metricsData?.data;

  const queryClient = useQueryClient();
  const { addEventListener } = useSSEContext();

  useEffect(() => {
    const refetchMetrics = () => {
      queryClient.invalidateQueries({ queryKey: ["queues", "metrics"] });
    };

    const eventsToListen: string[] = [
      "queue_claimed",
      "queue_released",
      "queue_called",
      "queue_skipped",
      "queue_reset",
      "all_queues_reset",
      "queue_served",
    ];

    const unsubscribers = eventsToListen.map(event => 
      addEventListener(event, refetchMetrics)
    );

    return () => {
      unsubscribers.forEach(unsubscribe => unsubscribe());
    };

  }, [addEventListener, queryClient]);

  const quickLinks = [
    {
      title: "Ambil Nomor Antrian",
      description: "Ambil nomor antrian untuk dilayani.",
      href: "/queue-ticket",
      icon: "confirmation_number",
      color: "bg-blue-500",
    },
    {
      title: "Display Antrian",
      description: "Lihat antrian yang sedang berjalan.",
      href: "/queue-display",
      icon: "list_alt",
      color: "bg-purple-500",
    },
    {
      title: "Cek Status Antrian",
      description: "Lacak status nomor antrian Anda.",
      href: "/queue-status",
      icon: "search",
      color: "bg-green-500",
    },
    {
      title: "Operator Counter",
      description: "Panel khusus untuk operator.",
      href: "/counter-operator",
      icon: "support_agent",
      color: "bg-amber-500",
    },
  ];
  return (
    <div className="space-y-8">
      <Card>
        <h1 className="text-3xl font-bold text-gray-800">
          Selamat Datang di Dasbor Antrian
        </h1>
        <p className="text-gray-500 mt-2">
          Pusat kendali untuk memonitor dan mengelola seluruh alur antrian.
        </p>
      </Card>

      <div>
        <h2 className="text-xl font-semibold text-gray-700 mb-4 px-1">
          Statistik Hari Ini
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="!bg-yellow-50 !border-yellow-200 border">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-yellow-800 text-sm font-medium">Menunggu</p>
                <h3 className="text-3xl font-bold text-yellow-900 mt-1">{metrics?.waiting || 0}</h3>
              </div>
              <div className="bg-white rounded-full p-2">
                 <span className="material-symbols-outlined text-yellow-500 text-3xl">
                  timer
                </span>
              </div>
            </div>
          </Card>

          <Card className="!bg-blue-50 !border-blue-200 border">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-blue-800 text-sm font-medium">
                  Sedang Dilayani
                </p>
                <h3 className="text-3xl font-bold text-blue-900 mt-1">{metrics?.called || 0}</h3>
              </div>
               <div className="bg-white rounded-full p-2">
                <span className="material-symbols-outlined text-blue-500 text-3xl">
                  support_agent
                </span>
              </div>
            </div>
          </Card>

          <Card className="!bg-green-50 !border-green-200 border">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-green-800 text-sm font-medium">Selesai</p>
                <h3 className="text-3xl font-bold text-green-900 mt-1">{metrics?.released || 0}</h3>
              </div>
              <div className="bg-white rounded-full p-2">
                <span className="material-symbols-outlined text-green-500 text-3xl">
                  task_alt
                </span>
              </div>
            </div>
          </Card>

          <Card className="!bg-red-50 !border-red-200 border">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-red-800 text-sm font-medium">Dilewati</p>
                <h3 className="text-3xl font-bold text-red-900 mt-1">{metrics?.skipped || 0}</h3>
              </div>
              <div className="bg-white rounded-full p-2">
                <span className="material-symbols-outlined text-red-500 text-3xl">
                  skip_next
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-700 mb-4 px-1">
          Akses Cepat
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickLinks.map((link) => (
            <Link key={link.href} href={link.href} className="block group">
              <Card className="h-full transition-all group-hover:scale-[1.02] group-hover:shadow-xl">
                <div className="flex flex-col h-full">
                  <div
                    className={`${link.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-all group-hover:scale-110 group-hover:shadow-lg`}
                  >
                    <span className="material-symbols-outlined text-white text-2xl">
                      {link.icon}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {link.title}
                  </h3>
                  <p className="text-gray-500 text-sm mt-1">
                    {link.description}
                  </p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;