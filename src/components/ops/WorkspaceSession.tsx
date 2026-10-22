"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { WorkspaceData } from "@/lib/ops/workspace-types";
type Session = {
  data: WorkspaceData | null;
  error: string;
  reload: () => Promise<void>;
};
const SessionContext = createContext<Session | null>(null);
export function WorkspaceSession({
  initialData,
  children,
}: {
  initialData: WorkspaceData;
  children: React.ReactNode;
}) {
  const [data, setData] = useState<WorkspaceData | null>(initialData),
    [error, setError] = useState("");
  const pending = useRef<Promise<void> | null>(null),
    controller = useRef<AbortController | null>(null);
  const reload = useCallback(() => {
    if (pending.current) return pending.current;
    const abort = new AbortController();
    controller.current = abort;
    const timeout = setTimeout(() => abort.abort(), 12000);
    const task = (async () => {
      try {
        const response = await fetch("/api/ops/workspace", {
          cache: "no-store",
          signal: abort.signal,
        });
        const body = await response.json();
        if (!response.ok) {
          if (response.status === 401 || response.status === 403) setData(null);
          throw Error(body.error || "Unable to refresh your workspace.");
        }
        setData(body);
        setError("");
      } catch (e) {
        if (!abort.signal.aborted)
          setError(e instanceof Error ? e.message : "Unable to refresh.");
        else
          setError(
            "Refresh took longer than expected. Your last view is still available.",
          );
      } finally {
        clearTimeout(timeout);
        pending.current = null;
        controller.current = null;
      }
    })();
    pending.current = task;
    return task;
  }, []);
  useEffect(() => {
    const refresh = () => {
      if (document.visibilityState === "visible") void reload();
    };
    const timer = setInterval(refresh, 30000);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", refresh);
      controller.current?.abort();
    };
  }, [reload]);
  return (
    <SessionContext.Provider value={{ data, error, reload }}>
      {children}
    </SessionContext.Provider>
  );
}
export function useWorkspaceSession() {
  const session = useContext(SessionContext);
  if (!session) throw Error("Workspace session is missing.");
  return session;
}
