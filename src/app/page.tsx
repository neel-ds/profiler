import { FrameMetadata } from "@coinbase/onchainkit";
import styles from "./page.module.css";

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
      <main className={styles.main}>This is FC Frame.</main>
    </>
  );
}
