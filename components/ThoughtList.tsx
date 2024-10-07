"use client";

import { useState } from "react";
import { Thought } from "@/lib/thoughts";
import Modal from "./Modal";
import { X, Twitter } from "lucide-react";
import tinycolor from "tinycolor2";

export default function ThoughtList({ thoughts }: { thoughts: Thought[] }) {
  const [selectedThought, setSelectedThought] = useState<Thought | null>(null);
  const [filteredUsername, setFilteredUsername] = useState<string | null>(null);

  const filteredThoughts = filteredUsername
    ? thoughts.filter((thought) => thought.username === filteredUsername)
    : thoughts;

  const handleUsernameClick = (username: string) => {
    setFilteredUsername(username);
    setSelectedThought(null);
  };

  const resetFilter = () => {
    setFilteredUsername(null);
  };

  return (
    <>
      {filteredUsername && (
        <div className="mb-4 p-2 bg-gray-100 dark:bg-gray-800 rounded-lg flex justify-between items-center">
          <span>Showing all thoughts from user: {filteredUsername}</span>
          <button
            onClick={resetFilter}
            className="p-1 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            <X size={20} />
          </button>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredThoughts.map((thought) => (
          <ThoughtCard
            key={thought.id}
            thought={thought}
            onClick={() => setSelectedThought(thought)}
            onUsernameClick={handleUsernameClick}
          />
        ))}
      </div>
      {selectedThought && (
        <Modal onClose={() => setSelectedThought(null)}>
          <ThoughtCard
            thought={selectedThought}
            fullContent
            onUsernameClick={handleUsernameClick}
          />
        </Modal>
      )}
    </>
  );
}

function ThoughtCard({
  thought,
  onClick,
  onUsernameClick,
  fullContent = false,
}: {
  thought: Thought;
  onClick?: () => void;
  onUsernameClick: (username: string) => void;
  fullContent?: boolean;
}) {
  const bgColor = tinycolor(thought.bgColor);
  const textColor = bgColor.isLight() ? "#000000" : "#FFFFFF";
  const buttonBgColor = bgColor.isLight()
    ? "rgba(0, 0, 0, 0.1)"
    : "rgba(255, 255, 255, 0.2)";

  const handleClick = (e: React.MouseEvent) => {
    if (onClick && !e.defaultPrevented) {
      onClick();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  return (
    <div
      className="card p-6 rounded-lg shadow-lg relative h-64 flex flex-col cursor-pointer overflow-hidden"
      style={{ backgroundColor: thought.bgColor, color: textColor }}
      onClick={handleClick}
    >
      <div className="flex-grow overflow-hidden mb-4">
        <p
          className={`text-lg font-semibold ${
            fullContent ? "" : "line-clamp-3"
          }`}
        >
          {thought.content}
        </p>
      </div>
      <div className="flex flex-col items-start">
        <button
          className="text-sm hover:underline flex items-center"
          onClick={(e) => {
            e.preventDefault();
            onUsernameClick(thought.username);
          }}
          style={{ color: textColor }}
        >
          {thought.twitter ? (
            <>
              <Twitter size={16} className="mr-1" />@{thought.twitter}
            </>
          ) : (
            <>By {thought.username}</>
          )}
        </button>
        <span className="text-xs opacity-75" style={{ color: textColor }}>
          Posted on {formatDate(thought.createdAt)}
        </span>
      </div>
      <div className="absolute right-4 bottom-4 flex flex-col space-y-1">
        <VoteButton
          icon="👍"
          count={thought.votes.like}
          bgColor={buttonBgColor}
          textColor={textColor}
        />
        <VoteButton
          icon="❤️"
          count={thought.votes.heart}
          bgColor={buttonBgColor}
          textColor={textColor}
        />
        <VoteButton
          icon="🤯"
          count={thought.votes.mind_blown}
          bgColor={buttonBgColor}
          textColor={textColor}
        />
        <VoteButton
          icon="💩"
          count={thought.votes.poop}
          bgColor={buttonBgColor}
          textColor={textColor}
        />
      </div>
    </div>
  );
}

function VoteButton({
  icon,
  count,
  bgColor,
  textColor,
}: {
  icon: string;
  count: number;
  bgColor: string;
  textColor: string;
}) {
  return (
    <button
      className="flex items-center justify-between rounded-full px-2 py-1 text-sm hover:bg-opacity-50 transition-colors duration-200"
      onClick={(e) => e.stopPropagation()}
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      <span>{icon}</span>
      <span className="ml-1">{count}</span>
    </button>
  );
}
