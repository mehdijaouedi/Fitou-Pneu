import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Card,
  CardMedia,
  CardContent,
  Grid,
  Tooltip,
  IconButton,
  Stack,
  Button, // Added
  Chip,   // Added
} from '@mui/material';
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'; // Optional: for stock chip
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'; // Optional: for stock chip
import { selctCategory } from '../../utils/myUtils';
import sanityClient from '../../sanity/client'; // Import sanityClient
import { useAuth } from '../context/AuthContext'; // Added

const FALLBACK_IMAGE_URL = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjmvwItjeJ4l4wDoieU_TTjdoYuhTr5FBpJA&s";

function ProductDetails() {
  const { productCategory, productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMessage, setShowMessage] = useState(false);
  const { isAuthenticated, openLoginModal } = useAuth(); // Added

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      openLoginModal();
    } else {
      // Proceed with adding to cart logic
      // This is where you'd typically dispatch an action to your cart context/store
      console.log("User is authenticated. Adding to cart:", product.name);
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 1500); // hide after 1.5s
    }
  };

  useEffect(() => {
    const fetchProductDetails = async () => {
      // Ensure we only set loading and clear error if component is still mounted
      try {
        const productData = await sanityClient.fetch(`
           *[_type == "${selctCategory(productCategory)}" && _id == "${productId}"][0]{
            _id,
            name,
            price,
            description,
            dateAdded,
            quantity,
            type,
            season,
            images[]->{ 
              _id,
              path,
              dbId,
              url
            }
          }
        `);
          console.log("Fetched product details: ", productData);
        setProduct(productData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching product details:", err);
        setError(err.message || 'Failed to fetch product details.');
        setLoading(false);
      }
    };

      fetchProductDetails();
    

    }, [productCategory, productId]);

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">Error fetching product details: {error}</Alert>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="warning">Product not found.</Alert>
      </Container>
    );
  }

  const {
    name,
    description,
    price,
    type,
    season,
    images,
    quantity,
  } = product;

  // Handle image display, assuming the first image is the primary one
  const imageUrl = images && images?.[0]?.path
  ? images[0].path : FALLBACK_IMAGE_URL; // Corrected: use images[0].path (from destructured product)

  return (
    <Container sx={{ py: 4 }}>
      <Card sx={{ display: 'flex', overflow: 'hidden', borderRadius: 3, boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.07)" }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <CardMedia
              component="img"
              image={imageUrl}
              alt={name}
              sx={{
                width: '100%',
                height: { xs: 300, sm: 400, md: 'auto' },
                maxHeight: { md: 550 },
                objectFit: 'contain',
                p: { xs: 1, md: 2 },
                borderRadius: 9,
                // boxShadow: 3,
                transition: 'transform 0.3s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.05)',
                },
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%', p: { xs: 2, md: 4 } }}>
              <Typography gutterBottom variant="h4" component="h1" fontWeight="bold">
                {name}
              </Typography>

              <Typography variant="h3" color="primary.main" fontWeight="bold" sx={{ my: 2 }}>
                {price ? `${price.toFixed(2)} €` : 'Price not available'}
              </Typography>

              <Typography variant="body1" color="text.secondary" paragraph sx={{ flexGrow: 1, my: 2, lineHeight: 1.7 }}>
                {description || 'No detailed description available.'}
              </Typography>

              {/* Specifications Section */}
              <Box sx={{ my: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'medium' }}>
                  Specifications
                </Typography>
                <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mb: 1 }}>
                  <Chip label={`Category: ${productCategory}`} variant="outlined" />
                  {type && <Chip label={`Type: ${type}`} variant="outlined" />}
                  {season && <Chip label={`Season: ${season}`} variant="outlined" />}
                </Stack>
                <Chip
                  label={quantity > 0 ? `In Stock: ${quantity}` : "Out of Stock"}
                  color={quantity > 0 ? "success" : "error"}
                  icon={quantity > 0 ? <CheckCircleOutlineIcon fontSize="small" /> : <ErrorOutlineIcon fontSize="small" />}
                  sx={{ fontWeight: 'medium', mt: 1 }}
                />
              </Box>

              {/* Add to Cart Section */}
              <Box sx={{ mt: 'auto', pt: 'auto', mb:5 }}> {/* mt: 'auto' pushes this to the bottom */}
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<ShoppingCartIcon />}
                  onClick={handleAddToCart}
                  disabled={!product || quantity === 0} // Disable if product not loaded or out of stock
                  fullWidth
                  sx={{ py: 1.5, fontSize: '1rem', textTransform: 'none', fontWeight: 'bold', borderRadius: 2 }}
                >
                  Add to Cart
                </Button>
                {showMessage && (
                  <Typography variant="body2" color="success.main" textAlign="center" sx={{ mt: 1.5, fontWeight: 'medium' }}>
                    Added to cart successfully!
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Grid>
        </Grid>
      </Card>
    </Container>
  );
}

export default ProductDetails;
