import React from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import {
  Construction,
  Schedule,
  Notifications,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const JentesPage = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 1, md: 2 } }}>
      <Box sx={{ textAlign: "center" }}>
        {/* Header */}
        <Box sx={{ mb: 6 }}>
          <Construction 
            sx={{ 
              fontSize: 80, 
              color: "primary.main", 
              mb: 3 
            }} 
          />
          <Typography variant="h2" sx={{ fontWeight: "bold", mb: 2 }}>
            🚧 Bientôt Disponible
          </Typography>
          <Typography variant="h5" sx={{ color: "text.secondary", mb: 3 }}>
            Notre collection de jantes arrive très prochainement !
          </Typography>
        </Box>

        {/* Main Content */}
        <Card sx={{ maxWidth: 600, mx: "auto", p: 4, mb: 4 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 3 }}>
              ⚙️ Collection de Jantes
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6 }}>
              Nous travaillons actuellement sur notre nouvelle collection de jantes de qualité. 
              Vous pourrez bientôt découvrir :
            </Typography>
            
            <Box sx={{ textAlign: "left", mb: 4 }}>
              <Typography variant="body1" sx={{ mb: 2, display: "flex", alignItems: "center" }}>
                <Schedule sx={{ mr: 2, color: "primary.main" }} />
                Jantes en alliage léger de haute qualité
              </Typography>
              <Typography variant="body1" sx={{ mb: 2, display: "flex", alignItems: "center" }}>
                <Schedule sx={{ mr: 2, color: "primary.main" }} />
                Design moderne et styles variés
              </Typography>
              <Typography variant="body1" sx={{ mb: 2, display: "flex", alignItems: "center" }}>
                <Schedule sx={{ mr: 2, color: "primary.main" }} />
                Tailles et finitions multiples
              </Typography>
              <Typography variant="body1" sx={{ display: "flex", alignItems: "center" }}>
                <Schedule sx={{ mr: 2, color: "primary.main" }} />
                Installation professionnelle incluse
              </Typography>
            </Box>

            <Typography variant="body2" sx={{ color: "text.secondary", fontStyle: "italic" }}>
              Restez à l'écoute ! Nous vous informerons dès que notre collection sera disponible.
            </Typography>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, flexWrap: "wrap" }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<Notifications />}
            onClick={() => {
              // You can add notification signup functionality here
              alert("Fonctionnalité de notification à venir !");
            }}
            sx={{
              py: 1.5,
              px: 4,
              fontSize: "1rem",
              fontWeight: "bold",
              textTransform: "none",
            }}
          >
            Être notifié
          </Button>
          
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate("/pneus")}
            sx={{
              py: 1.5,
              px: 4,
              fontSize: "1rem",
              fontWeight: "bold",
              textTransform: "none",
            }}
          >
            Voir nos pneus
          </Button>
        </Box>

        {/* Additional Info */}
        <Box sx={{ mt: 6, p: 3, bgcolor: "grey.50", borderRadius: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
            💡 En attendant...
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Découvrez notre large sélection de pneus de qualité pour tous types de véhicules.
          </Typography>
          <Button
            variant="text"
            onClick={() => navigate("/pneus")}
            sx={{ fontWeight: "bold" }}
          >
            Explorer nos pneus →
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default JentesPage; 