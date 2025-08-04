import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  IconButton,
  TextField,
  Tooltip,
  CircularProgress,
  Alert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ReplayIcon from '@mui/icons-material/Replay';
import CloseIcon from '@mui/icons-material/Close';
import { useCart } from '../store/slice/CartContext.jsx';
import { useAuth } from '../context/AuthContext';
import sanityClient from '../../sanity/client';

function OrderHistory() {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editProducts, setEditProducts] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      setError(null);
      try {
        // Fetch sales from Sanity with product dereferencing
        const query = `*[_type == "sale" && clientEmail == $email]{
          _id,
          date,
          status,
          grandTotal,
          client->{
            name
          },
          products[] {
            quantity,
            price,
            totalPrice,
            productType,
            product-> {
              _id,
              name
            }
          }
        } | order(date desc)`;
        const data = await sanityClient.fetch(query, { email: user.email });
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    if (user) fetchOrders();
  }, [user]);

  const handleOpenOrder = (order) => {
    setSelectedOrder(order);
    setEditProducts(order.products.map(p => ({ ...p })));
    setEditMode(false);
  };

  const handleEdit = () => setEditMode(true);
  const handleCancelEdit = () => setEditMode(false);

  const handleProductChange = (idx, field, value) => {
    setEditProducts(prev => prev.map((p, i) => i === idx ? { ...p, [field]: value } : p));
  };

  const handleRemoveProduct = (idx) => {
    setEditProducts(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSaveToCart = () => {
    // Add all edited products to cart
    editProducts.forEach(p => {
      addToCart({
        id: p.product,
        name: p.productType,
        price: p.price,
        quantity: p.quantity,
        type: p.productType
      });
    });
    setSelectedOrder(null);
  };
  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', mt: 6, p: 2 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
        My Order History
      </Typography>
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      {!loading && orders.length === 0 && (
        <Alert severity="info">No orders found.</Alert>
      )}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {orders.map(order => (
          <Card
            key={order.id}
            sx={{ minWidth: 320, flex: '1 1 350px', cursor: 'pointer', transition: '0.2s', '&:hover': { boxShadow: 6, transform: 'scale(1.02)' } }}
            onClick={() => handleOpenOrder(order)}
          >
            <CardContent>
              <Typography variant="subtitle2" sx={{ mb: 0.5, color: 'text.secondary' }}>
                Client: {order.client?.name || order.clientEmail}
              </Typography>
              <Typography variant="h6" sx={{ mb: 1, color: 'primary.main' }}>
                {new Date(order.date).toLocaleDateString()} — <b>{order.status}</b>
              </Typography>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Grand Total: <b>€{typeof order.grandTotal === 'number' ? order.grandTotal.toFixed(2) : 'N/A'}</b>
              </Typography>
              <Divider sx={{ my: 1 }} />
              <List dense>
                {order.products.map((p, idx) => (
                  <ListItem key={idx} sx={{ py: 0.5 }}>
                    <ListItemText
                      primary={<b>{p.product?.name || p.productType || 'Unknown Product'}</b>}
                      secondary={`Qty: ${p.quantity} × €${p.price ?? 'N/A'} = €${
                        typeof p.price === 'number' && typeof p.quantity === 'number'
                          ? (p.price * p.quantity).toFixed(2)
                          : 'N/A'
                      }`}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
            <CardActions>
              <Button size="small" startIcon={<EditIcon />} onClick={e => { e.stopPropagation(); handleOpenOrder(order); }}>Edit &amp; Reuse</Button>
            </CardActions>
          </Card>
        ))}
      </Box>
      <Dialog open={!!selectedOrder} onClose={() => setSelectedOrder(null)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          Edit Order
          <IconButton onClick={() => setSelectedOrder(null)}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Date: {new Date(selectedOrder.date).toLocaleDateString()}<br />
                Status: {selectedOrder.status}<br />
                Grand Total: <b>€{typeof selectedOrder.grandTotal === 'number' ? selectedOrder.grandTotal.toFixed(2) : 'N/A'}</b>
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <List>
                {editProducts.map((p, idx) => (
                  <ListItem key={idx} secondaryAction={editMode && (
                    <Tooltip title="Remove">
                      <IconButton edge="end" color="error" onClick={() => handleRemoveProduct(idx)}>
                        <CloseIcon />
                      </IconButton>
                    </Tooltip>
                  )}>
                    <ListItemText
                      primary={p.product?.name || p.productType || 'Unknown Product'}
                      secondary={
                        editMode ? (
                          <>
                            <TextField
                              label="Qty"
                              type="number"
                              size="small"
                              value={p.quantity}
                              onChange={e => handleProductChange(idx, 'quantity', parseInt(e.target.value, 10))}
                              sx={{ width: 80, mr: 2 }}
                              inputProps={{ min: 1 }}
                            />
                            <TextField
                              label="Price"
                              type="number"
                              size="small"
                              value={p.price}
                              onChange={e => handleProductChange(idx, 'price', parseFloat(e.target.value))}
                              sx={{ width: 100 }}
                              inputProps={{ min: 0 }}
                            />
                          </>
                        ) : (
                          `Qty: ${p.quantity} × €${p.price ?? 'N/A'} = €${
                            typeof p.price === 'number' && typeof p.quantity === 'number'
                              ? (p.price * p.quantity).toFixed(2)
                              : 'N/A'
                          }`
                        )
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </>
          )}
        </DialogContent>
        <DialogActions>
          {!editMode ? (
            <>
              <Button startIcon={<EditIcon />} onClick={handleEdit}>Edit</Button>
              <Button startIcon={<ReplayIcon />} variant="contained" color="primary" onClick={handleSaveToCart}>
                Add to Cart
              </Button>
            </>
          ) : (
            <>
              <Button onClick={handleCancelEdit}>Cancel</Button>
              <Button variant="contained" color="primary" onClick={handleSaveToCart}>
                Save &amp; Add to Cart
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default OrderHistory; 