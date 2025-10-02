"use client";
import { useEffect, useRef } from "react";
import { env } from "@/config/env.config";
import { ISSEEvent } from "@/interfaces/services/sse.interface";

export const useSSE = () => {
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    const eventSource = new EventSource(`${env.APP.API_URL}/api/v1/sse`);
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      console.log("SSE connection established.");
    };

    eventSource.onerror = (error) => {
      console.error("SSE Error:", error);
      eventSource.close(); 
    };

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        console.log("SSE connection closed.");
      }
    };
  }, []); 

  const addEventListener = (eventName: string, handler: (data: any) => void) => {
    const listener = (event: MessageEvent) => {
      try {
        const parsedData: ISSEEvent = JSON.parse(event.data);
        handler(parsedData.data);
      } catch (error) {
        console.error("Failed to parse SSE data:", error);
      }
    };

    eventSourceRef.current?.addEventListener(eventName, listener);

    return () => {
      eventSourceRef.current?.removeEventListener(eventName, listener);
    };
  };

  return { addEventListener };
};