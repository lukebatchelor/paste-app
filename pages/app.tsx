import Head from 'next/head';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { Grid, Box, Typography, TextField, Fab, Paper } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
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

export default function App() {
  const [messages, setMessages] = useState<Array<Message>>([]);
  const { handleSubmit, control, reset } = useForm<FormValues>({ defaultValues });
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const refresh = () => {
    return fetch('/api/messages')
      .then((res) => res.json())
      .then((data) => {
        console.log('here', { data });
        setMessages(data.messages);
      });
  };
  useEffect(() => {
    refresh();
  }, []);

  const onSubmit = (data: FormValues) => {
    const { messageText } = data;
    if (!messageText) return;
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
    <div>
      <Head>
        <title>Paste App</title>
        <meta name="description" content="A simple app for sharing your clipboard between two devices" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Grid container direction="column" justifyContent="space-between" p={2} minHeight={'100vh'}>
        <Grid item display="flex" justifyContent="center" alignItems="center">
          <Image src="/android-chrome-192x192.png" alt="Paste App logo" width="40px" height="40px" />
          <Typography variant="h4" ml={2} color="white">
            Paste App
          </Typography>
        </Grid>
        <Grid
          item
          flexGrow={1}
          display="flex"
          flexDirection="column"
          mt={2}
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
          <Form noValidate onSubmit={handleSubmit(onSubmit)} ref={formRef}>
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
                      console.log('here', formRef.current);
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
              <AddIcon />
            </SendButton>
          </Form>
        </Grid>
      </Grid>
    </div>
  );
}
