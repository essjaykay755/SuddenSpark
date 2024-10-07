export interface Thought {
  id: string;
  content: string;
  username: string;
  twitter?: string;
  votes: {
    like: number;
    heart: number;
    mind_blown: number;
    poop: number;
  };
  bgColor: string;
  createdAt: string;
}

export async function getThoughts(): Promise<Thought[]> {
  const response = await fetch("/api/thoughts");
  const thoughts = await response.json();
  return thoughts.map((thought: Thought) => ({
    ...thought,
    createdAt: new Date(thought.createdAt).toISOString(),
  }));
}

export async function submitThought(
  thought: Omit<Thought, "id" | "votes" | "bgColor" | "createdAt">
): Promise<void> {
  await fetch("/api/thoughts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(thought),
  });
}

export async function getFilteredThoughts(
  filter: "hot" | "new" | "top"
): Promise<Thought[]> {
  const response = await fetch(`/api/thoughts?filter=${filter}`);
  const thoughts = await response.json();
  return thoughts.map((thought: Thought) => ({
    ...thought,
    createdAt: new Date(thought.createdAt).toISOString(),
  }));
}
