import React from 'react';
import Link from 'next/link';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

const Header = () => (
  <Box sx={{ flexGrow: 1, marginBottom: 2 }}>
    <AppBar position="static">
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          PWA EXAMPLE
        </Typography>
        <Box className="menu" sx={{ flexGrow: 1, display: { md: 'flex' } }}>
          <Button key="home" sx={{ my: 2, color: 'white' }}>
            <Link href="/">Home</Link>
          </Button>
          <Button key="about" sx={{ my: 2, color: 'white' }}>
            <Link href="/about">About</Link>
          </Button>
        </Box>
        <Button color="inherit">Login</Button>
      </Toolbar>
    </AppBar>
  </Box>
);

export default Header;
