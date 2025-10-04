import { Card, Typography, Box, IconButton, Tooltip, Stack, TextField, Chip, useTheme, useMediaQuery } from "@mui/material";
import React, { useState } from "react";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../store/slice/CartContext";
import { getRegionalPrice } from "../../utils/myUtils";

function PneuCard({ data, productCategory, showSizes = false }) {
  const [showMessage, setShowMessage] = useState(false);
  const [quantity, setQuantity] = useState('1');
  const navigate = useNavigate();
  const { isAuthenticated, openLoginModal, user } = useAuth(); // Added user
  const { addToCart } = useCart();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Get user region, default to Nord France
  const userRegion = user?.region || 'Nord France';

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      openLoginModal();
    } else {
      for (let i = 0; i < quantity; i++) {
        addToCart({
          id: data._id,
          name: data.name,
          price: getRegionalPrice(data, userRegion)
        });
      }
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 1500); // hide after 1.5s
      setQuantity('');
    }
  };
  const handleProductClick = (productId) => {
    navigate(`/${productCategory}/details/${productId}`);
  };
  const productImage = data?.images?.[0]?.path
    ? data.images[0].path
    : "/pneus.jpeg";

  return (
    <Card
      sx={{
        width: { xs: '100%', sm: 280, md: 260 },
        height: { xs: 'auto', sm: 400, md: 380 },
        minHeight: { xs: 350, sm: 400, md: 380 },
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: { xs: 1.5, md: 2 },
        borderRadius: 4,
        boxShadow: 4,
        backgroundColor: "#fff",
        position: "relative",
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 8,
        },
      }}
    >
      {/* Promotion Badge */}
      {data.isPromotion && data.promotionDiscount && (
        <Chip
          label={`-${data.promotionDiscount}%`}
          color="error"
          size={isMobile ? "small" : "medium"}
          sx={{
            position: "absolute",
            top: -10,
            right: -10,
            zIndex: 1,
            fontWeight: "bold",
          }}
        />
      )}

      {/* Image */}
      <Box
        sx={{
          width: "100%",
          paddingTop: "70%",
          position: "relative",
          borderRadius: 2,
          overflow: "hidden",
          mb: { xs: 1.5, md: 2 },
        }}
      >
        <img
          src={productImage}
          alt={data.name || "Produit"}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </Box>

      {/* Product Info */}
      <Box sx={{ textAlign: "center", px: { xs: 0.5, md: 1 }, cursor: "pointer" }} onClick={() => handleProductClick(data._id)}>
        <Typography 
          variant={isMobile ? "body2" : "body1"} 
          fontWeight={700} 
          noWrap 
          gutterBottom
          sx={{ fontSize: { xs: '0.9rem', md: '1rem' } }}
        >
          {data.name}
        </Typography>
        
        {/* Display sizes for all tire products */}
        {productCategory === "pneus" && (
          <Box sx={{ mb: 1 }}>
            {data.sizes && data.sizes.length > 1 ? (
              <>
                <Typography 
                  variant={isMobile ? "caption" : "body2"} 
                  fontWeight={600} 
                  gutterBottom
                  sx={{ color: "text.secondary", display: "block", textAlign: "center" }}
                >
                  Tailles disponibles:
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, justifyContent: "center" }}>
                  {data.sizes.slice(0, showSizes ? 5 : 3).map((size, index) => (
                    <Chip
                      key={index}
                      label={size.size}
                      size="small"
                      sx={{
                        fontSize: isMobile ? "0.7rem" : "0.75rem",
                        height: isMobile ? 20 : 24,
                        backgroundColor: size.stock > 0 ? "#e8f5e8" : "#f5f5f5",
                        color: size.stock > 0 ? "#2e7d32" : "#757575",
                      }}
                    />
                  ))}
                  {data.sizes.length > (showSizes ? 5 : 3) && (
                    <Chip
                      label={`+${data.sizes.length - (showSizes ? 5 : 3)}`}
                      size="small"
                      sx={{
                        fontSize: isMobile ? "0.7rem" : "0.75rem",
                        height: isMobile ? 20 : 24,
                        backgroundColor: "#e3f2fd",
                        color: "#1976d2",
                      }}
                    />
                  )}
                </Box>
              </>
            ) : (data.sizes && data.sizes.length === 1) ? (
              // Single size from sizes array
              <Typography 
                variant={isMobile ? "caption" : "body2"} 
                color="text.secondary" 
                fontWeight={600} 
                gutterBottom
                sx={{ textAlign: "center" }}
              >
                {data.sizes[0].size}
              </Typography>
            ) : data.size ? (
              // Single size product
              <Typography 
                variant={isMobile ? "caption" : "body2"} 
                color="text.secondary" 
                fontWeight={600} 
                gutterBottom
                sx={{ textAlign: "center" }}
              >
                {data.size}
              </Typography>
            ) : (
              // No size information
              <Typography 
                variant={isMobile ? "caption" : "body2"} 
                fontWeight={600} 
                gutterBottom
                sx={{ color: "text.secondary", fontStyle: "italic", textAlign: "center", cursor: "pointer" }}
                onClick={() => handleProductClick(data._id)}
              >
                Cliquez pour voir les tailles
              </Typography>
            )}
          </Box>
        )}
        
        {/* Display single size for non-tire products only */}
        {productCategory !== "pneus" && data.size && (
          <Typography 
            variant={isMobile ? "caption" : "body2"} 
            color="text.secondary" 
            fontWeight={600} 
            noWrap 
            gutterBottom
            sx={{ textAlign: "center" }}
          >
            {data.size}
          </Typography>
        )}
        <Typography 
          variant={isMobile ? "h6" : "h5"} 
          color="primary" 
          fontWeight={700}
          sx={{ fontSize: { xs: '1.1rem', md: '1.25rem' } }}
        >
          {getRegionalPrice(data, userRegion)} €
        </Typography>
      </Box>

      {/* Add to Cart Section */}
      <Box sx={{ mt: "auto", pt: { xs: 1, md: 2 } }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <TextField
            type="number"
            size={isMobile ? "small" : "medium"}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Qté"
            inputProps={{ 
              min: 1, 
              style: { 
                width: isMobile ? 40 : 50, 
                textAlign: 'center',
                fontSize: { xs: '0.8rem', md: '0.875rem' }
              } 
            }}
            sx={{ 
              flex: 1,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              }
            }}
          />
          <Tooltip title="Ajouter au panier">
            <IconButton
              onClick={handleAddToCart}
              color="primary"
              size={isMobile ? "small" : "medium"}
              sx={{
                backgroundColor: 'primary.main',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
              }}
            >
              <ShoppingCartIcon />
            </IconButton>
          </Tooltip>
        </Stack>
        
        {showMessage && (
          <Typography 
            variant={isMobile ? "caption" : "body2"} 
            color="success.main" 
            textAlign="center" 
            sx={{ 
              mt: 1, 
              fontWeight: 500,
              animation: 'fadeIn 0.5s ease-in-out'
            }}
          >
            Ajouté au panier !
          </Typography>
        )}
      </Box>
    </Card>
  );
}

export default PneuCard;
