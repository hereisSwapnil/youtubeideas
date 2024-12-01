"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import "../app/globals.css";
import { Button } from "./ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Plus, X } from "lucide-react";
import { getChannelsForUser } from "@/server/queries";
import { useEffect, useState } from "react";
import { YoutubeChannel } from "@/server/db/schema";
import { addChannelForUser, removeChannelForUser } from "@/server/mutations";
import { useToast } from "@/hooks/use-toast";

export default function Component() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [channels, setChannels] = useState<YoutubeChannel[]>([]);
  const [newChannel, setNewChannel] = useState("");
  const {toast} = useToast();

  useEffect(() => {
    if (isOpen) {
      fetchChannels();
    }
  }, [isOpen]);

  const fetchChannels = async () => {
    setLoading(true);
    try {
      const fetchedChannels = await getChannelsForUser();
      setChannels(fetchedChannels);
    } catch (error) {
      console.error("Failed to fetch channels:", error);
    } finally {
      setLoading(false);
    }
  };

  const addChannel = async () => {
    if (newChannel) {
      // setLoading(true);
      try {
        const [addedChannel] = await addChannelForUser(newChannel);
        setChannels([...channels, addedChannel]);
        setNewChannel("");
        toast({
          title: "Channel added successfully"
        })
        console.log(channels);
      } catch (error) {
        console.error("Failed to add channel:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const removeChannel = async (id: string) => {
    // setLoading(true);
    try {
      setChannels(channels.filter((c) => c.id !== id));
      await removeChannelForUser(id);
      toast({
        title: "Channel removed successfully"
      })
    } catch (error) {
      console.error("Failed to remove channel:", error);
    } finally {
      // setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger
        className={`flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-red-500 ${
          isOpen ? "text-red-500 underline underline-offset-8" : ""
        }`}
      >
        Settings
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-red-600">Add New Channel</DialogTitle>
          <div className="grid gap-4 py-4">
            <form onSubmit={(e) => {
                  e.preventDefault()
                  addChannel();
                }} className="grid grid-cols-4 items-center gap-4">
              <Input
                id="name"
                defaultValue=""
                placeholder="Channel Name"
                className="col-span-3"
                value={newChannel}
                onChange={(e) => {
                  setNewChannel(e.target.value);
                }}
              />
              <Button
                type="submit"
                className="text-white bg-red-500 hover:bg-red-700 focus:ring-red-500"
              >
                <Plus className="w-4 h-4" /> Add
              </Button>
            </form>
          </div>
          <DialogTitle className="text-red-600 pb-4">Saved Channels</DialogTitle>
          {(!loading && channels.length == 0) ? (
          <DialogDescription>No channels found</DialogDescription>
          ) : ("")}
          {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <ScrollArea>
              {channels.map((channel) => (
                <div
                  key={channel.id}
                  className="flex items-center justify-between border rounded-lg shadow-sm px-4 py-2 bg-gray-100 mb-2"
                >
                  <span>{channel.name}</span>
                  <Button
                    variant={"ghost"}
                    size={"sm"}
                    onClick={() => {
                      removeChannel(channel.id);
                    }}
                  >
                    <X className="h-4 w-4 text-red-500 hover:bg-red-100 rounded-md" />
                  </Button>
                </div>
              ))}
            </ScrollArea>
          )}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
