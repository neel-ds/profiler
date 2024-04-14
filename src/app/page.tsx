import { FrameMetadata } from "@coinbase/onchainkit";

export default function Home() {
  return (
    <>
      <FrameMetadata
        buttons={[
          {
            action: "post",
            label: "Yes",
          },
          {
            action: "post",
            label: "No",
          },
        ]}
        image={{
          src: `${process.env.HOST_URL}/frame.png`,
        }}
        postUrl={`${process.env.HOST_URL}/frame`}
      />
      <main className="flex w-full py-10 justify-center font-semibold text-3xl text-sky-300">
        This is FC Frame.
      </main>
    </>
  );
}
