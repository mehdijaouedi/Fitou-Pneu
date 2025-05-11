import { Card, Typography, Box, IconButton, Tooltip, Stack } from "@mui/material";
import React, { useState } from "react";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function PneuCard({ data, productCategory }) {
  const [showMessage, setShowMessage] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, openLoginModal } = useAuth(); // Added

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      openLoginModal();
    } else {
      // Proceed with adding to cart logic
      // This is where you'd typically dispatch an action to your cart context/store
      console.log("Added to cart:", data.name);
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 1500); // hide after 1.5s
    }
  };
  const handleProductClick = (productId) => {
    navigate(`/${productCategory}/details/${productId}`);
  };
  const productImage = data?.images?.[0]?.path
    ? data.images[0].path
    : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjmvwItjeJ4l4wDoieU_TTjdoYuhTr5FBpJA&s";

  return (
    <Card
      sx={{
        width: 260,
        height: 380,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 2,
        borderRadius: 4,
        boxShadow: 4,
        backgroundColor: "#fff",
      }}
    >
      {/* Image */}
      <Box
        sx={{
          width: "100%",
          paddingTop: "70%",
          position: "relative",
          borderRadius: 2,
          overflow: "hidden",
          mb: 2,
        }}
      >
        <img
          src={productImage}
          alt={data.name || "Product"}
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
      <Box sx={{ textAlign: "center", px: 1, cursor: "pointer" }} onClick={() => handleProductClick(data._id)}>
        <Typography variant="body2" color="text.secondary" fontWeight={600} noWrap gutterBottom>
        type: {data.type}
        </Typography>
        <Typography variant="body2" color="text.secondary" fontWeight={600} noWrap gutterBottom>
        season: {data.season}
        </Typography>
        <Typography variant="h6" fontWeight={600} noWrap gutterBottom>
          {data.name}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            minHeight: "3em",
          }}
        >
          {data.description}
        </Typography>
      </Box>

      {/* Price + Cart + Message */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 2, px: 1 }}>
        <Typography variant="h6" fontWeight="bold" color="primary">
          {data.price} €
        </Typography>

        {showMessage && (
          <Typography variant="body2" color="success.main" sx={{ fontSize: "0.75rem", mx: 1 }}>
            Added successfully
          </Typography>
        )}

        <Tooltip title="Add to cart">
          <IconButton color="primary" onClick={handleAddToCart}>
            <ShoppingCartIcon />
          </IconButton>
        </Tooltip>
      </Stack>
    </Card>
  );
}

export default PneuCard;
