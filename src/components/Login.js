import React, { useState } from 'react';
import { 
  Container, 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper,
  Alert,
  Grid
} from '@mui/material';

// Using an online image URL instead of a local file
const medicalAiImageUrl = "https://img.freepik.com/free-photo/robot-medical-technology-with-3d-rendering-medical-robot_1150-51587.jpg";

// Predefined credentials for authentication
const validCredentials = {
  username: 'doctor',
  email: 'doctor@hospital.com',
  password: 'password123'
};

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate inputs
    if (!username || !email || !password) {
      setError('All fields are required');
      return;
    }
    
    // Check credentials
    if (
      username === validCredentials.username &&
      email === validCredentials.email &&
      password === validCredentials.password
    ) {
      onLogin(true);
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        backgroundImage: `url(${medicalAiImageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark overlay for better readability
          zIndex: 1
        }
      }}
    >
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 2 }}>
        <Grid container justifyContent="center">
          <Grid item xs={12} md={10}>
            <Paper 
              elevation={6} 
              sx={{ 
                p: 4, 
                width: '100%',
                borderRadius: 2,
                backdropFilter: 'blur(10px)',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
              }}
            >
              <Typography 
                component="h1" 
                variant="h4" 
                align="center" 
                gutterBottom
                sx={{ 
                  fontWeight: 'bold',
                  color: '#1976d2'
                }}
              >
                Medical AI Assistant
              </Typography>
              <Typography 
                component="h2" 
                variant="h5" 
                align="center" 
                gutterBottom
                sx={{ mb: 3 }}
              >
                Login
              </Typography>
              
              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
              
              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                  autoFocus
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ 
                    mt: 3, 
                    mb: 2,
                    borderRadius: 2,
                    py: 1.2,
                    fontWeight: 'bold',
                    boxShadow: 3,
                    '&:hover': {
                      boxShadow: 6,
                      transform: 'translateY(-2px)'
                    },
                    transition: 'all 0.3s'
                  }}
                >
                  Sign In
                </Button>
                
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  align="center"
                  sx={{
                    p: 1,
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    borderRadius: 1
                  }}
                >
                  Use the following credentials for testing:
                  <br />
                  Username: doctor, Email: doctor@hospital.com, Password: password123
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Login;