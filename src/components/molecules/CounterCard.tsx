"use client";
import React from "react";
import Card from "../atoms/Card";
import { ICounter } from "@/interfaces/services/counter.interface";
import { cn } from "@/utils/classname.util";
import Badge from "../atoms/Badge";

interface CounterCardProps {
  counter: ICounter;
  isSelected?: boolean;
  onClick?: (counter: ICounter) => void;
  className?: string;
}

const CounterCard: React.FC<CounterCardProps> = ({
  counter,
  isSelected = false,
  onClick,
  className,
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick(counter);
    }
  };

  const queuePercentage = counter.maxQueue > 0 ? (counter.currentQueue / counter.maxQueue) * 100 : 0;

  return (
    <Card
      variant="outline"
      className={cn(
        "cursor-pointer transition-all hover:border-blue-500 hover:shadow-md",
        isSelected ? "border-blue-500 ring-2 ring-blue-200 bg-blue-50/50" : "bg-white",
        className
      )}
      onClick={handleClick}
    >
      <div className="flex items-start justify-between">
        <h3 className="text-lg font-semibold text-gray-800">
          {counter.name}
        </h3>
        <Badge variant={counter.isActive ? "success" : "danger"}>
          {counter.isActive ? "Aktif" : "Non-aktif"}
        </Badge>
      </div>

      <div className="mt-4">
        <div className="flex justify-between items-baseline mb-1">
            <p className="text-sm text-gray-500">Beban Antrian</p>
            <p className="text-sm font-semibold text-gray-700">
                {counter.currentQueue} / {counter.maxQueue}
            </p>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
                className="bg-blue-500 h-2.5 rounded-full" 
                style={{ width: `${queuePercentage}%` }}>
            </div>
        </div>
      </div>
    </Card>
  );
};

export default CounterCard;