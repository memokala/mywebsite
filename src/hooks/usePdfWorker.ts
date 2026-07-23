import { useEffect, useRef, useState, useCallback } from "react";

interface WorkerState {
  isProcessing: boolean;
  result: ArrayBuffer | null;
  error: string | null;
}

export function usePdfWorker() {
  const workerRef = useRef<Worker | null>(null);
  const [state, setState] = useState<WorkerState>({
    isProcessing: false,
    result: null,
    error: null,
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      workerRef.current = new Worker(
        new URL("../workers/pdf.worker.ts", import.meta.url),
        { type: "module" }
      );

      workerRef.current.onmessage = (event: MessageEvent) => {
        const { type, payload } = event.data;

        if (type === "MERGE_SUCCESS") {
          setState({
            isProcessing: false,
            result: payload.bytes,
            error: null,
          });
        } else if (type === "MERGE_FAILURE") {
          setState({
            isProcessing: false,
            result: null,
            error: payload.error,
          });
        }
      };
    }

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);

  const mergePdfs = useCallback((buffers: ArrayBuffer[]) => {
    if (!workerRef.current) {
      setState((prev) => ({ ...prev, error: "Web Worker is not initialized." }));
      return;
    }

    setState({ isProcessing: true, result: null, error: null });

    workerRef.current.postMessage(
      {
        type: "MERGE_PDFS",
        payload: { buffers },
      },
      buffers
    );
  }, []);

  const reset = useCallback(() => {
    setState({ isProcessing: false, result: null, error: null });
  }, []);

  return {
    ...state,
    mergePdfs,
    reset,
  };
}
