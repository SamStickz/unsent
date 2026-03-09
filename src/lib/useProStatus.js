import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export function useProStatus() {
  const [isPro, setIsPro] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const check = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("is_pro")
        .eq("id", session.user.id)
        .single();

      setIsPro(data?.is_pro === true);
      setLoading(false);
    };
    check();
  }, []);

  return { isPro, loading };
}
