"use client";

import { useEffect, useState } from "react";
import { SessionContext } from "@/contexts/SessionContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Session } from "@supabase/supabase-js";
import supabase from "@/lib/supabase/client";
import Nav from "@/components/nav";
import Body from "@/components/body";

const queryClient = new QueryClient();

export default function Home() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    void supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <SessionContext.Provider value={session}>
      <QueryClientProvider client={queryClient}>
        <div className="h-screen w-screen items-center justify-center p-8">
          <Nav />
          {session ? <></> : <Body />}
        </div>
      </QueryClientProvider>
    </SessionContext.Provider>
  );
}
