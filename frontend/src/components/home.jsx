import React from "react";
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
import damyData from "../damyData";
import sanityClient from "../../sanity/client"; // Adjust the import based on your project structure
import { useEffect } from "react";
import { selctCategory } from "../../utils/myUtils";

const HomeSection = () => {
  const { productCategory } = useParams();
  // const [searchTerm, setSearchTerm] = React.useState("");
  const [products, setProducts] = React.useState([]);
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
        // alert("Products fetched successfully!");
        console.log("Fetched products:", data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
  
    fetchProducts();
  }, [productCategory]);
  
  console.log("Product Category:", productCategory); // Log the product category
  return (
    <Box sx={{ px: 4, py: 4 }}>
      {/* Content: Left offers + Right filter */}
      <Grid container spacing={4}>
        {/* Offers Card (Left Side) */}
        <Grid item xs={12} md={9}>
          <Card
            sx={{
              height: 220,
              display: "flex",
              justifyContent: "left",
              alignItems: "left",
              borderRadius: 4,
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

        {/* Search Filter (Right Side) */}
        <Grid item xs={12} md={3}>
          <TextField label="Search" variant="outlined" fullWidth />
        </Grid>
      </Grid>

      {/* Spacing between rows */}
      {/* <Box sx={{ mt: 4, ml: 20 }}>
        <Grid container spacing={4} justifyContent="left">
          {[1, 2, 3].map((prodact, index) => (
            <Grid item key={index}>
              <Card
                sx={{
                  width: 220,
                  height: 190,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 2,
                  borderRadius: 4,
                }}
              >
                <img
                  src="https://cdn-img1.pneus-online.com/produit/pneu-auto/250/OVATIONprodactW586.jpg"
                  alt="Product"
                  style={{
                    width: 103,
                    height: 100,
                    objectFit: "cover",
                    marginBottom: 8,
                  }}
                />
                <Typography variant="subtitle1" fontWeight="bold">
                  Product Name
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  $99.99
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box> */}

      <Box sx={{ mt: 4, ml: 20 }}>
        <Grid container spacing={4} justifyContent="center">
          {products?.map((prodact, index) => (
            <Grid item key={index}>
              <PneuCard data={prodact} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default HomeSection;
