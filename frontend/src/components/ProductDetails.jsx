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
  Button,
  Chip,
  TextField,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { selctCategory } from '../../utils/myUtils';
import sanityClient from '../../sanity/client';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../store/slice/CartContext';
import { getRegionalPrice, getRegionalPriceForSize } from '../../utils/myUtils';

const FALLBACK_IMAGE_URL = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjmvwItjeJ4l4wDoieU_TTjdoYuhTr5FBpJA&s";

function ProductDetails() {
  const { productCategory, productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMessage, setShowMessage] = useState(false);
  const { isAuthenticated, openLoginModal, user } = useAuth();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Get user region, default to Nord France
  const userRegion = user?.region || 'Nord France';

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      openLoginModal();
      return;
    }

    const itemToAdd = {
      id: product._id,
      name: product.name,
      price: product.sellPrice,
      type: 'pneu',
      size: product.size
    };

    for (let i = 0; i < quantity; i++) {
      addToCart(itemToAdd);
    }
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 1500);
  };

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const query = `*[_type == "pneu" && _id == "${productId}"][0]{
          _id,
          name,
          brand,
          model,
          "size": size->title,
          liSi,
          soundClass,
          soundDb,
          sellPrice,
          isPromotion
        }`;

        const productData = await sanityClient.fetch(query);
        
        setProduct(productData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching product details:", err);
        setError(err.message || 'Failed to fetch product details.');
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  const renderSpecifications = () => {
    if (!product) return null;

    const specs = [
      { label: 'Marque', value: product.brand },
      { label: 'Modèle', value: product.model },
      { label: 'Taille', value: product.size },
      { label: 'Indice de Charge', value: product.liSi },
      { label: 'Classe Sonore', value: product.soundClass },
      { label: 'Niveau Sonore (dB)', value: product.soundDb },
    ].filter(spec => spec.value);

    if (specs.length === 0) return null;

    return (
      <Box sx={{ my: 2 }}>
        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, color: 'text.primary' }}>
          Spécifications
        </Typography>
        <TableContainer component={Paper} sx={{ mt: 1, maxHeight: 300 }}>
          <Table size={isMobile ? "small" : "medium"}>
            <TableBody>
              {specs.map((spec, index) => (
                <TableRow key={index} sx={{ '&:nth-of-type(odd)': { backgroundColor: 'action.hover' } }}>
                  <TableCell sx={{ fontWeight: 600, width: '40%' }}>{spec.label}</TableCell>
                  <TableCell>{spec.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <CircularProgress size={isMobile ? 40 : 60} />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
        <Alert severity="warning">
          Produit non trouvé
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
      <Card sx={{ 
        overflow: 'hidden',
        boxShadow: 3,
        borderRadius: 3,
        '&:hover': {
          boxShadow: 6,
        },
        transition: 'box-shadow 0.3s ease-in-out'
      }}>
        <Grid container>
          <Grid item xs={12} md={5}>
            <CardMedia
              component="img"
              image={FALLBACK_IMAGE_URL}
              alt={product.name || 'Image du produit'}
              sx={{
                height: { xs: 200, sm: 300, md: 400 },
                width: '100%',
                objectFit: 'cover',
                p: { xs: 1, md: 2 },
                borderRadius: 2,
                transition: 'transform 0.3s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.05)',
                },
              }}
            />
          </Grid>
          <Grid item xs={12} md={7}>
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', p: { xs: 1.5, md: 3 } }}>
              <Typography 
                gutterBottom 
                variant={isMobile ? "h6" : "h5"} 
                component="h1" 
                sx={{ fontWeight: 700, color: 'text.primary' }}
              >
                {product.name || 'Produit sans nom'}
              </Typography>

              <Typography 
                variant={isMobile ? "h5" : "h4"} 
                color="primary.main" 
                sx={{ my: 1.5, fontWeight: 700 }}
              >
                {product.sellPrice ? `${product.sellPrice.toFixed(2)} €` : 'Prix non disponible'}
              </Typography>

              {product.size && (
                <Box sx={{ my: 1.5 }}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, color: 'text.primary' }}>
                    Taille
                  </Typography>
                  <Chip
                    label={product.size}
                    color="primary"
                    variant="filled"
                    size={isMobile ? "small" : "medium"}
                    sx={{ 
                      fontWeight: 600,
                      fontSize: { xs: '0.8rem', md: '0.9rem' }
                    }}
                  />
                </Box>
              )}

              {renderSpecifications()}

              <Box sx={{ pt: 1.5 }}>
                <Stack 
                  direction={isMobile ? "column" : "row"} 
                  alignItems="center" 
                  spacing={1.5} 
                  sx={{ mb: 1.5 }}
                >
                  <TextField
                    type="number"
                    size={isMobile ? "small" : "medium"}
                    value={quantity}
                    inputProps={{ 
                      min: 1, 
                      style: { 
                        width: isMobile ? 40 : 50, 
                        textAlign: 'center',
                        fontWeight: 500,
                        fontSize: { xs: '0.8rem', md: '0.875rem' }
                      } 
                    }}
                    onChange={e => {
                      let val = parseInt(e.target.value, 10);
                      if (isNaN(val) || val < 1) val = 1;
                      setQuantity(val);
                    }}
                    sx={{ 
                      background: '#fff', 
                      borderRadius: 1,
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: 'primary.main',
                        },
                      },
                    }}
                    label="Qté"
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<ShoppingCartIcon />}
                    onClick={handleAddToCart}
                    disabled={!product}
                    size={isMobile ? "small" : "medium"}
                    sx={{ 
                      py: 1, 
                      fontSize: { xs: '0.8rem', md: '0.875rem' }, 
                      textTransform: 'none', 
                      fontWeight: 600, 
                      borderRadius: 1.5,
                      boxShadow: 1,
                      minWidth: { xs: 120, md: 140 },
                      '&:hover': {
                        boxShadow: 2,
                      }
                    }}
                  >
                    Ajouter au Panier
                  </Button>
                </Stack>
                {showMessage && (
                  <Typography 
                    variant="body2" 
                    color="success.main" 
                    textAlign="center" 
                    sx={{ 
                      mt: 1, 
                      fontWeight: 500,
                      animation: 'fadeIn 0.5s ease-in-out'
                    }}
                  >
                    Ajouté au panier avec succès !
                  </Typography>
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Card>
    </Container>
  );
}

export default ProductDetails;
