import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Paste App</title>
        <meta
          name="description"
          content="A simple app for sharing your clipboard between two devices"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Paste App</h1>
      </main>
    </div>
  );
}
