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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 6, textAlign: "center" }}>
        <Typography variant="h3" sx={{ fontWeight: "bold", mb: 2 }}>
          📞 Contactez-nous
        </Typography>
        <Typography variant="h6" sx={{ color: "text.secondary" }}>
          Contactez notre équipe pour toute question ou assistance
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Contact Information */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: "100%", p: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3 }}>
              Nos Coordonnées
            </Typography>
            
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Phone sx={{ color: "primary.main", mr: 2 }} />
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    Téléphone
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    +33 1 23 45 67 89
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Email sx={{ color: "primary.main", mr: 2 }} />
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    Email
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    contact@fitpneus.com
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <LocationOn sx={{ color: "primary.main", mr: 2 }} />
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    Adresse
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    123 Rue de la Paix<br />
                    75001 Paris, France
                </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center" }}>
                <AccessTime sx={{ color: "primary.main", mr: 2 }} />
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    Horaires d'ouverture
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Lun-Ven: 8h00 - 18h00<br />
                    Sam: 9h00 - 16h00<br />
                    Dim: Fermé
                </Typography>
                </Box>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              Pourquoi choisir Fitou Pneus ?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              • Sélection de pneus premium des meilleures marques
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              • Installation et équilibrage expert
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              • Prix compétitifs et options de financement
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Assistance routière 24h/24 et 7j/7
            </Typography>
          </Card>
        </Grid>

        {/* Contact Form */}
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3 }}>
              Envoyez-nous un message
            </Typography>
            
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Nom complet"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Adresse email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Numéro de téléphone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    variant="outlined"
                  />
                  </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Sujet"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    variant="outlined"
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
                    rows={6}
                    variant="outlined"
                    placeholder="Parlez-nous de votre demande, de vos besoins en pneus ou de toute question que vous avez..."
                  />
                </Grid>
                <Grid item xs={12}>
              <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    startIcon={<Send />}
                    disabled={loading}
                    sx={{
                      py: 1.5,
                      px: 4,
                      fontSize: "1rem",
                      fontWeight: "bold",
                      textTransform: "none",
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

      {/* Map Section */}
      <Box sx={{ mt: 6 }}>
        <Card sx={{ p: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3 }}>
            📍 Trouvez-nous
          </Typography>
          <Box
            sx={{
              height: 400,
              backgroundColor: "grey.100",
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "2px dashed",
              borderColor: "grey.300",
            }}
          >
            <Typography variant="h6" color="text.secondary">
              Carte interactive bientôt disponible
            </Typography>
          </Box>
        </Card>
      </Box>

      {/* Success/Error Messages */}
      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: "100%" }}>
          Message envoyé avec succès ! Nous vous répondrons bientôt.
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError("")}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setError("")} severity="error" sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ContactPage; 