import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import sanityClient from "../../sanity/client";

const ClientHistorique = () => {
  const { user } = useAuth();
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;

    const fetchSales = async () => {
      try {
        const query = `*[_type == "sale" && clientEmail == $email]{
          _id,
          date,
          status,
          grandTotal,
          products[] {
            quantity,
            unitPrice,
            totalPrice,
            product-> {
              _id,
              title
            }
          }
        } | order(date desc)`;

        const result = await sanityClient.fetch(query, { email: user.email });
        setSales(result);
      } catch (error) {
        console.error("Failed to fetch sales:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, [user?.email]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={6}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      p={4}
      display="flex"
      flexDirection="column"
      alignItems="center"
      textAlign="center"
    >
      <Typography variant="h4" gutterBottom>
        Purchase History
      </Typography>

      {sales.length === 0 ? (
        <Typography>No purchases found.</Typography>
      ) : (
        sales.map((sale) => (
          <Card
            key={sale._id}
            sx={{
              mb: 4,
              border: "1px solid #ddd",
              borderRadius: 2,
              maxWidth: 600,
              width: "100%",
            }}
          >
            <CardContent>
              <Box textAlign="center">
                <Typography variant="h6">
                  Date: {new Date(sale.date).toLocaleDateString()}
                </Typography>
                <Typography>Status: {sale.status}</Typography>
                <Typography>
                  Grand Total: €
                  {sale.grandTotal != null
                    ? sale.grandTotal.toFixed(2)
                    : "N/A"}
                </Typography>
                <Divider sx={{ my: 2 }} />
                {sale.products.map((p, index) => (
                  <Box key={index} mb={1}>
                    <Typography variant="body2">
                      <strong>{p.product?.name || "Unknown Product"}</strong>{" "}
                      – Qty: {p.quantity} × €
                      {p.unitPrice != null
                        ? p.unitPrice.toFixed(2)
                        : "N/A"}{" "}
                      = €
                      {p.totalPrice != null
                        ? p.totalPrice.toFixed(2)
                        : "N/A"}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
};

export default ClientHistorique;
