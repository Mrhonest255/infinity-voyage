import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const PING_INTERVAL_MS = 1000 * 60 * 60 * 12; // 12 hours
const LAST_PING_KEY = "iv_db_last_ping";

export const useKeepAlive = () => {
  useEffect(() => {
    const runPing = async () => {
      try {
        const lastPing = localStorage.getItem(LAST_PING_KEY);
        const now = Date.now();

        if (!lastPing || now - parseInt(lastPing, 10) > PING_INTERVAL_MS) {
          // Send lightweight head request
          await supabase.from("site_settings").select("id", { count: "exact", head: true });
          localStorage.setItem(LAST_PING_KEY, now.toString());
        }
      } catch {
        // Silent catch: keep-alive should never disturb user experience
      }
    };

    // Run when idle to avoid blocking first paint
    if ("requestIdleCallback" in window) {
      (window as any).requestIdleCallback(() => {
        runPing();
      });
    } else {
      setTimeout(runPing, 3000);
    }
  }, []);
};
