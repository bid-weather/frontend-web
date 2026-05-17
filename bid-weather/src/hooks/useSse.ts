"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

export function usePredictionSse(categoryId?: string, subcategoryId?: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const eventSource = new EventSource("/sse/subscribe");

    eventSource.onmessage = () => {
      queryClient.invalidateQueries({
        queryKey: ["predictionCalendar", categoryId, subcategoryId],
      });
      queryClient.invalidateQueries({
        queryKey: ["predictionGraph", categoryId, subcategoryId],
      });
    };

    eventSource.onerror = () => {
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [queryClient, categoryId, subcategoryId]);
}
