import { client } from "@/utils/supabase/client";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const response = await client.from("farcaster").select("*");

  if (response.status === 200) {
    return res.status(200).json({ status: response.data });
  }
  return res.status(400).json({ error: response.error });
};

export default handler;
