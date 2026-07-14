import { useState } from 'react';
import {
  Avatar,
  Button,
  TextField,
  Box,
  Typography,
  Container,
  Paper,
  CssBaseline
} from '@mui/material';
import ComputerIcon from '@mui/icons-material/Computer'; // Ícono más adecuado para una tienda de PC

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Login de PC Store:', formData);
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper 
          elevation={5} 
          sx={{ 
            padding: 4, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            width: '100%',
            borderRadius: 3
          }}
        >
          {/* Avatar con un color más tecnológico */}
          <Avatar sx={{ m: 1, bgcolor: 'primary.dark' }}>
            <ComputerIcon />
          </Avatar>
          
          <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold' }}>
            Acceso a PC Store
          </Typography>
          
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email de usuario"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Contraseña"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' } }}
            >
              Iniciar sesión en la tienda
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}