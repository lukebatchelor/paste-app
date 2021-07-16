import Head from 'next/head';
import Image from 'next/image';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Grid,
  Box,
  Typography,
  TextField,
  Fab,
  Paper,
  AppBar,
  IconButton,
  Toolbar,
  InputBase,
  Avatar,
  Divider,
  ListItemIcon,
  Menu,
  MenuItem,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import SendIcon from '@material-ui/icons/Send';
import { Message } from '.prisma/client';
// import styled from '@emotion/styled';
import { styled, alpha } from '@material-ui/core/styles';

import { Controller, useForm } from 'react-hook-form';
import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import { PersonAdd, Settings, Logout } from '@material-ui/icons';
import { useDropzone } from 'react-dropzone';

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
  maxWidth: '80%',
  overflowWrap: 'break-word',
});
const MessageImage = styled('img')({
  maxWidth: '50vw',
  maxHeight: '40vh',
  display: 'block',
  marginLeft: 'auto',
  marginRight: 'auto',
});
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
const Title = styled(Typography)`
  color: #5c6bc0;
  font-weight: 600;
  font-size: 2.5rem;
`;

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: theme.spacing(1),
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '0ch',
    '&:focus': {
      width: '17ch',
    },
  },
}));

export default function App() {
  const [messages, setMessages] = useState<Array<Message>>([]);
  const [session, loading] = useSession();
  const router = useRouter();
  const { handleSubmit, control, reset, watch, setValue } = useForm<FormValues>({ defaultValues });
  const messageText = watch('messageText');
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [uploadedImg, setUploadedImg] = useState<File>(null);
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setUploadedImg(file);
  }, []);
  const { getRootProps, getInputProps, inputRef } = useDropzone({ onDrop, accept: 'image/*' });

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
      .catch((err) => setUploadedImg(null));
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
  const handleClose = () => setMenuOpen(false);
  const handleOpen = () => setMenuOpen(true);
  const mediaUrl = process.env.NEXT_PUBLIC_ASSETS_URL || 'https://media.paste.lbat.ch';

  if (!loading && !session) router.push('/api/auth/signin');

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
      <AppBar position="fixed" sx={{ backgroundColor: '#4a148c' }}>
        <Toolbar>
          <Menu
            anchorEl={buttonRef.current}
            open={menuOpen}
            onClose={handleClose}
            onClick={handleClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                mt: 1.5,
                '&:before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  left: 14,
                  width: 10,
                  height: 10,
                  bgcolor: 'background.paper',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem>Profile</MenuItem>
            <MenuItem>Secret Pastes</MenuItem>
            <MenuItem>Logout</MenuItem>
          </Menu>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            ref={buttonRef}
            onClick={handleOpen}
          >
            <Avatar src={session?.user?.image} />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ ml: 2, flexGrow: 1 }}>
            {session?.user?.name}
          </Typography>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase placeholder="Search…" inputProps={{ 'aria-label': 'search' }} />
          </Search>
        </Toolbar>
      </AppBar>

      <Grid container direction="column" justifyContent="space-between" flexWrap="nowrap" p={2} height={'100%'}>
        <Grid item mt="70px" />
        <Grid
          item
          flexGrow={1}
          display="flex"
          flexDirection="column"
          border="1px solid #d1c4e9"
          borderRadius={4}
          maxHeight="100%"
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
              <MessageBubble key={message.id}>
                {message.imageName ? (
                  <MessageImage src={`${mediaUrl}/${message.imageName}`} alt={message.textBody} />
                ) : (
                  message.textBody
                )}
              </MessageBubble>
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
    </Box>
  );
}
