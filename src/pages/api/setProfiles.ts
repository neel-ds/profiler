import { client } from "@/utils/supabase/client";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const profiles = req.body;

  for (const profile of profiles) {
    const { fid, castedBy } = profile;

    // To avoid redundancy
    const existing = await client.from("farcaster").select("*").eq("fid", fid);
    if (existing?.data?.length) {
      const response = await client
        .from("farcaster")
        .update({
          followers: castedBy.followerCount,
          following: castedBy.followingCount,
        })
        .eq("fid", fid);
      if (response.error) {
        return res.status(400).json({ error: response.error });
      }
    } else {
      const response = await client.from("farcaster").insert({
        fid,
        followers: castedBy.followerCount,
        following: castedBy.followingCount,
        address: castedBy.userAssociatedAddresses[0],
      });
      if (response.error) {
        return res.status(400).json({ error: response.error });
      }
    }
  }
  return res.status(200).json({ status: "success" });
};

export default handler;
