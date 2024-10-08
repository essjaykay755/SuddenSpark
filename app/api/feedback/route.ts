import { NextResponse } from "next/server";
import Database from "better-sqlite3";

const db = new Database("./sudden_sparks.db", { verbose: console.log });

db.exec(`
CREATE TABLE IF NOT EXISTS feedback (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  feedback TEXT NOT NULL,
  email TEXT,
  createdAt TEXT NOT NULL
)
`);

export async function POST(request: Request) {
  try {
    const { feedback, email } = await request.json();
    const stmt = db.prepare(`
      INSERT INTO feedback (feedback, email, createdAt)
      VALUES (?, ?, ?)
    `);
    const createdAt = new Date().toISOString();
    stmt.run(feedback, email || null, createdAt);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in POST /api/feedback:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
