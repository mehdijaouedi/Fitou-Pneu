import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import PneuCard from "./PneuCard";
import sanityClient from "../../sanity/client";
import { useAuth } from "../context/AuthContext";
import { applyRegionalPricingToProducts } from "../../utils/myUtils";

const PromotionalProducts = () => {
  const [promotionalProducts, setPromotionalProducts] = useState({
    pneus: null,
    jentes: null,
  });
  const { user } = useAuth();
  const navigate = useNavigate();

  // Get user region, default to Nord France
  const userRegion = user?.region || 'Nord France';

  useEffect(() => {
    const fetchPromotionalProducts = async () => {
      try {
        // Fetch one promotional product from each category
        const [pneusData, jentesData] = await Promise.all([
          sanityClient.fetch(`
            *[_type == "pneu" && isPromotion == true] | order(dateAdded desc)[0]{
              _id,
              name,
              price,
              sellPriceNord,
              sellPriceSud,
              nordPrice,
              sudPrice,
              sellingPrice,
              description,
              dateAdded,
              quantity,
              type,
              season,
              sizes[]{
                _id,
                size,
                price,
                sellPriceNord,
                sellPriceSud,
                nordPrice,
                sudPrice,
                stock
              },
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
            *[_type == "jente" && isPromotion == true] | order(dateAdded desc)[0]{
              _id,
              name,
              price,
              sellPriceNord,
              sellPriceSud,
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

        ]);

        // Apply regional pricing to products
        setPromotionalProducts({
          pneus: pneusData ? applyRegionalPricingToProducts([pneusData], userRegion)[0] : null,
          jentes: jentesData ? applyRegionalPricingToProducts([jentesData], userRegion)[0] : null,
        });
      } catch (error) {
        console.error("Error fetching promotional products:", error);
      }
    };

    fetchPromotionalProducts();
  }, [userRegion]);

  const handleViewAll = (category) => {
    navigate(`/${category}`);
  };

  const renderPromotionalCard = (product, category, title) => {
    if (!product) return null;

    return (
      <Grid item xs={12} md={4} key={product._id}>
        <Card
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            position: "relative",
            overflow: "visible",
          }}
        >
          {product.isPromotion && product.promotionDiscount && (
            <Chip
              label={`-${product.promotionDiscount}%`}
              color="error"
              sx={{
                position: "absolute",
                top: -10,
                right: 10,
                zIndex: 1,
                fontWeight: "bold",
              }}
            />
          )}
          <CardContent sx={{ flexGrow: 1 }}>
            <Typography variant="h6" gutterBottom>
              {title}
            </Typography>
            <PneuCard data={product} productCategory={category} />
          </CardContent>
        </Card>
      </Grid>
    );
  };

  const hasPromotionalProducts = promotionalProducts.pneus || promotionalProducts.jentes;

  if (!hasPromotionalProducts) {
    return (
      <Box sx={{ px: 4, py: 4, textAlign: "center" }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 3, color: "text.secondary" }}>
          🛍️ Nos Produits
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, color: "text.secondary" }}>
          Découvrez notre sélection de pneus et jantes de qualité
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, flexWrap: "wrap" }}>
          <Button
            variant="contained"
            onClick={() => handleViewAll("pneus")}
            sx={{ minWidth: 150 }}
          >
            Voir les Pneus
          </Button>
          <Button
            variant="contained"
            onClick={() => handleViewAll("jentes")}
            sx={{ minWidth: 150 }}
          >
            Voir les Jantes
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ px: 4, py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 3 }}>
        🎉 Special Offers
      </Typography>
      <Grid container spacing={3}>
        {renderPromotionalCard(promotionalProducts.pneus, "pneus", "Offre Pneus")}
        {renderPromotionalCard(promotionalProducts.jentes, "jentes", "Offre Jantes")}
      </Grid>
      <Box sx={{ mt: 3, textAlign: "center" }}>
        <Button
          variant="outlined"
          onClick={() => handleViewAll("pneus")}
          sx={{ mr: 2 }}
        >
          Voir tous les Pneus
        </Button>
        <Button
          variant="outlined"
          onClick={() => handleViewAll("jentes")}
          sx={{ mr: 2 }}
        >
          Voir toutes les Jantes
        </Button>
      </Box>
    </Box>
  );
};

export default PromotionalProducts; 