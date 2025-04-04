import React, { useState, useEffect, useRef } from 'react';
import { 
  Container, 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper,
  Grid,
  IconButton,
  Tabs,
  Tab,
  Divider,
  CircularProgress,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Tooltip,
  Fade
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import BarChartIcon from '@mui/icons-material/BarChart';
import HistoryIcon from '@mui/icons-material/History';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import PieChartIcon from '@mui/icons-material/PieChart';
import DonutLargeIcon from '@mui/icons-material/DonutLarge';
import TimelineIcon from '@mui/icons-material/Timeline';
import Navbar from './Navbar';
import Chart from './Chart';
import ChatHistory from './ChatHistory';
import axios from 'axios';

// Gemini API configuration
const GEMINI_API_KEY = "AIzaSyBs_HFt8B2e-B6z3eF7lf_ayqVuR2Ayj4I";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

// Medical disclaimer to append to responses
const MEDICAL_DISCLAIMER = "Note: This information is for general informational purposes only and is not a substitute for professional medical advice. Please consult a healthcare professional for personalized guidance.";

// Get AI response using Gemini API
const getMedicalAIResponse = async (message) => {
  try {
    console.log("Sending request to Gemini API...");
    
    // Check for emergency keywords
    const emergencyKeywords = ['blood', 'bleeding', 'fallen', 'accident', 'emergency', 'pain', 'severe', 'heart attack', 'stroke', 'unconscious', 'breathing', 'chest pain'];
    const isEmergency = emergencyKeywords.some(keyword => message.toLowerCase().includes(keyword));
    
    // If it's an emergency, provide immediate response
    if (isEmergency) {
      console.log("Emergency situation detected, providing immediate response");
      return "This appears to be an emergency situation. Please seek immediate medical attention by calling emergency services (911) or going to the nearest emergency room. For severe bleeding, apply direct pressure to the wound with a clean cloth or bandage until medical help arrives.\n\n" + MEDICAL_DISCLAIMER;
    }
    
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: `You are a medical AI chatbot integrated into a React-based web interface. Maintain a conversational and empathetic tone throughout the conversation. 

If the user's query indicates severe or urgent symptoms (e.g., chest pain, difficulty breathing, bleeding, falls, accidents), respond IMMEDIATELY with: "This appears to be an emergency situation. Please seek immediate medical attention by calling emergency services (911) or going to the nearest emergency room."

For non-emergency general questions, provide clear, basic advice while being cautious not to provide definitive diagnoses. Always emphasize the importance of consulting with a healthcare professional for proper evaluation.

USER QUERY: ${message}`
              }
            ]
          }
        ]
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
    
    console.log("Gemini API response:", response.data);
    let aiResponse = response.data.candidates[0].content.parts[0].text;
    
    // Append medical disclaimer if not already included
    if (!aiResponse.includes(MEDICAL_DISCLAIMER)) {
      aiResponse += "\n\n" + MEDICAL_DISCLAIMER;
    }
    
    return aiResponse;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    
    // Check for emergency keywords in fallback mode
    const emergencyKeywords = ['blood', 'bleeding', 'fallen', 'accident', 'emergency', 'pain', 'severe', 'heart attack', 'stroke', 'unconscious', 'breathing', 'chest pain'];
    const isEmergency = emergencyKeywords.some(keyword => message.toLowerCase().includes(keyword));
    
    // Provide appropriate fallback response
    if (isEmergency) {
      return "This appears to be an emergency situation. Please seek immediate medical attention by calling emergency services (911) or going to the nearest emergency room. For severe bleeding, apply direct pressure to the wound with a clean cloth or bandage until medical help arrives.\n\n" + MEDICAL_DISCLAIMER;
    }
    
    // Fallback to more appropriate mock responses if API fails
    console.log("Using fallback response mechanism");
    const responses = [
      "Based on the symptoms you've described, it could be a common cold. I recommend rest and plenty of fluids. If symptoms persist for more than a week or worsen, please consult with a healthcare provider.\n\n" + MEDICAL_DISCLAIMER,
      "Your symptoms might indicate a seasonal allergy. Consider taking an over-the-counter antihistamine. If symptoms are severe or persistent, please consult with a healthcare provider.\n\n" + MEDICAL_DISCLAIMER,
      "This could be a sign of a viral infection. Monitor your symptoms and get plenty of rest. If you develop a high fever or symptoms worsen, please consult your doctor.\n\n" + MEDICAL_DISCLAIMER,
      "The symptoms you've mentioned are consistent with a mild case of influenza. Rest, hydration, and over-the-counter pain relievers may help manage symptoms. If you experience difficulty breathing or symptoms worsen, seek medical attention.\n\n" + MEDICAL_DISCLAIMER,
      "From what you've described, this might be a minor condition, but it's best to consult with a healthcare provider for proper diagnosis and treatment.\n\n" + MEDICAL_DISCLAIMER
    ];
    
    // Return a random fallback response
    return responses[Math.floor(Math.random() * responses.length)];
  }
};

const ChatInterface = ({ onLogout }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [chartType, setChartType] = useState('bar');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [recentQueries, setRecentQueries] = useState([]);
  const [chartData, setChartData] = useState({
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Interactions',
        data: [3, 5, 2, 8, 4, 6, 2],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  });
  
  const messagesEndRef = useRef(null);

  // Display welcome message on first load
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage = {
        text: "Hello, how can I help you today?\n\nYou can ask me medical questions, and I'll do my best to provide helpful information. Remember that you can copy my responses, edit your queries, or view your interaction history using the tabs above.",
        sender: 'ai',
        timestamp: new Date().toISOString()
      };
      setMessages([welcomeMessage]);
    }
  }, []);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage = { text: input, sender: 'user', timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMessage]);
    
    // Add to recent queries
    setRecentQueries(prev => {
      const newQueries = [input, ...prev.slice(0, 4)];
      return newQueries;
    });
    
    setInput('');
    setIsLoading(true);
    
    // Add a temporary loading message
    const loadingId = Date.now();
    const loadingMessage = { 
      id: loadingId,
      text: "Thinking...", 
      sender: 'ai', 
      timestamp: new Date().toISOString(),
      isLoading: true 
    };
    setMessages(prev => [...prev, loadingMessage]);
    
    try {
      // Get AI response
      const response = await getMedicalAIResponse(input);
      
      // Remove loading message and add real response
      setMessages(prev => {
        const filtered = prev.filter(msg => msg.id !== loadingId);
        return [...filtered, { 
          text: response, 
          sender: 'ai', 
          timestamp: new Date().toISOString() 
        }];
      });
      
      // Update chart data with new interaction
      updateChartData();
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      // Remove loading message and add error message
      setMessages(prev => {
        const filtered = prev.filter(msg => msg.id !== loadingId);
        return [...filtered, { 
          text: 'Sorry, there was an error processing your request. Please try again later or contact support if the issue persists.', 
          sender: 'ai', 
          timestamp: new Date().toISOString(),
          isError: true
        }];
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateChartData = () => {
    // In a real app, this would update based on actual data
    setChartData(prevData => {
      const newData = {...prevData};
      newData.datasets[0].data = prevData.datasets[0].data.map(val => val + Math.floor(Math.random() * 3));
      return newData;
    });
  };

  const handleCopyResponse = (text) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const generateNewChart = () => {
    // Generate random data for demonstration
    const newData = {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [
        {
          label: 'Interactions',
          data: Array(7).fill().map(() => Math.floor(Math.random() * 10) + 1),
          backgroundColor: 'rgba(153, 102, 255, 0.2)',
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 1,
        },
      ],
    };
    setChartData(newData);
  };

  const changeChartType = (type) => {
    setChartType(type);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleRecentQueryClick = (query) => {
    setInput(query);
    setSidebarOpen(false);
  };

  return (
    <>
      <Navbar onLogout={onLogout} />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 2, borderRadius: 3, boxShadow: 3 }}>
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange} 
                centered
                sx={{
                  '& .MuiTabs-indicator': {
                    backgroundColor: 'primary.main',
                    height: 3,
                  },
                  '& .MuiTab-root': {
                    fontWeight: 'bold',
                    transition: 'all 0.2s',
                    '&:hover': {
                      color: 'primary.main',
                      opacity: 1,
                    },
                    '&.Mui-selected': {
                      color: 'primary.main',
                    },
                  },
                }}
              >
                <Tab icon={<SendIcon />} label="Chat" />
                <Tab icon={<BarChartIcon />} label="Analytics" />
                <Tab icon={<HistoryIcon />} label="History" />
              </Tabs>
              
              <Box sx={{ p: 2 }}>
                {tabValue === 0 && (
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
                      <Tooltip title="Recent Queries">
                        <Button 
                          variant="outlined" 
                          startIcon={<HistoryIcon />}
                          onClick={toggleSidebar}
                          size="small"
                        >
                          Recent
                        </Button>
                      </Tooltip>
                    </Box>
                    
                    <Box 
                      sx={{ 
                        height: '60vh', 
                        overflowY: 'auto', 
                        p: 2, 
                        backgroundColor: '#f8f9fa',
                        borderRadius: 2,
                        mb: 2,
                        boxShadow: 'inset 0 0 5px rgba(0,0,0,0.1)',
                        scrollBehavior: 'smooth'
                      }}
                    >
                      {messages.length === 0 ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                          <Typography variant="body1" color="text.secondary">
                            Start a conversation with the Medical AI Assistant
                          </Typography>
                        </Box>
                      ) : (
                        messages.map((message, index) => (
                          <Fade in={true} key={index} timeout={500}>
                            <Box 
                              sx={{
                                display: 'flex',
                                justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                                mb: 2
                              }}
                            >
                              <Paper 
                                elevation={2}
                                sx={{
                                  p: 2,
                                  maxWidth: '70%',
                                  backgroundColor: message.sender === 'user' ? '#e3f2fd' : '#ffffff',
                                  borderRadius: message.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                                  boxShadow: message.sender === 'user' 
                                    ? '0 2px 5px rgba(0,0,0,0.1)' 
                                    : '0 2px 5px rgba(0,0,0,0.1)',
                                  transition: 'all 0.3s ease',
                                  '&:hover': {
                                    boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
                                  }
                                }}
                              >
                                {message.isLoading ? (
                                  <Box sx={{ display: 'flex', alignItems: 'center', p: 1 }}>
                                    <Typography variant="body1" sx={{ mr: 2 }}>Thinking</Typography>
                                    <Box sx={{ display: 'flex' }}>
                                      <Box
                                        sx={{
                                          width: '8px',
                                          height: '8px',
                                          borderRadius: '50%',
                                          backgroundColor: 'primary.main',
                                          animation: 'pulse 1s infinite',
                                          animationDelay: '0s',
                                          mx: 0.5,
                                          '@keyframes pulse': {
                                            '0%': { opacity: 0.5, transform: 'scale(1)' },
                                            '50%': { opacity: 1, transform: 'scale(1.2)' },
                                            '100%': { opacity: 0.5, transform: 'scale(1)' },
                                          },
                                        }}
                                      />
                                      <Box
                                        sx={{
                                          width: '8px',
                                          height: '8px',
                                          borderRadius: '50%',
                                          backgroundColor: 'primary.main',
                                          animation: 'pulse 1s infinite',
                                          animationDelay: '0.2s',
                                          mx: 0.5,
                                        }}
                                      />
                                      <Box
                                        sx={{
                                          width: '8px',
                                          height: '8px',
                                          borderRadius: '50%',
                                          backgroundColor: 'primary.main',
                                          animation: 'pulse 1s infinite',
                                          animationDelay: '0.4s',
                                          mx: 0.5,
                                        }}
                                      />
                                    </Box>
                                  </Box>
                                ) : (
                                  <>
                                    <Typography 
                                      variant="body1" 
                                      style={{ 
                                        whiteSpace: 'pre-line',
                                        lineHeight: 1.6
                                      }}
                                    >
                                      {message.text}
                                    </Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                                      <Typography variant="caption" color="text.secondary">
                                        {new Date(message.timestamp).toLocaleTimeString()}
                                      </Typography>
                                      {message.sender === 'ai' && (
                                        <Tooltip title="Copy to clipboard">
                                          <IconButton 
                                            size="small" 
                                            onClick={() => handleCopyResponse(message.text)}
                                            aria-label="copy response"
                                            sx={{
                                              transition: 'all 0.2s',
                                              '&:hover': {
                                                color: 'primary.main',
                                                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                              }
                                            }}
                                          >
                                            <ContentCopyIcon fontSize="small" />
                                          </IconButton>
                                        </Tooltip>
                                      )}
                                    </Box>
                                  </>
                                )}
                              </Paper>
                            </Box>
                          </Fade>
                        ))
                      )}
                      <div ref={messagesEndRef} />
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Type your medical question here..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                        multiline
                        rows={2}
                        disabled={isLoading}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            transition: 'all 0.3s',
                            '&.Mui-focused': {
                              boxShadow: '0 0 0 3px rgba(25, 118, 210, 0.2)',
                            },
                          }
                        }}
                      />
                      <Button 
                        variant="contained" 
                        color="primary" 
                        endIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                        onClick={handleSendMessage}
                        disabled={isLoading || !input.trim()}
                        sx={{ 
                          alignSelf: 'flex-end',
                          borderRadius: 2,
                          px: 3,
                          py: 1.5,
                          boxShadow: 2,
                          transition: 'all 0.3s',
                          '&:hover': {
                            boxShadow: 4,
                            transform: 'translateY(-2px)'
                          },
                          '&:active': {
                            boxShadow: 1,
                            transform: 'translateY(0)'
                          }
                        }}
                      >
                        {isLoading ? 'Sending' : 'Send'}
                      </Button>
                    </Box>
                  </Box>
                )}
                
                {tabValue === 1 && (
                  <Box sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Interaction Analytics</Typography>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button 
                          variant="outlined" 
                          startIcon={<BarChartIcon />}
                          onClick={generateNewChart}
                          sx={{
                            borderRadius: 2,
                            transition: 'all 0.2s',
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: 1
                            }
                          }}
                        >
                          Generate New Data
                        </Button>
                        <Button 
                          variant="contained" 
                          color="secondary"
                          onClick={() => changeChartType(chartType === 'bar' ? 'line' : 'bar')}
                          sx={{
                            borderRadius: 2,
                            transition: 'all 0.2s',
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: 2
                            }
                          }}
                        >
                          Switch to {chartType === 'bar' ? 'Line' : 'Bar'} Chart
                        </Button>
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', mb: 2 }}>
                      <Tooltip title="Bar Chart">
                        <IconButton 
                          color={chartType === 'bar' ? 'primary' : 'default'} 
                          onClick={() => changeChartType('bar')}
                        >
                          <BarChartIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Line Chart">
                        <IconButton 
                          color={chartType === 'line' ? 'primary' : 'default'} 
                          onClick={() => changeChartType('line')}
                        >
                          <TimelineIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Pie Chart">
                        <IconButton 
                          color={chartType === 'pie' ? 'primary' : 'default'} 
                          onClick={() => changeChartType('pie')}
                        >
                          <PieChartIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Doughnut Chart">
                        <IconButton 
                          color={chartType === 'doughnut' ? 'primary' : 'default'} 
                          onClick={() => changeChartType('doughnut')}
                        >
                          <DonutLargeIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                    
                    <Divider sx={{ mb: 2 }} />
                    <Chart chartData={chartData} chartType={chartType} />
                  </Box>
                )}
                
                {tabValue === 2 && (
                  <ChatHistory messages={messages} />
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
      
      {/* Recent Queries Sidebar */}
      <Drawer
        anchor="right"
        open={sidebarOpen}
        onClose={toggleSidebar}
        sx={{
          '& .MuiDrawer-paper': {
            width: 300,
            boxSizing: 'border-box',
            borderRadius: '12px 0 0 12px',
            boxShadow: '-5px 0 15px rgba(0,0,0,0.1)',
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Recent Queries</Typography>
          <IconButton onClick={toggleSidebar}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />
        <List>
          {recentQueries.length > 0 ? (
            recentQueries.map((query, index) => (
              <ListItem 
                button 
                key={index} 
                onClick={() => handleRecentQueryClick(query)}
                sx={{
                  transition: 'all 0.2s',
                  '&:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 0.08)',
                    transform: 'translateX(-4px)'
                  }
                }}
              >
                <ListItemIcon>
                  <ChatIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary={query.length > 30 ? query.substring(0, 30) + '...' : query} 
                  secondary={`${Math.floor(index * 3 + 1)} min ago`}
                />
              </ListItem>
            ))
          ) : (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography color="text.secondary">No recent queries yet</Typography>
            </Box>
          )}
        </List>
      </Drawer>
    </>
  );
};

export default ChatInterface;