import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import PneuCard from "./PneuCard";
import PromotionalProducts from "./PromotionalProducts";
import sanityClient from "../../sanity/client";
import { selctCategory, getRegionalPrice } from "../../utils/myUtils";
import { useAuth } from "../context/AuthContext";

const HomeSection = () => {
  const { productCategory } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const { user } = useAuth();

  // Get user region, default to Nord France
  const userRegion = user?.region || 'Nord France';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await sanityClient.fetch(`
          *[_type == "${selctCategory(productCategory)}"]{
            _id,
            name,
            price,
            nordPrice,
            sudPrice,
            sellingPrice,
            description,
            dateAdded,
            quantity,
            type,
            season,
            sizes,
            isPromotion,
            promotionDiscount,
            images[]->{ 
              _id,
              path,
              dbId,
              url
            }
          }
        `);
        
        // Apply regional pricing to products
        const productsWithRegionalPricing = data.map(product => {
          if (product.sizes && Array.isArray(product.sizes)) {
            // For pneus with sizes
            return {
              ...product,
              sizes: product.sizes.map(size => ({
                ...size,
                price: userRegion === 'Sud France' ? (size.sudPrice || size.price) : (size.nordPrice || size.price)
              }))
            };
          } else {
            // For jentes and mixtes
            return {
              ...product,
              price: userRegion === 'Sud France' ? (product.sudPrice || product.price || product.sellingPrice) : (product.nordPrice || product.price || product.sellingPrice)
            };
          }
        });
        
        setProducts(productsWithRegionalPricing);
        console.log("Fetched products with regional pricing: ", productsWithRegionalPricing);
        setFilteredProducts(productsWithRegionalPricing);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [productCategory, userRegion]);

  useEffect(() => {
    let filtered = products;

    // Filter by search term
    if (searchTerm.trim() !== "") {
      const lowercasedSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(lowercasedSearchTerm)
      );
    }

    // Filter by type
    if (selectedType.length > 0) {
      filtered = filtered.filter((product) =>
        selectedType.includes(product.type)
      );
    }

    // Filter by season
    if (selectedSeason.length > 0) {
      filtered = filtered.filter((product) =>
        selectedSeason.includes(product.season)
      );
    }

    setFilteredProducts(filtered);
  }, [searchTerm, selectedType, selectedSeason, products]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleTypeChange = (event) => {
    const { value } = event.target;
    setSelectedType((prevState) =>
      prevState.includes(value)
        ? prevState.filter((type) => type !== value)
        : [...prevState, value]
    );
  };

  const handleSeasonChange = (event) => {
    const { value } = event.target;
    setSelectedSeason((prevState) =>
      prevState.includes(value)
        ? prevState.filter((season) => season !== value)
        : [...prevState, value]
    );
  };
  

  return (
    <Box sx={{ px: 4, py: 4 }}>
      {/* Promotional Products Section */}
      <PromotionalProducts />
      
      <Grid container spacing={4} sx={{ mt: 4 }}>
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
                Nos Offres
              </Typography>
              <Typography variant="body1">
                Meilleures offres sur pneus et jantes !
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Search and Filters in a vertical layout */}
        <Grid item xs={12} md={3}>
          <Grid container spacing={3}>
            {/* Search Bar */}
            <Grid item xs={12}>
              <TextField
                label="Search products"
                variant="outlined"
                fullWidth
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </Grid>

            {/* Filters */}
            <Grid item xs={12}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 ,color: "black"}}>
           

                {/* Season Filters */}
                <FormControlLabel
                  control={
                    <Checkbox
                      value="summer"
                      checked={selectedSeason.includes("summer")}
                      onChange={handleSeasonChange}
                      sx={{
                        "&.Mui-checked": {
                          color: "black", // Checkbox color when checked
                        },
                      }}
                    />
                  }
                  label="summer"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      value="winter"
                      checked={selectedSeason.includes("winter")}
                      onChange={handleSeasonChange}
                      sx={{
                        "&.Mui-checked": {
                          color: "black", // Checkbox color when checked
                        },
                      }}
                    />
                  }
                  label="winter"

                />

              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Product List */}
      <Box sx={{ mt: 4 }}>
        <Grid container spacing={4} justifyContent="center">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <Grid
                item
                key={product._id}
                sx={{ cursor: "pointer" }}
              >
                <PneuCard data={product} productCategory={productCategory} />
              </Grid>
            ))
          ) : (
            <Typography variant="h6" sx={{ mt: 4 }}>
              Aucun produit trouvé.
            </Typography>
          )}
        </Grid>
      </Box>
    </Box>
  );
};

export default HomeSection;
