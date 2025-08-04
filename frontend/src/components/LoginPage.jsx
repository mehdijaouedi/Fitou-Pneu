import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Paper,
  Link as MuiLink,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Added

// Replace with your actual API endpoint
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

function LoginPage({ onLoginSuccess, isModal = false }) { // Added props
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const auth = useAuth(); // Added
  const { openSignUpModal } = useAuth(); // Added


  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('my data', data?.Authorization)
      if (!response.ok) {
        throw new Error(data.message || 'Échec de la connexion. Veuillez vérifier vos identifiants.');
      }

      // Use AuthContext to handle login
      if (auth) { // Check if auth context is available
        auth.loginAction(data.accessToken, data.user);
      }

      if (onLoginSuccess) {
        onLoginSuccess(data.accessToken, data.user); // Callback for modal
        location.reload();
      } else if (!isModal) {
        navigate('/'); // Redirect only if not in modal and no specific callback
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || 'Une erreur inattendue s\'est produite.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ mt: isModal ? 2 : 8, mb: isModal ? 2 : 0 }}> {/* Adjust margin for modal */}
      <Paper elevation={3} sx={{ padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5" gutterBottom>
          Se Connecter
        </Typography>
        {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Adresse Email"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Mot de Passe"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Se Connecter'}
          </Button>
          {isModal && ( // Only show this link if not in modal, modal can have its own navigation or close
            <Typography variant="body2" align="center">
              Vous n'avez pas de compte ?{' '}
              <p onClick={openSignUpModal} style={{ cursor: 'pointer', color: '#1976d2' }}>
                S'inscrire
              </p>
            </Typography>
          )}
        </Box>
      </Paper>
    </Container>
  );
}

export default LoginPage;