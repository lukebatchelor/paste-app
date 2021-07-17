import React from 'react';
import { Box, Grid, Paper, styled } from '@material-ui/core';
import { Message } from '@prisma/client';

const MEDIA_URL = process.env.NEXT_PUBLIC_ASSETS_URL;

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

type MessagesBoxProps = {
  messages: Array<Message>;
  endOfMessagesRef: React.Ref<HTMLDivElement>;
};
export function MessagesBox(props: MessagesBoxProps) {
  const { messages, endOfMessagesRef } = props;

  return (
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
              <MessageImage src={`${MEDIA_URL}/${message.imageName}`} alt={message.textBody} />
            ) : validURL(message.textBody) ? (
              <a href={message.textBody} target="_blank" rel="noopener noreferrer">
                {message.textBody}
              </a>
            ) : !!isCodeBlock(message.textBody) ? (
              <pre>
                <code>{isCodeBlock(message.textBody)[1]}</code>
              </pre>
            ) : (
              message.textBody
            )}
          </MessageBubble>
        ))}
        <Box ref={endOfMessagesRef}></Box>
      </Box>
    </Grid>
  );
}

function validURL(str) {
  var pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i'
  ); // fragment locator
  return !!pattern.test(str);
}

// attempts to extract a codeblock out of of the string. Can be used for testing
// or parsing
function isCodeBlock(str) {
  return /```\n((.|\n)+?)\n```\n?$/.exec(str);
}
