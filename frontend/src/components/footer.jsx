import React from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  IconButton,
  Divider,
  Link,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#1a1a1a",
        color: "white",
        py: { xs: 4, md: 6 },
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
        <Grid container spacing={isMobile ? 3 : 4} alignItems="flex-start">
          {/* Company Info */}
          <Grid item xs={12} md={6}>
            <Typography 
              variant={isMobile ? "h6" : "h5"} 
              gutterBottom 
              sx={{ fontWeight: "bold", color: "#fff" }}
            >
              FitPneus
            </Typography>
            <Typography 
              variant={isMobile ? "body2" : "body1"} 
              sx={{ mb: 2, color: "#b0b0b0" }}
            >
              Votre partenaire de confiance dans les pneus, Nous fournissons les meilleurs prix et qualités.
            </Typography>
            <Box sx={{ mt: 2 }}>
              <IconButton 
                color="inherit" 
                aria-label="Facebook" 
                sx={{ mr: 1 }}
                size={isMobile ? "small" : "medium"}
              >
                <FacebookIcon />
              </IconButton>
              <IconButton 
                color="inherit" 
                aria-label="Instagram" 
                sx={{ mr: 1 }}
                size={isMobile ? "small" : "medium"}
              >
                <InstagramIcon />
              </IconButton>
              <IconButton 
                color="inherit" 
                aria-label="WhatsApp"
                size={isMobile ? "small" : "medium"}
              >
                <WhatsAppIcon />
              </IconButton>
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} md={6}>
            <Typography 
              variant={isMobile ? "h6" : "h5"} 
              gutterBottom 
              sx={{ fontWeight: "bold", color: "#fff" }}
            >
              Contactez-nous
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 1.5, md: 2 } }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <PhoneIcon sx={{ fontSize: { xs: '1.2rem', md: '1.5rem' } }} />
                <Typography 
                  variant={isMobile ? "body2" : "body1"} 
                  color="#b0b0b0"
                >
                  +0033 759368879
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <EmailIcon sx={{ fontSize: { xs: '1.2rem', md: '1.5rem' } }} />
                <Typography 
                  variant={isMobile ? "body2" : "body1"} 
                  color="#b0b0b0"
                >
                  contact@fitpneus.com
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <LocationOnIcon sx={{ fontSize: { xs: '1.2rem', md: '1.5rem' } }} />
                <Typography 
                  variant={isMobile ? "body2" : "body1"} 
                  color="#b0b0b0"
                >
                  123 Rue Principale, Tunis, Tunisie
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <AccessTimeIcon sx={{ fontSize: { xs: '1.2rem', md: '1.5rem' } }} />
                <Typography 
                  variant={isMobile ? "body2" : "body1"} 
                  color="#b0b0b0"
                >
                  Lun-Sam: 8h00 - 20h00
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: { xs: 3, md: 4 }, borderColor: "rgba(255, 255, 255, 0.1)" }} />

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
          <Typography 
            variant={isMobile ? "body2" : "body1"} 
            color="#b0b0b0"
            sx={{ textAlign: { xs: 'center', sm: 'left' } }}
          >
            © {new Date().getFullYear()} FitPneus. Tous droits réservés.
          </Typography>
          <Box sx={{ 
            display: "flex", 
            gap: { xs: 1, md: 2 },
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "center"
          }}>
            <Link 
              href="/privacy" 
              color="inherit" 
              underline="hover" 
              variant={isMobile ? "body2" : "body1"}
              sx={{ textAlign: 'center' }}
            >
              Politique de Confidentialité
            </Link>
            <Link 
              href="/terms" 
              color="inherit" 
              underline="hover" 
              variant={isMobile ? "body2" : "body1"}
              sx={{ textAlign: 'center' }}
            >
              Conditions d'Utilisation
            </Link>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;
