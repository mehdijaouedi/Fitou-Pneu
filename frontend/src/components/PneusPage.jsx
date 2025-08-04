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
  Container,
  Chip,
  Button,
  Pagination,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import PneuCard from "./PneuCard";
import sanityClient from "../../sanity/client";
import { useAuth } from "../context/AuthContext";

const PneusPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState([]);
  const [selectedSeasonType, setSelectedSeasonType] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const productsPerPage = 12;
  const { user } = useAuth();
  const navigate = useNavigate();

  // Get user region, default to Nord France
  const userRegion = user?.region || 'Nord France';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await sanityClient.fetch(`
          *[_type == "pneu"]{
            _id,
            name,
            brand,
            model,
            ean,
            sap,
            itemNo,
            size,
            liSi,
            extra,
            pattern,
            eprelCode,
            rr,
            wg,
            soundClass,
            soundDb,
            cat,
            season,
            qty40hc,
            buyPrice,
            sellPrice,
            isPromotion,
            dateAdded,
            lastUpdated,
            excelFile
          }
        `);
        
        // Apply regional pricing to products
        const productsWithRegionalPricing = data.map(product => {
          // Use sellPrice as the main price, with regional variations if available
          const basePrice = product.sellPrice || product.buyPrice || 0;
          
          return {
            ...product,
            price: basePrice,
            nordPrice: basePrice,
            sudPrice: basePrice,
            sellingPrice: basePrice
          };
        });
        
        setProducts(productsWithRegionalPricing);
        setFilteredProducts(productsWithRegionalPricing);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [userRegion]);

  useEffect(() => {
    let filtered = products;

    // Filter by search term
    if (searchTerm.trim() !== "") {
      const lowercasedSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(lowercasedSearchTerm) ||
        (product.size && product.size.toLowerCase().includes(lowercasedSearchTerm)) ||
        (product.soundClass && product.soundClass.toLowerCase().includes(lowercasedSearchTerm))
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

    // Filter by season type (summer/winter/4season)
    if (selectedSeasonType.length > 0) {
      filtered = filtered.filter((product) =>
        selectedSeasonType.includes(product.season)
      );
    }

    setFilteredProducts(filtered);
    setPage(1); // Reset to first page when filters change
  }, [searchTerm, selectedType, selectedSeason, selectedSeasonType, products]);

  // Calculate pagination
  useEffect(() => {
    setTotalPages(Math.ceil(filteredProducts.length / productsPerPage));
  }, [filteredProducts]);

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

  const handleSeasonTypeChange = (event) => {
    const { value } = event.target;
    setSelectedSeasonType((prevState) =>
      prevState.includes(value)
        ? prevState.filter((seasonType) => seasonType !== value)
        : [...prevState, value]
    );
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // Get current page products
  const getCurrentPageProducts = () => {
    const startIndex = (page - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    return filteredProducts.slice(startIndex, endIndex);
  };

  // Get unique types and seasons for filters
  const uniqueTypes = [...new Set(products.map(product => product.type).filter(Boolean))];
  const uniqueSeasons = [...new Set(products.map(product => product.season).filter(Boolean))];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: "center" }}>
        <Typography variant="h3" sx={{ fontWeight: "bold", mb: 2 }}>
          🚗 Collection de Pneus
        </Typography>
        <Typography variant="h6" sx={{ color: "text.secondary" }}>
          Trouvez les pneus parfaits pour votre véhicule
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Filters Sidebar */}
        <Grid item xs={12} md={3}>
          <Card sx={{ p: 3, position: "sticky", top: 20 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: "bold" }}>
              Filtres
            </Typography>
            
            {/* Search */}
            <TextField
              label="Rechercher par nom, taille ou classe sonore"
              variant="outlined"
              fullWidth
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Ex: 205/55R16, A, Michelin..."
              sx={{ mb: 3 }}
            />

            {/* Type Filters */}
            {uniqueTypes.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: "bold" }}>
                  Type
                </Typography>
                {uniqueTypes.map((type) => (
                  <FormControlLabel
                    key={type}
                    control={
                      <Checkbox
                        value={type}
                        checked={selectedType.includes(type)}
                        onChange={handleTypeChange}
                        sx={{
                          "&.Mui-checked": {
                            color: "#1976d2",
                          },
                        }}
                      />
                    }
                    label={type}
                    sx={{ display: "block", mb: 1 }}
                  />
                ))}
              </Box>
            )}

            {/* Season Filters */}
            {uniqueSeasons.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: "bold" }}>
                  Saison
                </Typography>
                {uniqueSeasons.map((season) => (
                  <FormControlLabel
                    key={season}
                    control={
                      <Checkbox
                        value={season}
                        checked={selectedSeason.includes(season)}
                        onChange={handleSeasonChange}
                        sx={{
                          "&.Mui-checked": {
                            color: "#1976d2",
                          },
                        }}
                      />
                    }
                    label={season}
                    sx={{ display: "block", mb: 1 }}
                  />
                ))}
              </Box>
            )}

            {/* Season Type Filters */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: "bold" }}>
                Type de Saison
              </Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    value="summer"
                    checked={selectedSeasonType.includes("summer")}
                    onChange={handleSeasonTypeChange}
                    sx={{
                      "&.Mui-checked": {
                        color: "#1976d2",
                      },
                    }}
                  />
                }
                label="Été"
                sx={{ display: "block", mb: 1 }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    value="winter"
                    checked={selectedSeasonType.includes("winter")}
                    onChange={handleSeasonTypeChange}
                    sx={{
                      "&.Mui-checked": {
                        color: "#1976d2",
                      },
                    }}
                  />
                }
                label="Hiver"
                sx={{ display: "block", mb: 1 }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    value="4season"
                    checked={selectedSeasonType.includes("4season")}
                    onChange={handleSeasonTypeChange}
                    sx={{
                      "&.Mui-checked": {
                        color: "#1976d2",
                      },
                    }}
                  />
                }
                label="4 Saisons"
                sx={{ display: "block", mb: 1 }}
              />
            </Box>

          
          </Card>
        </Grid>

        {/* Products Grid */}
        <Grid item xs={12} md={9}>
          {getCurrentPageProducts().length > 0 ? (
            <>
              <Grid container spacing={3}>
                {getCurrentPageProducts().map((product) => (
                  <Grid item xs={12} sm={6} md={4} key={product._id}>
                    <Card
                      sx={{
                        height: "100%",
                        position: "relative",
                        overflow: "visible",
                      }}
                    >
                      {product.isPromotion && product.promotionDiscount && (
                        <Chip
                          label={`-${product.promotionDiscount}%`}
                          color="error"
                          sx={{
                            position: "absolute",
                            top: -10,
                            right: 10,
                            zIndex: 1,
                            fontWeight: "bold",
                          }}
                        />
                      )}
                      <PneuCard data={product} productCategory="pneus" />
                    </Card>
                  </Grid>
                ))}
              </Grid>

              {/* Pagination */}
              {totalPages > 1 && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    size="large"
                  />
                </Box>
              )}
            </>
          ) : (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Aucun pneu trouvé correspondant à vos critères
              </Typography>
              <Button
                variant="outlined"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedType([]);
                  setSelectedSeason([]);
                  setSelectedSeasonType([]);
                }}
              >
                Effacer les filtres
              </Button>
            </Box>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default PneusPage; 