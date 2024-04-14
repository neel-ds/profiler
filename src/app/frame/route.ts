import {
  FrameRequest,
  getFrameHtmlResponse,
  getFrameMessage,
} from "@coinbase/onchainkit/frame";
import { NextRequest, NextResponse } from "next/server";

async function getResponse(req: NextRequest): Promise<NextResponse> {
  const body: FrameRequest = await req.json();
  const { isValid, message } = await getFrameMessage(body, {
    neynarApiKey: "NEYNAR_ONCHAIN_KIT",
  });

  // Verify that request received from the Frame is valid
  if (!isValid) {
    return new NextResponse("Invalid Frame Request", { status: 400 });
  }

  if (message.button === 1) {
    return new NextResponse(
      getFrameHtmlResponse({
        ogTitle: "Result",
        image: `${process.env.HOST_URL}/yes.png`,
      })
    );
  } else if (message.button === 2) {
    return new NextResponse(
      getFrameHtmlResponse({
        ogTitle: "Result",
        image: `${process.env.HOST_URL}/no.png`,
      })
    );
  } else {
    return new NextResponse(
      getFrameHtmlResponse({
        ogTitle: "Result",
        image: `${process.env.HOST_URL}/frame.png`,
      })
    );
  }
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}
