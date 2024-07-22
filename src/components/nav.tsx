import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import supabase from "../lib/supabase";
import { Input } from "./ui/input";
import { useState } from "react";
import { useSessionContext } from "../contexts/SessionContext";

function Nav() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const session = useSessionContext();

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Error logging in:", error.message);
    } else {
      console.log("Logged in:", data);
      setEmail("");
      setPassword("");
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error logging out:", error.message);
    } else {
      console.log("Logged out");
    }
  };

  return (
    <div className="flex flex-row justify-between">
      <h1 className="text-3xl">Tracker App</h1>
      {session ? (
        <Button
          variant="secondary"
          className="p-2 h-[24px]"
          onClick={handleLogout}
        >
          Sign Out
        </Button>
      ) : (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="p-2 h-[24px]">
              Account
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
              variant="outline"
              className="p-2 border-none rounded text-white bg-zinc-700 hover:bg-zinc-600"
              onClick={handleLogin}
            >
              Login
            </Button>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}

export default Nav;
