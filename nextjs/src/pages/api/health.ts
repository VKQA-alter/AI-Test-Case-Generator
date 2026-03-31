import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).end();
  return res
    .status(200)
    .json({ status: "UP", service: "AI Test Case Generator" });
}
