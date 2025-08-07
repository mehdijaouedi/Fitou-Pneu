import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Container,
  Paper,
  Divider,
  Alert,
  Snackbar,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Phone,
  Email,
  LocationOn,
  AccessTime,
  Send,
} from "@mui/icons-material";
import emailjs from 'emailjs-com';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Initialize EmailJS
  useEffect(() => {
    emailjs.init("YOUR_PUBLIC_KEY"); // Replace with your EmailJS public key
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // EmailJS template parameters
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        from_phone: formData.phone,
        subject: formData.subject,
        message: formData.message,
        to_name: "Équipe Fitou Pneus",
      };

      // Send email using EmailJS
      const response = await emailjs.send(
        'YOUR_SERVICE_ID', // Replace with your EmailJS service ID
        'YOUR_TEMPLATE_ID', // Replace with your EmailJS template ID
        templateParams,
        'YOUR_PUBLIC_KEY' // Replace with your EmailJS public key
      );

      if (response.status === 200) {
        setSuccess(true);
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      } else {
        throw new Error('Failed to send email');
      }
    } catch (err) {
      console.error("Email error:", err);
      setError("Échec de l'envoi du message. Veuillez réessayer ou nous contacter directement.");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSuccess(false);
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
      {/* Header */}
      <Box sx={{ mb: { xs: 3, md: 6 }, textAlign: "center" }}>
        <Typography 
          variant={isMobile ? "h4" : "h3"} 
          sx={{ fontWeight: "bold", mb: { xs: 1, md: 2 } }}
        >
          📞 Contactez-nous
        </Typography>
        <Typography 
          variant={isMobile ? "body1" : "h6"} 
          sx={{ color: "text.secondary" }}
        >
          Contactez notre équipe pour toute question ou assistance
        </Typography>
      </Box>

      <Grid container spacing={isMobile ? 2 : 4}>
        {/* Contact Information */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: "100%", p: { xs: 2, md: 3 } }}>
            <Typography 
              variant={isMobile ? "h6" : "h5"} 
              sx={{ fontWeight: "bold", mb: 3 }}
            >
              Nos Coordonnées
            </Typography>
            
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Phone sx={{ color: "primary.main", mr: 2 }} />
                <Box>
                  <Typography 
                    variant={isMobile ? "subtitle2" : "subtitle1"} 
                    sx={{ fontWeight: "bold" }}
                  >
                    Téléphone
                  </Typography>
                  <Typography 
                    variant={isMobile ? "body2" : "body1"} 
                    color="text.secondary"
                  >
                    +0033 759368879
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Email sx={{ color: "primary.main", mr: 2 }} />
                <Box>
                  <Typography 
                    variant={isMobile ? "subtitle2" : "subtitle1"} 
                    sx={{ fontWeight: "bold" }}
                  >
                    Email
                  </Typography>
                  <Typography 
                    variant={isMobile ? "body2" : "body1"} 
                    color="text.secondary"
                  >
                    contact@fitpneus.com
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <LocationOn sx={{ color: "primary.main", mr: 2 }} />
                <Box>
                  <Typography 
                    variant={isMobile ? "subtitle2" : "subtitle1"} 
                    sx={{ fontWeight: "bold" }}
                  >
                    Adresse
                  </Typography>
                  <Typography 
                    variant={isMobile ? "body2" : "body1"} 
                    color="text.secondary"
                  >
                    123 Rue de la Paix<br />
                    75001 Paris, France
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center" }}>
                <AccessTime sx={{ color: "primary.main", mr: 2 }} />
                <Box>
                  <Typography 
                    variant={isMobile ? "subtitle2" : "subtitle1"} 
                    sx={{ fontWeight: "bold" }}
                  >
                    Horaires d'ouverture
                  </Typography>
                  <Typography 
                    variant={isMobile ? "body2" : "body1"} 
                    color="text.secondary"
                  >
                    Lun-Ven: 8h00 - 18h00<br />
                    Sam: 9h00 - 16h00<br />
                    Dim: Fermé
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Typography 
              variant={isMobile ? "subtitle1" : "h6"} 
              sx={{ fontWeight: "bold", mb: 2 }}
            >
              Pourquoi choisir Fitou Pneus ?
            </Typography>
            <Typography 
              variant={isMobile ? "body2" : "body1"} 
              color="text.secondary" 
              sx={{ mb: 2 }}
            >
              • Sélection de pneus premium des meilleures marques
            </Typography>
            <Typography 
              variant={isMobile ? "body2" : "body1"} 
              color="text.secondary" 
              sx={{ mb: 2 }}
            >
              • Installation et équilibrage expert
            </Typography>
            <Typography 
              variant={isMobile ? "body2" : "body1"} 
              color="text.secondary" 
              sx={{ mb: 2 }}
            >
              • Prix compétitifs et options de financement
            </Typography>
            <Typography 
              variant={isMobile ? "body2" : "body1"} 
              color="text.secondary"
            >
              • Assistance routière 24h/24 et 7j/7
            </Typography>
          </Card>
        </Grid>

        {/* Contact Form */}
        <Grid item xs={12} md={8}>
          <Card sx={{ p: { xs: 2, md: 4 } }}>
            <Typography 
              variant={isMobile ? "h6" : "h5"} 
              sx={{ fontWeight: "bold", mb: 3 }}
            >
              Envoyez-nous un message
            </Typography>
            
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
              <Grid container spacing={isMobile ? 2 : 3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Nom complet"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    size={isMobile ? "small" : "medium"}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    size={isMobile ? "small" : "medium"}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Numéro de téléphone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    size={isMobile ? "small" : "medium"}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Sujet"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    size={isMobile ? "small" : "medium"}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    multiline
                    rows={isMobile ? 4 : 6}
                    size={isMobile ? "small" : "medium"}
                    sx={{ mb: 3 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={loading}
                    startIcon={<Send />}
                    size={isMobile ? "medium" : "large"}
                    sx={{
                      py: { xs: 1, md: 1.5 },
                      px: { xs: 3, md: 4 },
                      fontSize: { xs: '0.9rem', md: '1rem' },
                      fontWeight: 'bold',
                      borderRadius: 2,
                    }}
                  >
                    {loading ? "Envoi en cours..." : "Envoyer le message"}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Card>
        </Grid>
      </Grid>

      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Message envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError("")}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setError("")} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ContactPage; 