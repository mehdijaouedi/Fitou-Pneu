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
          size,
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

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={60} thickness={4} />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 3, mb: 4 }}>
        <Alert severity="error" sx={{ borderRadius: 2 }}>Erreur lors du chargement du produit: {error}</Alert>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container sx={{ mt: 3, mb: 4 }}>
        <Alert severity="warning" sx={{ borderRadius: 2 }}>Produit non trouvé.</Alert>
      </Container>
    );
  }

  const imageUrl = FALLBACK_IMAGE_URL;

  const renderSpecifications = () => {
    return (
      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, color: 'text.primary' }}>
          Informations du Produit
        </Typography>
        <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 1.5, overflow: 'hidden' }}>
          <Table size="small">
            <TableBody>
              <TableRow>
                
                <TableCell component="th" scope="row" sx={{ fontWeight: 600, width: '40%', bgcolor: 'grey.50', py: 1 }}>
                  Marque
                </TableCell>
                <TableCell sx={{ py: 1 }}>{product.brand || '-'}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: 'grey.50', py: 1 }}>
                  Modèle
                </TableCell>
                <TableCell sx={{ py: 1 }}>{product.model || '-'}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: 'grey.50', py: 1 }}>
                  Taille
                </TableCell>
                <TableCell sx={{ py: 1 }}>{product.size || '-'}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: 'grey.50', py: 1 }}>
                  LI/SI
                </TableCell>
                <TableCell sx={{ py: 1 }}>{product.liSi || '-'}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: 'grey.50', py: 1 }}>
                  Classe Sonore
                </TableCell>
                <TableCell sx={{ py: 1 }}>{product.soundClass || '-'}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: 'grey.50', py: 1 }}>
                  DB Sonore
                </TableCell>
                <TableCell sx={{ py: 1 }}>{product.soundDb || '-'}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row" sx={{ fontWeight: 600, bgcolor: 'grey.50', py: 1 }}>
                  Promotion
                </TableCell>
                <TableCell sx={{ py: 1 }}>{product.isPromotion ? 'Oui' : 'Non'}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Grid container spacing={1}>
        <Grid item xs={12} md={5}>
          <Box
            component="img"
            src={imageUrl}
            alt={product.name}
            sx={{
              width: '100%',
              height: { xs: 250, sm: 350, md: 'auto' },
              maxHeight: { md: 450 },
              objectFit: 'contain',
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
            <Typography gutterBottom variant="h5" component="h1" sx={{ fontWeight: 700, color: 'text.primary' }}>
              {product.name || 'Produit sans nom'}
            </Typography>

            <Typography variant="h4" color="primary.main" sx={{ my: 1.5, fontWeight: 700 }}>
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
                  size="medium"
                  sx={{ 
                    fontWeight: 600,
                    fontSize: '0.9rem'
                  }}
                />
              </Box>
            )}

            {renderSpecifications()}

            <Box sx={{ pt: 1.5 }}>
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
                <TextField
                  type="number"
                  size="small"
                  value={quantity}
                  inputProps={{ 
                    min: 1, 
                    style: { 
                      width: 50, 
                      textAlign: 'center',
                      fontWeight: 500,
                      fontSize: '0.875rem'
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
                  sx={{ 
                    py: 1, 
                    fontSize: '0.875rem', 
                    textTransform: 'none', 
                    fontWeight: 600, 
                    borderRadius: 1.5,
                    boxShadow: 1,
                    minWidth: 140,
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
    </Container>
  );
}

export default ProductDetails;
