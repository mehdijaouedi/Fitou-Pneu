import React from "react";
import { Box, Typography, Grid, Link, IconButton } from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import InstagramIcon from "@mui/icons-material/Instagram";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import InfoIcon from "@mui/icons-material/Info";
import HelpIcon from "@mui/icons-material/Help";
import ContactMailIcon from "@mui/icons-material/ContactMail";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#f4f4f4",
        mt: 8,
        py: 4,
        px: 2,
        borderTop: "1px solid #ccc",
      }}
    >
      <Grid container spacing={4} justifyContent="center">
        {/* Contact Info */}
        <Grid item xs={12} sm={6} md={4} color={"black"}>
          <Typography variant="h6" gutterBottom>
            Contact
          </Typography>
          <Box display="flex" alignItems="center" mb={1}>
            <PhoneIcon sx={{ mr: 1 }} />
            <Typography>+216 12 345 678</Typography>
          </Box>
          <Box display="flex" alignItems="center" mb={1}>
            <EmailIcon sx={{ mr: 1 }} />
            <Typography>contact@example.com</Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <WhatsAppIcon sx={{ mr: 1 }} />
            <Typography>WhatsApp: +216 98 765 432</Typography>
          </Box>
        </Grid>

        {/* Navigation Links */}
        <Grid item xs={12} sm={6} md={4}color={"black"}>
          <Typography variant="h6" gutterBottom>
            Quick Links
          </Typography>
          <Box display="flex" flexDirection="column" gap={1}>
            <Link href="#" underline="hover" display="flex" alignItems="center">
              <InfoIcon fontSize="small" sx={{ mr: 1 }} /> About Us
            </Link>
            <Link href="#" underline="hover" display="flex" alignItems="center">
              <HelpIcon fontSize="small" sx={{ mr: 1 }} /> FAQ
            </Link>
            <Link href="#" underline="hover" display="flex" alignItems="center">
              <ContactMailIcon fontSize="small" sx={{ mr: 1 }} /> Contact
            </Link>
            <Link href="#" underline="hover" display="flex" alignItems="center">
              <InstagramIcon fontSize="small" sx={{ mr: 1 }} /> Instagram
            </Link>
          </Box>
        </Grid>
      </Grid>

      {/* Footer Bottom Text */}
      <Box mt={4} textAlign="center">
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} FitouPneu. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;
