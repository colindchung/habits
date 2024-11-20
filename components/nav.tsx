"use client";

import { Button } from "./ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import supabase from "../lib/supabase/client";
import { Input } from "./ui/input";
import { useState } from "react";
import { useSessionContext } from "../contexts/SessionContext";
import { MenuIcon, UserCircleIcon } from "lucide-react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const data = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "Projects",
    href: "/projects",
  },
];

function DesktopLinks() {
  let [hoveredIndex, setHoveredIndex] = useState<Number | null>(null);

  return (
    <>
      {data.map((item, index) => (
        <Link
          key={item.title}
          href={item.href}
          className="relative -my-2 -mx-3 rounded-lg px-3 py-2 text-sm text-gray-700 transition-colors delay-150 hover:text-gray-900 hover:delay-[0ms]"
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === index && (
              <motion.span
                className="absolute inset-0 rounded-lg bg-gray-100"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.15 } }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
          <span className="relative z-10 font-semibold">{item.title}</span>
        </Link>
      ))}
    </>
  );
}

function Nav() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const session = useSessionContext();

  const router = useRouter();

  const handleNavItemClick = (href: string) => {
    router.push(href);
  };

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error("Unable to login");
    } else {
      setEmail("");
      setPassword("");
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      toast.error("Unable to logout");
    }

    setIsDrawerOpen(false);
  };

  return (
    <div className="flex flex-row items-center justify-between">
      <Link href="/">
        <div>
          <h1 className="text-2xl md:text-4xl font-bold">Habits Tracker</h1>
          <div className="max-w-36 md:max-w-max text-xs italic">
            Building discipline through public shame
          </div>
        </div>
      </Link>
      <div className="hidden lg:flex lg:flex-row lg:items-center lg:gap-10">
        <DesktopLinks />
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
      <div className="flex lg:hidden items-center gap-6">
        <Drawer
          direction="bottom"
          open={isDrawerOpen}
          onOpenChange={setIsDrawerOpen}
        >
          <DrawerTrigger>
            <MenuIcon size={24} />
          </DrawerTrigger>
          <DrawerContent className="px-10 pb-10 gap-y-4">
            {data.map((item) => (
              <DrawerClose
                key={item.title}
                onClick={() => handleNavItemClick(item.href)}
                className="block text-base leading-7 tracking-tight text-gray-700"
              >
                {item.title}
              </DrawerClose>
            ))}

            {session ? (
              <DrawerFooter>
                <Button
                  variant="default"
                  className="border-none rounded py-2 px-3"
                  onClick={handleLogout}
                >
                  Sign Out
                </Button>
              </DrawerFooter>
            ) : (
              <DrawerFooter>
                <Input
                  placeholder="Email"
                  className="text-black border-black rounded"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  placeholder="Password"
                  type="password"
                  className="text-black border-black rounded"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                  variant="default"
                  className="p-2 border-none rounded"
                  onClick={handleLogin}
                >
                  Login
                </Button>
              </DrawerFooter>
            )}
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
}

export default Nav;
