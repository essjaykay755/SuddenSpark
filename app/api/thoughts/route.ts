import { NextResponse } from "next/server";
import Database from "better-sqlite3";
import { Thought } from "@/types/thought";

const db = new Database("./sudden_sparks.db", { verbose: console.log });

db.exec(`
CREATE TABLE IF NOT EXISTS thoughts (
  id TEXT PRIMARY KEY,
  content TEXT NOT NULL,
  username TEXT NOT NULL,
  twitter TEXT,
  votes_like INTEGER DEFAULT 0,
  votes_heart INTEGER DEFAULT 0,
  votes_mind_blown INTEGER DEFAULT 0,
  votes_poop INTEGER DEFAULT 0,
  bgColor TEXT NOT NULL,
  createdAt TEXT NOT  NULL
)
`);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const filter = searchParams.get("filter") as "hot" | "new" | "top" | null;

  let query = "";
  const sevenDaysAgo = new Date(
    Date.now() - 7 * 24 * 60 * 60 * 1000
  ).toISOString();

  try {
    switch (filter) {
      case "hot":
        query = `
          SELECT * FROM thoughts
          WHERE createdAt >= ?
          ORDER BY (votes_like + votes_heart + votes_mind_blown) DESC
          LIMIT 100
        `;
        return NextResponse.json(
          db.prepare(query).all(sevenDaysAgo).map(formatThought)
        );
      case "new":
        query = `
          SELECT * FROM thoughts
          ORDER BY createdAt DESC
          LIMIT 100
        `;
        return NextResponse.json(db.prepare(query).all().map(formatThought));
      case "top":
        query = `
          SELECT * FROM thoughts
          ORDER BY (votes_like + votes_heart + votes_mind_blown) DESC
          LIMIT 100
        `;
        return NextResponse.json(db.prepare(query).all().map(formatThought));
      default:
        query = `
          SELECT * FROM thoughts
          ORDER BY createdAt DESC
        `;
        return NextResponse.json(db.prepare(query).all().map(formatThought));
    }
  } catch (error) {
    console.error("Error in GET /api/thoughts:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const thought = await request.json();
    const stmt = db.prepare(`
      INSERT INTO thoughts (id, content, username, twitter, bgColor, createdAt)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const id = Date.now().toString();
    const bgColor = getRandomColor();
    const createdAt = new Date().toISOString();
    stmt.run(
      id,
      thought.content,
      thought.username,
      thought.twitter || null,
      bgColor,
      createdAt
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in POST /api/thoughts:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { id, voteType, previousVote } = await request.json();
    let stmt;

    if (voteType === null) {
      // User is un-voting
      stmt = db.prepare(`
        UPDATE thoughts
        SET votes_${previousVote} = votes_${previousVote} - 1
        WHERE id = ?
      `);
    } else if (previousVote === null) {
      // User is voting for the first time
      stmt = db.prepare(`
        UPDATE thoughts
        SET votes_${voteType} = votes_${voteType} + 1
        WHERE id = ?
      `);
    } else {
      // User is changing their vote
      stmt = db.prepare(`
        UPDATE thoughts
        SET votes_${previousVote} = votes_${previousVote} - 1,
            votes_${voteType} = votes_${voteType} + 1
        WHERE id = ?
      `);
    }

    stmt.run(id);

    // Fetch the updated thought
    const updatedThought = db
      .prepare("SELECT * FROM thoughts WHERE id = ?")
      .get(id);
    return NextResponse.json(formatThought(updatedThought));
  } catch (error) {
    console.error("Error in PUT /api/thoughts:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

function formatThought(row: any): Thought {
  return {
    ...row,
    votes: {
      like: row.votes_like,
      heart: row.votes_heart,
      mind_blown: row.votes_mind_blown,
      poop: row.votes_poop,
    },
    createdAt: new Date(row.createdAt).toISOString(),
  };
}

function getRandomColor(): string {
  const colors = [
    "rgb(11 169 91)",
    "rgb(35 31 32)",
    "rgb(237 32 61)",
    "rgb(243 139 163)",
    "rgb(249 244 218)",
    "rgb(18 181 229)",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}
