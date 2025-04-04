import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const Navbar = ({ onLogout }) => {
  const handleLogout = () => {
    onLogout(false);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Medical AI Assistant
        </Typography>
        <Box>
          <Button color="inherit" onClick={handleLogout} startIcon={<ExitToAppIcon />}>
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;