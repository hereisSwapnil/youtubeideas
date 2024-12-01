"use client";

import React, { useEffect, useState } from "react";
import { ArrowUpRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getIdeasForUser } from "@/server/queries";
import { useAuth } from "@clerk/nextjs";
import { IdeaDialog } from "@/components/idea-dailog";

interface Idea {
  title: string;
  score: number;
}

const IdeaCard: React.FC<Idea & { onClick: () => void }> = ({
  title,
  score,
  onClick,
}) => (
  <div
    onClick={onClick}
    className="bg-white rounded-lg shadow-md cursor-pointer p-4 relative hover:shadow-lg hover:scale-105 transform transition duration-200 ease-in-out"
  >
    <h3 className="text-lg font-semibold mb-4 pr-6">{title}</h3>
    <p className="text-red-500">Score: {score}</p>
    <ArrowUpRight className="absolute top-4 right-4 text-gray-400" size={20} />
  </div>
);

const fakeIdeas = [
  {
    id: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    userId: "user12345",
    videoId: "video001",
    commentId: "c1e5b3c0-7649-4d85-8d15-9a2f0e202932",
    score: 85,
    videoTitle: "How to Build a Space Rover",
    description:
      "An idea to create an affordable DIY space rover kit for students.",
    research: [
      "https://example.com/nasa-space-rovers",
      "https://example.com/diy-kits",
      "https://example.com/affordable-components",
    ],
    createdAt: "2024-11-01T14:23:00Z",
    updatedAt: "2024-11-22T10:00:00Z",
  },
  {
    id: "7e57d004-2b97-0e7a-b45f-5387367791cd",
    userId: "user67890",
    videoId: "video002",
    commentId: "9a7d2b0b-3f5d-4c6f-872d-c7b2b89c9b0d",
    score: 42,
    videoTitle: "The Art of Paper Sculpting",
    description:
      "An innovative approach to teach art through paper sculpting techniques.",
    research: [
      "https://example.com/paper-sculpting-history",
      "https://example.com/art-teaching-methods",
    ],
    createdAt: "2024-10-15T08:00:00Z",
    updatedAt: "2024-11-20T12:30:00Z",
  },
  {
    id: "9e107d9d-3721-4c6f-b465-0c32b3c9f77f",
    userId: "user54321",
    videoId: "video003",
    commentId: "3f0e2b45-8c5f-4c0a-89c3-2b97d009f77f",
    score: 98,
    videoTitle: "Exploring Quantum Computing",
    description:
      "A comprehensive idea to simplify quantum computing concepts for beginners.",
    research: [
      "https://example.com/quantum-basics",
      "https://example.com/educational-tools",
      "https://example.com/simplified-computing",
      "https://example.com/quantum-videos",
    ],
    createdAt: "2024-09-25T16:45:00Z",
    updatedAt: "2024-11-21T14:20:00Z",
  },
];

export default function IdeasGrid() {
  const { userId } = useAuth();
  const [ideas, setIdeas] = useState<Idea[]>(fakeIdeas);
  const [loading, setLoading] = useState(true);
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const ideas_ = await getIdeasForUser();
        console.log("ideas", ideas_);
        // setIdeas(ideas_)
      } catch (error) {
        console.error("Error fetching ideas", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-6 h-6 animate-spin text-red-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Ideas</h1>
        <Button className="rounded-full bg-red-500 px-6 hover:bg-red-600">
          Generate
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ideas.map((idea, index) => (
          <IdeaCard
            key={index}
            {...idea}
            onClick={() => setSelectedIdea(idea)}
          />
        ))}
      </div>

      <IdeaDialog
        idea={selectedIdea}
        isOpen={selectedIdea !== null}
        onClose={() => setSelectedIdea(null)}
      />
    </div>
  );
}
