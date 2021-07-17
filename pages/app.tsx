import { Gluejar } from '@charliewilco/gluejar';
import { Box, Fab, Grid, Paper, TextField, Typography, Backdrop, CircularProgress } from '@material-ui/core';
import { styled } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import SendIcon from '@material-ui/icons/Send';
import { Message } from '@prisma/client';
import { useSession } from 'next-auth/client';
import mitt from 'next/dist/next-server/lib/mitt';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Controller, useForm } from 'react-hook-form';
import { AppBar } from '../components/AppBar';
import { createMessageBubble, MessagesBox } from '../components/MessagesBox';

type FormValues = {
  messageText: string;
  searchText: string;
};

const defaultValues: FormValues = {
  messageText: '',
  searchText: '',
};

const Form = styled('form')({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
});
const WhiteBorderTextField = styled(TextField)`
  color: white !important;
  & .MuiOutlinedInput-root fieldset {
    border-color: #d1c4e9 !important;
    border-radius: 8px;
  }
  & .MuiInputBase-input {
    color: rgba(200, 200, 200, 0.8);
  }
  & .Mui-disabled {
    -webkit-text-fill-color: rgba(200, 200, 200, 0.8);
  }
`;
const SendButton = styled(Fab)`
  color: white !important;
  background-color: #5c6bc0 !important;
`;

export default function App() {
  const [messages, setMessages] = useState<Array<Message>>([]);
  const [session, loading] = useSession();
  const router = useRouter();
  const { handleSubmit, control, reset, watch, setValue } = useForm<FormValues>({ defaultValues });
  const messageText = watch('messageText');
  const searchText = watch('searchText');
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<HTMLDivElement>(null);
  const [backdropOpen, setBackdropOpen] = useState<boolean>(true);
  const [uploadedImg, setUploadedImg] = useState<File>(null);
  const [selectedMessage, setSelectedMessage] = useState<Message>(null);
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setUploadedImg(file);
  }, []);
  const { getInputProps, inputRef } = useDropzone({ onDrop, accept: 'image/*' });

  const refresh = () => {
    return fetch('/api/messages')
      .then((res) => res.json())
      .then((data) => {
        setMessages(data.messages);
        endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
      });
  };
  useEffect(() => {
    refresh();
  }, []);

  const openUploadModal = () => inputRef.current.click();
  const uploadImage = () => {
    const formData = new FormData();
    formData.set('file', uploadedImg, uploadedImg.name);
    fetch('/api/upload', { method: 'POST', body: formData })
      .then((res) => res.json())
      .then((_) => {
        setUploadedImg(null);
        refresh();
      })
      .catch((err) => {
        console.error(err);
        setUploadedImg(null);
      });
  };

  const onSubmit = (data: FormValues) => {
    if (!!uploadedImg) return uploadImage();
    if (data?.messageText?.length === 0) return openUploadModal();

    const { messageText } = data;
    const body = JSON.stringify({ text: messageText });
    const options = { method: 'POST', body, headers: { 'Content-Type': 'application/json' } };
    fetch('/api/messages', options)
      .then((res) => res.json())
      .then(() => {
        reset();
        refresh();
      });
  };
  const onPaste = async (paste) => {
    if (uploadedImg) return;
    const blobUrl = paste.images[0];
    const file = await blobUrlToFile(blobUrl);
    if (file) setUploadedImg(file);
    paste.images = [];
  };

  if (!loading && !session) router.push('/api/auth/signin');

  const filteredMessages = searchText.length
    ? messages.filter((m) => m.textBody.toLowerCase().includes(searchText.toLowerCase()))
    : messages;
  const handleBackdropClose = () => setSelectedMessage(null);
  const onMessageClick = (messageId: string) => setSelectedMessage(messages.find((m) => m.id === messageId));

  return (
    <Box height="100%">
      <Head>
        <title>Paste App</title>
        <meta name="application-name" content="Paste App" />
        <meta name="apple-mobile-web-app-title" content="Paste App" />
        <meta name="description" content="A simple app for sharing your clipboard between two devices" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
      <AppBar control={control} />

      <Grid container direction="column" justifyContent="space-between" flexWrap="nowrap" p={2} height={'100%'}>
        <Grid item mt="70px" />
        <MessagesBox messages={filteredMessages} endOfMessagesRef={endOfMessagesRef} onMessageClick={onMessageClick} />
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
                  disabled={!!uploadedImg}
                  onChange={onChange}
                  onBlur={onBlur}
                  value={uploadedImg ? '[ Image Ready ]' : value}
                />
              )}
            />
            <SendButton type="submit" aria-label="Add" sx={{ ml: 1, flexShrink: 0, color: '#5c6bc0' }}>
              {messageText.length === 0 && !uploadedImg ? <AddIcon /> : <SendIcon />}
            </SendButton>
            <input {...getInputProps()} />
          </Form>
        </Grid>
      </Grid>
      <Gluejar onPaste={onPaste} onError={(err) => console.error(err)} container={appRef.current} />
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={!!selectedMessage}
        onClick={handleBackdropClose}
      >
        {selectedMessage && createMessageBubble(selectedMessage)}
      </Backdrop>
    </Box>
  );
}

async function blobUrlToFile(blobUrl: string) {
  if (!blobUrl) return null;
  const blob = await fetch(blobUrl).then((res) => res.blob());
  const file = new File([blob], 'image.png'); // is it a png??
  return file;
}
