import Head from 'next/head';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { Grid, Box, Typography, TextField, Fab, Paper } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import SendIcon from '@material-ui/icons/Send';
import { Message } from '.prisma/client';
import styled from '@emotion/styled';
import { Controller, useForm } from 'react-hook-form';

type FormValues = {
  messageText: string;
};

const defaultValues: FormValues = {
  messageText: '',
};

type View = 'TEXT' | 'IMAGES';

const MessageBubble = styled(Paper)({
  whiteSpace: 'pre-wrap',
  marginTop: '8px',
  padding: '16px',
  backgroundColor: '#5c6bc0',
  color: 'white',
  borderRadius: '8px',
});
const Form = styled('form')({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
});
const WhiteBorderTextField = styled(TextField)`
  & .MuiOutlinedInput-root fieldset {
    border-color: #673ab7 !important;
  }
`;
const SendButton = styled(Fab)`
  color: white;
  background-color: #5c6bc0;
`;
const Title = styled(Typography)`
  color: #5c6bc0;
  font-weight: 600;
  font-size: 2.5rem;
`;

export default function App() {
  const [messages, setMessages] = useState<Array<Message>>([]);
  const { handleSubmit, control, reset, watch } = useForm<FormValues>({ defaultValues });
  const messageText = watch('messageText');
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  const refresh = () => {
    return fetch('/api/messages')
      .then((res) => res.json())
      .then((data) => {
        setMessages(data.messages);
      });
  };
  useEffect(() => {
    refresh();
  }, []);

  const openUploadModal = () => {};
  const onSubmit = (data: FormValues) => {
    const { messageText } = data;
    if (messageText.length === 0) return openUploadModal();
    const body = JSON.stringify({ text: messageText });
    const options = { method: 'POST', body, headers: { 'Content-Type': 'application/json' } };
    fetch('/api/messages', options)
      .then((res) => res.json())
      .then(() => {
        reset();
        refresh().then(() => {
          endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
        });
      });
  };

  return (
    <Box height="100%">
      <Head>
        <title>Paste App</title>
        <meta name="application-name" content="Days Since" />
        <meta name="apple-mobile-web-app-title" content="Days Since" />
        <meta name="description" content="A simple app for sharing your clipboard between two devices" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>

      <Grid container direction="column" justifyContent="space-between" flexWrap="nowrap" p={2} height={'100%'}>
        <Grid item display="flex" justifyContent="center" alignItems="center">
          <Image src="/android-chrome-192x192.png" alt="Paste App logo" width="40px" height="40px" />
          <Title variant="h4" ml={2}>
            Paste App
          </Title>
        </Grid>
        <Grid
          item
          flexGrow={1}
          display="flex"
          flexDirection="column"
          border="1px solid #673ab7"
          borderRadius={4}
          maxHeight="70vh"
          overflow="auto"
        >
          <Box
            flexGrow={1}
            padding={1}
            display="flex"
            flexDirection="column"
            justifyContent="flex-end"
            alignItems="flex-end"
          >
            {messages.map((message) => (
              <MessageBubble key={message.id}>{message.textBody}</MessageBubble>
            ))}
            <Box ref={endOfMessagesRef}></Box>
          </Box>
        </Grid>
        <Grid item mt={2} display="flex" alignItems="center">
          <Form noValidate onSubmit={handleSubmit(onSubmit)}>
            <Controller
              control={control}
              name={'messageText'}
              render={({ onChange, onBlur, value }) => (
                <WhiteBorderTextField
                  fullWidth
                  multiline
                  maxRows={4}
                  variant="outlined"
                  autoFocus={true}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(onSubmit)();
                    }
                  }}
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value}
                />
              )}
            />
            <SendButton type="submit" aria-label="Add" size="small" sx={{ ml: 1, flexShrink: 0, color: '#5c6bc0' }}>
              {messageText.length === 0 ? <AddIcon /> : <SendIcon />}
            </SendButton>
          </Form>
        </Grid>
      </Grid>
    </Box>
  );
}
