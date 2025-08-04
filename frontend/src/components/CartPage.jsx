import { useCart } from '../store/slice/CartContext.jsx';
import { useAuth } from '../context/AuthContext';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Button,
  Divider,
  Paper,
  Tooltip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  CircularProgress
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PaymentIcon from '@mui/icons-material/Payment';
import React from 'react';

// Payment information - could be moved to a config file
const PAYMENT_INFO = {
  bank: 'crédit agricole',
  accountName: 'FitPneus',
  iban: 'FR76 1910 6006 7744 7161 5680 719',
  bic: 'AGRIFRPP891',
  phone: '+0033 759368879',
  email: 'contact@fitPneus.com'
};

function CartPage() {
  const { cartItems, removeFromCart, clearCart, increaseQuantity, decreaseQuantity } = useCart();
  const { user } = useAuth();
  const [openDialog, setOpenDialog] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [success, setSuccess] = React.useState(false);

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
  };

  const handleSubmit = async () => {
    if (!user) {
      setError('Veuillez vous connecter pour finaliser votre achat');
      return;
    }

    if (cartItems.length === 0) {
      setError('Votre panier est vide');
      return;
    }

    setLoading(true);
    setError(null);

    const order = {
      clientEmail: user.email,
      products: cartItems.map(item => ({
        productType: item.type,
        product: item.id,
        quantity: item.quantity,
        price: item.price,
        totalPrice: item.price * item.quantity
      })),
      grandTotal: calculateTotal(),
      status: 'pending',
      date: new Date().toISOString()
    };

    try {
      // First create the sale in the database
      const dbResponse = await fetch('http://localhost:3001/api/v1/sales', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          saleType: cartItems[0]?.type || 'mixte',
          products: order.products,
          grandTotal: order.grandTotal,
          clientEmail: user.email,
          utilisateurId: user.id
        })
      });

      if (!dbResponse.ok) {
        const errorData = await dbResponse.json();
        throw new Error(errorData.error || 'Échec de la création de la vente dans la base de données');
      }

      const dbSale = await dbResponse.json();

      // Then sync to Sanity
      const sanityResponse = await fetch('http://localhost:3001/api/v1/sync/sale', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...order,
          dbId: dbSale.id
        })
      });

      if (!sanityResponse.ok) {
        const errorData = await sanityResponse.json();
        throw new Error(errorData.error || 'Échec de la synchronisation de la vente vers Sanity');
      }

      clearCart(); // Clear cart immediately after successful order
      setSuccess(true);
      setOpenDialog(true);
    } catch (err) {
      console.error('Error processing order:', err);
      if (err.message === 'Failed to fetch') {
        setError('Impossible de se connecter au serveur. Veuillez vérifier votre connexion internet et réessayer.');
      } else if (err.message.includes('401')) {
        setError('Votre session a expiré. Veuillez vous reconnecter.');
      } else if (err.message.includes('403')) {
        setError('Vous n\'avez pas la permission d\'effectuer cette action.');
      } else {
        setError(err.message || 'Une erreur inattendue s\'est produite. Veuillez réessayer plus tard.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    window.location.href = '/'; // Redirect to home page
  };

  // Calculate total only if there are items in cart
  const total = calculateTotal();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%)',
        py: 6,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          maxWidth: 600,
          mx: 'auto',
          p: 4,
          borderRadius: 5,
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.12)',
          background: 'rgba(255,255,255,0.95)',
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ color: 'black', fontWeight: 'bold', mb: 2, letterSpacing: 1 }}>
          🛒 Votre Panier d'Achat
        </Typography>
        <Divider sx={{ mb: 3 }} />

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Commande passée avec succès ! Veuillez suivre les instructions de paiement.
          </Alert>
        )}

        {(!cartItems?.length || success) ? (
          <Box sx={{ p: 4, textAlign: 'center', background: 'linear-gradient(90deg, #f0f4f8 60%, #e0e7ef 100%)', borderRadius: 3, boxShadow: 2 }}>
            <Typography variant="h6" sx={{ color: 'black', mb: 1, fontWeight: 600 }}>
              {success ? 'Merci pour votre commande !' : 'Votre panier est vide.'}
            </Typography>
            <Typography variant="body1" sx={{ color: 'gray', mb: 2 }}>
              {success 
                ? 'Votre commande a été passée avec succès. Veuillez vérifier votre email pour les détails de la commande.'
                : 'Parcourez nos produits et ajoutez des articles à votre panier pour les voir ici.'}
            </Typography>
            <img 
              src={success 
                ? "https://cdn-icons-png.flaticon.com/512/190/190411.png" 
                : "https://cdn-icons-png.flaticon.com/512/2038/2038854.png"} 
              alt={success ? "Succès" : "Panier vide"} 
              width={80} 
              style={{ opacity: 0.7 }} 
            />
          </Box>
        ) : (
          <>
            <Typography variant="h6" sx={{ color: 'black', mb: 2, fontWeight: 600, letterSpacing: 0.5 }}>
              Articles du Panier
            </Typography>
            <List>
              {cartItems?.map((item) => (
                <ListItem
                  key={item.id}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: 'center',
                    mb: 1,
                    background: 'linear-gradient(90deg, #f5f7fa 60%, #e0e7ef 100%)',
                    borderRadius: 3,
                    boxShadow: 1,
                    transition: 'transform 0.15s',
                    '&:hover': {
                      transform: 'scale(1.025)',
                      boxShadow: '0 4px 16px 0 rgba(31,38,135,0.10)',
                    },
                  }}
                >
                  <ListItemText
                    primary={<span style={{ color: 'black', fontWeight: 600 }}>{item.name} <span style={{ color: '#888', fontWeight: 400 }}>(x{item.quantity})</span></span>}
                    secondary={<span style={{ color: 'black' }}>Prix unitaire: <b>{item.price} €</b> — Total: <b>{item.price * item.quantity} €</b></span>}
                    primaryTypographyProps={{ style: { color: 'black' } }}
                    secondaryTypographyProps={{ style: { color: 'black' } }}
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2 }}>
                    <TextField
                      type="number"
                      size="small"
                      value={item.quantity}
                      inputProps={{ min: 1, style: { width: 60, textAlign: 'center' } }}
                      onChange={e => {
                        let val = parseInt(e.target.value, 10);
                        if (isNaN(val) || val < 1) val = 1;
                        increaseQuantity(item.id, val - item.quantity);
                      }}
                      sx={{ mr: 1, background: '#fff', borderRadius: 1 }}
                      label="Qté"
                    />
                    <Tooltip title="Diminuer de 1">
                      <IconButton onClick={() => decreaseQuantity(item.id)} size="small" color="primary">
                        <RemoveIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Augmenter de 1">
                      <IconButton onClick={() => increaseQuantity(item.id, 1)} size="small" color="primary">
                        <AddIcon />
                      </IconButton>
                    </Tooltip>
                    
                    <Tooltip title="Retirer du panier">
                      <IconButton onClick={() => removeFromCart(item.id)} size="small" color="error">
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </ListItem>
              ))}
            </List>
            <Divider sx={{ my: 3 }} />
            <Paper
              elevation={0}
              sx={{
                p: 3,
                background: 'linear-gradient(90deg, #e0e7ef 60%, #f0f4f8 100%)',
                textAlign: 'center',
                borderRadius: 3,
                boxShadow: 0,
              }}
            >
              <Typography variant="h6" sx={{ color: 'black', fontWeight: 'bold', letterSpacing: 0.5 }}>
                Résumé du Panier
              </Typography>
              <Typography variant="body1" sx={{ color: 'black', mt: 1, fontSize: '1.2rem' }}>
                Total: <b>{total} €</b>
              </Typography>
              <Button
                variant="contained"
                color="primary"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <PaymentIcon />}
                sx={{ 
                  mt: 2, 
                  fontWeight: 'bold', 
                  letterSpacing: 1, 
                  borderRadius: 2, 
                  px: 4, 
                  py: 1.2, 
                  fontSize: '1.1rem', 
                  boxShadow: '0 2px 8px 0 rgba(31,38,135,0.10)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px 0 rgba(31,38,135,0.15)',
                  },
                  transition: 'all 0.2s ease-in-out'
                }}
                onClick={handleSubmit}
              >
                {loading ? 'Traitement...' : 'Valider la Commande'}
              </Button>
            </Paper>
          </>
        )}
      </Paper>

      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ 
          bgcolor: 'primary.main', 
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <PaymentIcon /> Instructions de Paiement
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
            Total de la Commande: {total} €
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Pour finaliser votre commande, veuillez suivre ces étapes :
          </Typography>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
              1. Détails du Virement Bancaire :
            </Typography>
            <Paper sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
                Banque: {PAYMENT_INFO.bank}<br />
                Nom du Compte: {PAYMENT_INFO.accountName}<br />
                IBAN: {PAYMENT_INFO.iban}<br />
                BIC: {PAYMENT_INFO.bic}
              </Typography>
            </Paper>
          </Box>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
              2. Informations de Contact :
            </Typography>
            <Paper sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="body1">
                Téléphone: {PAYMENT_INFO.phone}<br />
                Email: {PAYMENT_INFO.email}
              </Typography>
            </Paper>
          </Box>
          <Alert severity="info" sx={{ mt: 2 }}>
            Après avoir effectué le paiement, veuillez nous appeler pour confirmer votre commande. Votre commande sera traitée dans les 24 heures.
          </Alert>
        </DialogContent>
        <DialogActions sx={{ p: 2, bgcolor: '#f5f5f5' }}>
          <Button onClick={handleCloseDialog} variant="contained" color="primary">
            Fermer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default CartPage;
