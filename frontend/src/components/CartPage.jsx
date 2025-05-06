import { useCart } from '../store/slice/CartContext.jsx';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Button
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

function CartPage() {
  const { cart, addToCart, removeFromCart, decreaseQuantity } = useCart();

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Your Cart
      </Typography>

      {cart?.length === 0 ? (
        <Typography>No items in cart.</Typography>
      ) : (
        <List>
          {cart?.map((item, index) => (
            <ListItem key={index} sx={{ display: "flex", justifyContent: "space-between" }}>
              <ListItemText
                primary={`${item.name} (x${item.quantity})`}
                secondary={`Unit price: ${item.price} € — Total: ${item.price * item.quantity} €`}
              />
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <IconButton onClick={() => decreaseQuantity(item.id)}><RemoveIcon /></IconButton>
                <IconButton onClick={() => addToCart(item)}><AddIcon /></IconButton>
                <IconButton onClick={() => removeFromCart(item.id)}><DeleteIcon /></IconButton>
              </Box>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
}

export default CartPage;
