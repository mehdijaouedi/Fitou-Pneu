import React from "react";
import {
  Box,
  Grid,
  Typography,
  IconButton,
  Link,
  Divider,
} from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#1a1a1a",
        color: "white",
        py: 6,
        mt: "auto",
        width: "100vw",
        position: "relative",
        left: "50%",
        right: "50%",
        marginLeft: "-50vw",
        marginRight: "-51vw",
        marginBottom: "-50vw",

      }}
    >
      <Box sx={{ px: { xs: 2, md: 8 } }}>
        <Grid container spacing={4} alignItems="flex-start">
          {/* Company Info */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", color: "#fff" }}>
              FitPneus
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, color: "#b0b0b0" }}>
              Votre partenaire de confiance dans les pneus, Nous fournissons les meilleurs prix et qualités.
            </Typography>
            <Box sx={{ mt: 2 }}>
              <IconButton color="inherit" aria-label="Facebook" sx={{ mr: 1 }}>
                <FacebookIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="Instagram" sx={{ mr: 1 }}>
                <InstagramIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="WhatsApp">
                <WhatsAppIcon />
              </IconButton>
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", color: "#fff" }}>
              Contactez-nous
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <PhoneIcon />
                <Typography variant="body2" color="#b0b0b0">+216 12 345 678</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <EmailIcon />
                <Typography variant="body2" color="#b0b0b0">contact@fitpneus.com</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <LocationOnIcon />
                <Typography variant="body2" color="#b0b0b0">
                  123 Rue Principale, Tunis, Tunisie
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <AccessTimeIcon />
                <Typography variant="body2" color="#b0b0b0">
                  Lun-Sam: 8h00 - 20h00
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: "rgba(255, 255, 255, 0.1)" }} />

        {/* Bottom Bar */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography variant="body2" color="#b0b0b0">
            © {new Date().getFullYear()} FitPneus. Tous droits réservés.
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Link href="/privacy" color="inherit" underline="hover" variant="body2">
              Politique de Confidentialité
            </Link>
            <Link href="/terms" color="inherit" underline="hover" variant="body2">
              Conditions d'Utilisation
            </Link>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;
