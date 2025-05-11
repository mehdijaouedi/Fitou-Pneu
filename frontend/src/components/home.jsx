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
import sanityClient from "../../sanity/client";
import { selctCategory } from "../../utils/myUtils";

const HomeSection = () => {
  const { productCategory } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState([]);
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
        setProducts(data);
        console.log("Fetched products: ", data);
        setFilteredProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [productCategory]);

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
              No products found.
            </Typography>
          )}
        </Grid>
      </Box>
    </Box>
  );
};

export default HomeSection;
