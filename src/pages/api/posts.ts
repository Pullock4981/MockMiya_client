import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  try {
    const client = await clientPromise;
    const db = client.db("myDatabase");

    // Type your post as needed (using `any` for now)
    const posts = await db.collection("posts").find({}).toArray();

    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
}
