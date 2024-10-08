import { Thought } from "@/types/thought";

export async function getThoughts(): Promise<Thought[]> {
  const response = await fetch("/api/thoughts");
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const thoughts = await response.json();
  return thoughts.map((thought: Thought) => ({
    ...thought,
    createdAt: new Date(thought.createdAt).toISOString(),
  }));
}

export async function submitThought(
  thought: Omit<Thought, "id" | "votes" | "bgColor" | "createdAt">
): Promise<void> {
  const response = await fetch("/api/thoughts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(thought),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
}

export async function getFilteredThoughts(
  filter: "hot" | "new" | "top"
): Promise<Thought[]> {
  try {
    const response = await fetch(`/api/thoughts?filter=${filter}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const text = await response.text();
    let thoughts;
    try {
      thoughts = JSON.parse(text);
    } catch (error) {
      console.error("Failed to parse JSON:", text);
      throw new Error("Invalid JSON response from server");
    }
    return thoughts.map((thought: Thought) => ({
      ...thought,
      createdAt: new Date(thought.createdAt).toISOString(),
    }));
  } catch (error) {
    console.error("Error fetching filtered thoughts:", error);
    throw error;
  }
}

export async function voteThought(
  id: string,
  voteType: keyof Thought["votes"] | null,
  previousVote: keyof Thought["votes"] | null
): Promise<void> {
  const response = await fetch("/api/thoughts", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, voteType, previousVote }),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
}
