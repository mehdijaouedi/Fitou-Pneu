import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
} from "@mui/material";
import { useParams } from "react-router-dom";
import PneuCard from "./PneuCard";
import sanityClient from "../../sanity/client";
import { selctCategory } from "../../utils/myUtils";

const HomeSection = () => {
  const { productCategory } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await sanityClient.fetch(`
          *[_type == "${selctCategory(productCategory)}"]{
            _id,
            name,
            price,
            description,
            dateAdded,
            quantity,
            images[]->{ 
              _id,
              path,
              dbId,
              url
            }
          }
        `);
        setProducts(data);
        console.log('this is the data', data);
        setFilteredProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [productCategory]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredProducts(products);
    } else {
      const lowercasedSearchTerm = searchTerm.toLowerCase();
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(lowercasedSearchTerm)
      );
      setFilteredProducts(filtered);
    }
  }, [searchTerm, products]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <Box sx={{ px: 4, py: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={9}>
          <Card
            sx={{
              height: 220,
              display: "flex",
              alignItems: "center",
              borderRadius: 4,
              paddingLeft: 4,
            }}
          >
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                Our Offers
              </Typography>
              <Typography variant="body1">
                Best deals on tyres, rims, and combos!
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <TextField
            label="Search products"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Grid container spacing={4} justifyContent="center">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <Grid item key={product._id}>
                <PneuCard data={product} />
              </Grid>
            ))
          ) : (
            <Typography variant="h6" sx={{ mt: 4 }}>
              No products found.
            </Typography>
          )}
        </Grid>
      </Box>
    </Box>
  );
};

export default HomeSection;
