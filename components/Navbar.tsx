"use client";

import Link from "next/link";
import { Film, Lightbulb, Settings } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import "../app/globals.css";
import { UserButton } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import Button from "./Button";
import { usePathname } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import SettingsModal from "@/components/SettingsModal";

export default function Component() {
  const { userId } = useAuth();
  const pathname = usePathname();

  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between px-4 mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <span className="sour-gummy-regular bg-gradient-to-r from-red-500 to-red-400 bg-clip-text text-2xl font-black tracking-wider text-transparent">
            YoutubeIdeas
          </span>
        </Link>
        <nav className="flex items-center gap-6">
          {userId && (
            <Link
              href="/videos"
              className={`flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-red-500 ${
                pathname.startsWith("/videos")
                  ? "text-red-500 underline underline-offset-8"
                  : ""
              }`}
            >
              {/* <Film className="h-4 w-4" /> */}
              Videos
            </Link>
          )}
          {userId && (
            <Link
              href="/ideas"
              className={`flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-red-500 ${
                pathname.startsWith("/ideas")
                  ? "text-red-500 underline underline-offset-8"
                  : ""
              }`}
            >
              {/* <Lightbulb className="h-4 w-4" /> */}
              Ideas
            </Link>
          )}
          {userId && <SettingsModal />}
          {userId && <UserButton />}
          {!userId && (
            <Link href="/videos">
              <Button className="font-semibold text-white bg-gradient-to-r from-red-500 to-red-400 hover:bg-red-600 focus:ring-red-500">
                Get Started Now
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
