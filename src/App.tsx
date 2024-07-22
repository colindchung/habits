import { useEffect, useState } from "react";
import { SessionContext } from "./contexts/SessionContext";
import { Session } from "@supabase/supabase-js";
import supabase from "./lib/supabase";
import Nav from "./components/nav";

function App() {
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
      <div className="h-screen w-screen items-center justify-center p-8">
        <Nav />
      </div>
    </SessionContext.Provider>
  );
}

export default App;
