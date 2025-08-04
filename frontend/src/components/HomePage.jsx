import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Container,
  Chip,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import PneuCard from "./PneuCard";
import sanityClient from "../../sanity/client";
import { useAuth } from "../context/AuthContext";

const HomePage = () => {
  const [promotionalProducts, setPromotionalProducts] = useState({
    pneus: [],
    jentes: [],
    mixt: [],
  });
  const [dynamicContent, setDynamicContent] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Get user region, default to Nord France
  const userRegion = user?.region || 'Nord France';

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch promotional products from each category (all promotional products)
        const [pneusData, jentesData, mixtData, contentData] = await Promise.all([
          sanityClient.fetch(`
            *[_type == "pneu" && isPromotion == true] | order(dateAdded desc){
              _id,
              name,
              price,
              nordPrice,
              sudPrice,
              sellingPrice,
              description,
              dateAdded,
              quantity,
              type,
              season,
              sizes,
              isPromotion,
              promotionDiscount,
              images[]->{ 
                _id,
                path,
                dbId,
                url
              }
            }
          `),
          sanityClient.fetch(`
            *[_type == "jente" && isPromotion == true] | order(dateAdded desc){
              _id,
              name,
              price,
              nordPrice,
              sudPrice,
              sellingPrice,
              description,
              dateAdded,
              quantity,
              isPromotion,
              promotionDiscount,
              images[]->{ 
                _id,
                path,
                dbId,
                url
              }
            }
          `),
          sanityClient.fetch(`
            *[_type == "mixt" && isPromotion == true] | order(dateAdded desc){
              _id,
              name,
              price,
              nordPrice,
              sudPrice,
              sellingPrice,
              description,
              dateAdded,
              quantity,
              isPromotion,
              promotionDiscount,
              images[]->{ 
                _id,
                path,
                dbId,
                url
              }
            }
          `),
          // Fetch dynamic content from Sanity (you can create a content type for this)
          sanityClient.fetch(`
            *[_type == "homeContent"] | order(_createdAt desc)[0]{
              _id,
              title,
              content,
              backgroundColor,
              textColor
            }
          `),
        ]);

        // Apply regional pricing to products
        const applyRegionalPricing = (products) => {
          return products.map(product => {
            if (product.sizes && Array.isArray(product.sizes)) {
              // For pneus with sizes
              return {
                ...product,
                sizes: product.sizes.map(size => ({
                  ...size,
                  price: userRegion === 'Sud France' ? (size.sudPrice || size.price) : (size.nordPrice || size.price)
                }))
              };
            } else {
              // For jentes and mixtes
              return {
                ...product,
                price: userRegion === 'Sud France' ? (product.sudPrice || product.price || product.sellingPrice) : (product.nordPrice || product.price || product.sellingPrice)
              };
            }
          });
        };

        setPromotionalProducts({
          pneus: applyRegionalPricing(pneusData),
          jentes: applyRegionalPricing(jentesData),
          mixt: applyRegionalPricing(mixtData),
        });

        // Set dynamic content
        setDynamicContent(contentData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [userRegion]);

  const handleViewAll = (category) => {
    navigate(`/${category}`);
  };

  const renderPromotionalSection = (products, category, title, color) => {
    if (!products || products.length === 0) return null;

    return (
      <Grid item xs={12} md={4} key={category}>
        <Card
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            position: "relative",
            overflow: "visible",
            border: `2px solid ${color}`,
          }}
        >
          <CardContent sx={{ flexGrow: 1 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", color }}>
              {title}
            </Typography>
            <Grid container spacing={2}>
              {products.map((product) => (
                <Grid item xs={12} key={product._id}>
                  {product.isPromotion && product.promotionDiscount && (
                    <Chip
                      label={`-${product.promotionDiscount}%`}
                      color="error"
                      sx={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        zIndex: 1,
                        fontWeight: "bold",
                      }}
                    />
                  )}
                  <PneuCard data={product} productCategory={category} />
                </Grid>
              ))}
            </Grid>
            <Box sx={{ mt: 2, textAlign: "center" }}>
              <Button
                variant="outlined"
                onClick={() => handleViewAll(category)}
                sx={{ borderColor: color, color }}
              >
                Voir Tous les {title}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    );
  };

  const hasPromotionalProducts = 
    promotionalProducts.pneus.length > 0 || 
    promotionalProducts.jentes.length > 0 || 
    promotionalProducts.mixt.length > 0;

  if (!hasPromotionalProducts) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ textAlign: "center", mb: 4 }}>
          Bienvenue chez Fitou Pneu
        </Typography>
        <Typography variant="h6" sx={{ textAlign: "center", mb: 4 }}>
          Aucun produit promotionnel disponible pour le moment.
        </Typography>
        <Grid container spacing={3} justifyContent="center">
          <Grid item>
            <Button variant="contained" onClick={() => navigate("/pneus")}>
              Parcourir les Pneus
            </Button>
          </Grid>
          <Grid item>
            <Button variant="contained" onClick={() => navigate("/jentes")}>
              Parcourir les Jantes
            </Button>
          </Grid>
        
        </Grid>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Hero Section */}
      <Box sx={{ mb: 6, textAlign: "center" }}>
        <Typography variant="h2" sx={{ fontWeight: "bold", mb: 2 }}>
          🎉 Offres Spéciales
        </Typography>
        <Typography variant="h5" sx={{ color: "text.secondary", mb: 4 }}>
          Découvrez nos meilleures offres sur les pneus et les jantes  !
        </Typography>
      </Box>

      {/* Dynamic Content Box */}
      {dynamicContent && (
        <Box sx={{ mb: 6 }}>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              backgroundColor: dynamicContent.backgroundColor || "#f5f5f5",
              color: dynamicContent.textColor || "#333",
              borderRadius: 2,
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              {dynamicContent.title || "Annonce Spéciale"}
            </Typography>
            <Typography variant="body1" sx={{ fontSize: "1.1rem", lineHeight: 1.6 }}>
              {dynamicContent.content || "Aucun contenu disponible"}
            </Typography>
          </Paper>
        </Box>
      )}

      {/* Promotional Products Grid */}
      <Grid container spacing={4}>
        {renderPromotionalSection(promotionalProducts.pneus, "pneus", "Pneus en Promotion", "#1976d2")}
        {renderPromotionalSection(promotionalProducts.jentes, "jentes", "Jantes en Promotion", "#388e3c")}
      </Grid>

      {/* Quick Navigation */}
      <Box sx={{ mt: 6, textAlign: "center" }}>
        <Typography variant="h5" sx={{ mb: 3 }}>
          Parcourir Toutes les Catégories
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          <Grid item>
            <Button 
              variant="contained" 
              size="large"
              onClick={() => navigate("/pneus")}
              sx={{ backgroundColor: "#1976d2" }}
            >
              Pneus
            </Button>
          </Grid>
          <Grid item>
            <Button 
              variant="contained" 
              size="large"
              onClick={() => navigate("/jentes")}
              sx={{ backgroundColor: "#388e3c" }}
            >
              Jantes
            </Button>
          </Grid>
         
        </Grid>
      </Box>
    </Container>
  );
};

export default HomePage; 