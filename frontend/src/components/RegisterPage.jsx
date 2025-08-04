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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  Divider,
  Avatar,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Person,
  Email,
  Phone,
  LocationOn,
  Lock,
  CheckCircle,
  ArrowForward,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Replace with your actual API endpoint
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

const steps = ['Informations Personnelles', 'Coordonnées', 'Configuration du Compte'];

function RegisterPage({ onRegisterSuccess, isModal = false }) {
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    adress: '',
    numeroTelephone: '',
    pays: '',
    region: 'Nord France',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();
  const { openLoginModal } = useAuth();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: '',
      });
    }
  };

  const validateStep = (step) => {
    const errors = {};
    
    switch (step) {
      case 0: // Personal Info
        if (!formData.prenom.trim()) errors.prenom = 'Le prénom est requis';
        if (!formData.nom.trim()) errors.nom = 'Le nom est requis';
        if (formData.prenom.length < 2) errors.prenom = 'Le prénom doit contenir au moins 2 caractères';
        if (formData.nom.length < 2) errors.nom = 'Le nom doit contenir au moins 2 caractères';
        break;
      case 1: // Contact Details
        if (!formData.email.trim()) errors.email = 'L\'email est requis';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Veuillez entrer un email valide';
        if (!formData.adress.trim()) errors.adress = 'L\'adresse est requise';
        if (!formData.numeroTelephone.trim()) errors.numeroTelephone = 'Le numéro de téléphone est requis';
        if (!formData.pays.trim()) errors.pays = 'Le pays est requis';
        break;
      case 2: // Account Setup
        if (!formData.password) errors.password = 'Le mot de passe est requis';
        else if (formData.password.length < 6) errors.password = 'Le mot de passe doit contenir au moins 6 caractères';
        if (!formData.confirmPassword) errors.confirmPassword = 'Veuillez confirmer votre mot de passe';
        else if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'Les mots de passe ne correspondent pas';
        break;
      default:
        break;
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      setLoading(false);
      return;
    }

    // Prepare payload for the backend (excluding confirmPassword)
    const { prenom, nom, email, adress, numeroTelephone, pays, region, password } = formData;
    const payload = { prenom, nom, email, adress, numeroTelephone, pays, region, password };

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
        const errorMessage = Array.isArray(data.message) ? data.message.join(', ') : data.message;
        throw new Error(errorMessage || 'L\'inscription a échoué. Veuillez réessayer.');
      }

      setSuccess('Inscription réussie ! Vous pouvez maintenant vous connecter.');
      console.log('Registration successful:', data);

      if (isModal && onRegisterSuccess) {
        setTimeout(() => onRegisterSuccess(), 1500);
      } else if (!isModal) {
        setTimeout(() => navigate('/login'), 2000);
      }

    } catch (err) {
      console.error("Registration error:", err);
      setError(err.message || 'Une erreur inattendue s\'est produite.');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="prenom"
                required
                fullWidth
                label="Prénom"
                value={formData.prenom}
                onChange={handleChange}
                disabled={loading}
                error={!!validationErrors.prenom}
                helperText={validationErrors.prenom}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="nom"
                required
                fullWidth
                label="Nom"
                value={formData.nom}
                onChange={handleChange}
                disabled={loading}
                error={!!validationErrors.nom}
                helperText={validationErrors.nom}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="email"
                required
                fullWidth
                label="Adresse Email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                error={!!validationErrors.email}
                helperText={validationErrors.email}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="adress"
                required
                fullWidth
                label="Adresse"
                value={formData.adress}
                onChange={handleChange}
                disabled={loading}
                error={!!validationErrors.adress}
                helperText={validationErrors.adress}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOn color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="numeroTelephone"
                required
                fullWidth
                label="Numéro de Téléphone"
                value={formData.numeroTelephone}
                onChange={handleChange}
                disabled={loading}
                error={!!validationErrors.numeroTelephone}
                helperText={validationErrors.numeroTelephone}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="pays"
                required
                fullWidth
                label="Pays"
                value={formData.pays}
                onChange={handleChange}
                disabled={loading}
                error={!!validationErrors.pays}
                helperText={validationErrors.pays}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOn color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth error={!!validationErrors.region}>
                <InputLabel>Région</InputLabel>
                <Select
                  name="region"
                  value={formData.region}
                  label="Région"
                  onChange={handleChange}
                  disabled={loading}
                  startAdornment={
                    <InputAdornment position="start">
                      <LocationOn color="action" />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="Nord France">Nord France</MenuItem>
                  <MenuItem value="Sud France">Sud France</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="password"
                required
                fullWidth
                label="Mot de Passe"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                error={!!validationErrors.password}
                helperText={validationErrors.password}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="confirmPassword"
                required
                fullWidth
                label="Confirmer le Mot de Passe"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={loading}
                error={!!validationErrors.confirmPassword}
                helperText={validationErrors.confirmPassword}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        );
      default:
        return null;
    }
  };

  return (
    <Container component="main" maxWidth="sm" sx={{ mt: isModal ? 2 : 8, mb: isModal ? 2 : 4 }}>
      <Paper 
        elevation={8} 
        sx={{ 
          padding: 4, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          borderRadius: 3,
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'primary.main', width: 56, height: 56 }}>
          <CheckCircle />
        </Avatar>
        
        <Typography component="h1" variant="h4" gutterBottom sx={{ fontWeight: 700, color: 'primary.main', mb: 3 }}>
          Créer un Compte
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ width: '100%', mb: 3, borderRadius: 2 }}>
            {success}
          </Alert>
        )}

        <Stepper activeStep={activeStep} sx={{ width: '100%', mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
          {renderStepContent(activeStep)}
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
              variant="outlined"
            >
              Retour
            </Button>
            
            {activeStep === steps.length - 1 ? (
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                endIcon={loading ? <CircularProgress size={20} /> : <ArrowForward />}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 600,
                  background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                  boxShadow: '0 3px 5px 2px rgba(25, 118, 210, .3)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
                  }
                }}
              >
                {loading ? 'Création du Compte...' : 'Créer le Compte'}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                endIcon={<ArrowForward />}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 600,
                  background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                  boxShadow: '0 3px 5px 2px rgba(25, 118, 210, .3)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
                  }
                }}
              >
                Suivant
              </Button>
            )}
          </Box>
        </Box>

        {isModal && (
          <>
            <Divider sx={{ width: '100%', my: 3 }} />
            <Typography variant="body2" align="center" sx={{ color: 'text.secondary' }}>
              Vous avez déjà un compte ?{' '}
              <MuiLink
                component="button"
                variant="body2"
                onClick={() => {
                  if (onRegisterSuccess) onRegisterSuccess(true);
                  else openLoginModal();
                }}
                sx={{ 
                  cursor: 'pointer',
                  fontWeight: 600,
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                  }
                }}
              >
                Se Connecter
              </MuiLink>
            </Typography>
          </>
        )}
      </Paper>
    </Container>
  );
}

export default RegisterPage;