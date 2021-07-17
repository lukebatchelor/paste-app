import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../styles/Home.module.css';
import { Row } from '../components/Box';
import React from 'react';
import { Button } from '../components/Button';
import { useSession } from 'next-auth/client';

export default function Home() {
  const [session, loading] = useSession();
  const router = useRouter();

  if (session) router.push('/app');

  return (
    <div className={styles.container}>
      <Head>
        <title>Paste App</title>
        <meta name="description" content="A simple app for sharing your clipboard between two devices" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Row justify="center" align="center">
          <Image src="/android-chrome-192x192.png" alt="Paste App logo" width="60px" height="60px"></Image>{' '}
          <h1 className={styles.title}>Paste App</h1>
        </Row>

        <p>A super simple app for sharing your clipboard between devices.</p>
        <p>Simply login, paste your text or image, then log in on your other device to pick up your paste!</p>
        <p>Pastes are automatically deleted after 24 hours unless you explicitly save them</p>
        <Row>
          <Link href="/api/auth/signin">
            <Button>Log in</Button>
          </Link>
        </Row>
      </main>
    </div>
  );
}
