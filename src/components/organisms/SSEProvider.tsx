"use client";
import React, { createContext, useContext } from "react";
import { useSSE } from "@/hooks/sse/useSSE";

type SSEContextType = {
  addEventListener: (eventName: string, handler: (data: any) => void) => () => void;
};

const SSEContext = createContext<SSEContextType | null>(null);

export const useSSEContext = () => {
  const context = useContext(SSEContext);
  if (!context) {
    throw new Error("useSSEContext must be used within a SSEProvider");
  }
  return context;
};

export const SSEProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { addEventListener } = useSSE();

  return (
    <SSEContext.Provider value={{ addEventListener }}>
      {children}
    </SSEContext.Provider>
  );
};