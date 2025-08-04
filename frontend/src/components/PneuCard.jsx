import { Card, Typography, Box, IconButton, Tooltip, Stack, TextField, Chip } from "@mui/material";
import React, { useState } from "react";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../store/slice/CartContext";
import { getRegionalPrice } from "../../utils/myUtils";

function PneuCard({ data, productCategory }) {
  const [showMessage, setShowMessage] = useState(false);
  const [quantity, setQuantity] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated, openLoginModal, user } = useAuth(); // Added user
  const { addToCart } = useCart();

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
        position: "relative",
      }}
    >
      {/* Promotion Badge */}
      {data.isPromotion && data.promotionDiscount && (
        <Chip
          label={`-${data.promotionDiscount}%`}
          color="error"
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
          mb: 2,
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
      <Box sx={{ textAlign: "center", px: 1, cursor: "pointer" }} onClick={() => handleProductClick(data._id)}>
        <Typography variant="body2" color="text.secondary" fontWeight={600} noWrap gutterBottom>
        Type: {data.type}
        </Typography>
        <Typography variant="body2" color="text.secondary" fontWeight={600} noWrap gutterBottom>
        Saison: {data.season}
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
        <Box>
          {data.isPromotion && data.promotionDiscount ? (
            <Box>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ textDecoration: 'line-through' }}
              >
                {data.price} €
              </Typography>
              <Typography variant="h6" fontWeight="bold" color="error">
                {Math.round(data.price * (1 - data.promotionDiscount / 100))} €
              </Typography>
            </Box>
          ) : (
            <Typography variant="h6" fontWeight="bold" color="primary">
              {data.price} €
            </Typography>
          )}
        </Box>

        <TextField
          type="number"
          size="small"
          value={quantity}
          inputProps={{ min: 1, style: { width: 50, textAlign: 'center' } }}
          onChange={e => {
            let val = parseInt(e.target.value, 10);
            if (isNaN(val) || val < 1) val = 1;
            setQuantity(val);
          }}
          sx={{ mr: 1, background: '#fff', borderRadius: 1 }}
          label="Qté"
        />

        {showMessage && (
          <Typography variant="body2" color="success.main" sx={{ fontSize: "0.75rem", mx: 1 }}>
            Ajouté avec succès
          </Typography>
        )}

        <Tooltip title="Ajouter au panier">
          <IconButton color="primary" onClick={handleAddToCart}>
            <ShoppingCartIcon />
          </IconButton>
        </Tooltip>
      </Stack>
    </Card>
  );
}

export default PneuCard;
