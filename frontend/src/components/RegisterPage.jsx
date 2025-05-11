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
  Grid,
  Link as MuiLink,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Replace with your actual API endpoint
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

function RegisterPage({ onRegisterSuccess, isModal = false }) {
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    adress: '',
    numeroTelephone: '',
    pays: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { openLoginModal } = useAuth(); // Added

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    // Prepare payload for the backend (excluding confirmPassword)
    const { prenom, nom, email, adress, numeroTelephone, pays, password } = formData;
    const payload = { prenom, nom, email, adress, numeroTelephone, pays, password };

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        // Assuming the backend returns a message or an array of messages for errors
        const errorMessage = Array.isArray(data.message) ? data.message.join(', ') : data.message;
        throw new Error(errorMessage || 'Registration failed. Please try again.');
      }

      setSuccess('Registration successful! You can now log in.');
      console.log('Registration successful:', data);

      if (isModal && onRegisterSuccess) {
        setTimeout(() => onRegisterSuccess(), 1500); // Call callback, perhaps after a short delay for user to see message
      } else if (!isModal) {
        // Redirect to login page after a short delay
        setTimeout(() => navigate('/login'), 2000);
      }

    } catch (err) {
      console.error("Registration error:", err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ mt: isModal ? 2 : 8, mb: isModal ? 2 : 4 }}>
      <Paper elevation={3} sx={{ padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5" gutterBottom>
          Sign Up
        </Typography>
        {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ width: '100%', mb: 2 }}>{success}</Alert>}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField name="prenom" required fullWidth id="prenom" label="First Name" autoFocus value={formData.prenom} onChange={handleChange} disabled={loading} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField name="nom" required fullWidth id="nom" label="Last Name" value={formData.nom} onChange={handleChange} disabled={loading} />
            </Grid>
            <Grid item xs={12}>
              <TextField name="email" required fullWidth id="email" label="Email Address" type="email" autoComplete="email" value={formData.email} onChange={handleChange} disabled={loading} />
            </Grid>
            <Grid item xs={12}>
              <TextField name="adress" required fullWidth id="adress" label="Address" value={formData.adress} onChange={handleChange} disabled={loading} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField name="numeroTelephone" required fullWidth id="numeroTelephone" label="Phone Number" value={formData.numeroTelephone} onChange={handleChange} disabled={loading} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField name="pays" required fullWidth id="pays" label="Country" value={formData.pays} onChange={handleChange} disabled={loading} />
            </Grid>
            <Grid item xs={12}>
              <TextField name="password" required fullWidth label="Password" type="password" id="password" value={formData.password} onChange={handleChange} disabled={loading} />
            </Grid>
            <Grid item xs={12}>
              <TextField name="confirmPassword" required fullWidth label="Confirm Password" type="password" id="confirmPassword" value={formData.confirmPassword} onChange={handleChange} disabled={loading} />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign Up'}
          </Button>
          {isModal && ( // Only show this link if in modal, standalone page has its own navigation
            <Typography variant="body2" align="center">
              Already have an account?{' '}
              <MuiLink component="button" variant="body2" onClick={() => {
                if (onRegisterSuccess) onRegisterSuccess(true); // Signal to switch to login
                else openLoginModal(); // Fallback if no specific modal handler
              }} sx={{ cursor: 'pointer' }}>
                Sign In
              </MuiLink>
            </Typography>
          )}
        </Box>
      </Paper>
    </Container>
  );
}

export default RegisterPage;