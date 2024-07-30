"use client";

import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import supabase from "../lib/supabase/client";
import { Input } from "./ui/input";
import { useState } from "react";
import { useSessionContext } from "../contexts/SessionContext";
import { UserCircleIcon } from "lucide-react";
import Link from "next/link";

function Nav() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const session = useSessionContext();

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Error logging in:", error.message);
    } else {
      setEmail("");
      setPassword("");
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error logging out:", error.message);
    }
  };

  return (
    <div className="flex flex-row items-center justify-between">
      <Link href="/">
        <div>
          <h1 className="text-4xl font-bold">Habits Tracker</h1>
          <div className="text-xs italic">
            Building discipline through public shame
          </div>
        </div>
      </Link>
      <div className="flex flex-row items-center gap-x-10">
        <Link href="/projects">
          <div className="hover:bg-slate-100 p-2 rounded-sm">Projects</div>
        </Link>
        {session ? (
          <Button
            variant="default"
            className="border-none rounded py-2 px-3"
            onClick={handleLogout}
          >
            Sign Out
          </Button>
        ) : (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="p-2 h-[24px]">
                <UserCircleIcon size={24} />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="border-none rounded bg-slate-100 space-y-4">
              <div>
                <div className="text-black">Email</div>
                <Input
                  placeholder="john.doe@gmail.com"
                  className="text-black border-black rounded"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <div className="text-black">Password</div>
                <Input
                  placeholder="********"
                  type="password"
                  className="text-black border-black rounded"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button
                variant="default"
                className="p-2 border-none rounded"
                onClick={handleLogin}
              >
                Login
              </Button>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </div>
  );
}

export default Nav;
