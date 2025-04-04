import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  Divider,
  IconButton
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const ChatHistory = ({ messages }) => {
  const handleCopyResponse = (text) => {
    navigator.clipboard.writeText(text);
  };

  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    const date = new Date(message.timestamp).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Conversation History
      </Typography>
      
      {Object.keys(groupedMessages).length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            No conversation history yet. Start chatting with the Medical AI Assistant!
          </Typography>
        </Paper>
      ) : (
        Object.entries(groupedMessages).map(([date, dateMessages]) => (
          <Paper key={date} sx={{ mb: 3, overflow: 'hidden' }}>
            <Box sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
              <Typography variant="subtitle1">{date}</Typography>
            </Box>
            <List>
              {dateMessages.map((message, index) => (
                <React.Fragment key={index}>
                  <ListItem
                    alignItems="flex-start"
                    secondaryAction={
                      message.sender === 'ai' && (
                        <IconButton 
                          edge="end" 
                          aria-label="copy"
                          onClick={() => handleCopyResponse(message.text)}
                        >
                          <ContentCopyIcon />
                        </IconButton>
                      )
                    }
                  >
                    <ListItemText
                      primary={
                        <Typography
                          component="span"
                          variant="body1"
                          color="text.primary"
                          sx={{ fontWeight: message.sender === 'ai' ? 'bold' : 'normal' }}
                        >
                          {message.sender === 'user' ? 'You' : 'Medical AI'}
                        </Typography>
                      }
                      secondary={
                        <>
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            {message.text}
                          </Typography>
                          <Typography
                            component="span"
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: 'block', mt: 1 }}
                          >
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                  {index < dateMessages.length - 1 && <Divider variant="inset" component="li" />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        ))
      )}
    </Box>
  );
};

export default ChatHistory;