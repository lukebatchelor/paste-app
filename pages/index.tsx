import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useSession, signIn } from 'next-auth/client';
import { Box, Container, Paper, styled, Typography, Button } from '@material-ui/core';
import { useRouter } from 'next/router';

const MyPaper = styled(Paper)({
  padding: '1rem',
  background: 'var(--main-color-light)',
});
const LoginButton = styled(Button)({
  fontSize: '1.5rem',
  color: 'var(--main-color-light)',
  borderColor: 'var(--main-color-light)',
  textDecoration: 'none !important',
});

export default function Home() {
  const [session, loading] = useSession();
  const router = useRouter();

  if (session) router.push('/app');

  return (
    <Box height="100%">
      <Head>
        <title>Paste App</title>
        <meta name="description" content="A simple app for sharing your clipboard between two devices" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', height: '100%' }}>
        <Typography variant="h3" align="center" my={2} sx={{ color: 'var(--main-color-light)' }}>
          Paste App
        </Typography>

        <MyPaper sx={{ my: '16px' }}>
          <p>A super simple app for sharing your clipboard between devices.</p>
          <p>Simply login, paste your text or image, then log in on your other device to pick up your paste!</p>
          <p>Pastes are automatically deleted after 24 hours unless you explicitly save them</p>
        </MyPaper>
        <Box display="flex" justifyContent="center">
          <LoginButton
            variant="outlined"
            size="medium"
            onClick={() => signIn('google', { callbackUrl: `${window?.location?.origin}/app` })}
          >
            Sign In
          </LoginButton>
        </Box>
      </Container>
    </Box>
  );
}
