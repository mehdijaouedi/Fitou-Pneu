const selctCategory = (category) => {
    switch (category) {
        case "pneus":
            return "pneu";
        case "jantes":
            return "jente";
        case "combos":
            return "Combos";
        default:
            return "mixt";
    }
}

// Function to get regional price based on user region
const getRegionalPrice = (product, userRegion = 'Nord France') => {
  if (!product) return null;
  
  // For pneus with sizes
  if (product.sizes && Array.isArray(product.sizes)) {
    return product.sizes.map(size => ({
      ...size,
      price: userRegion === 'Sud France' ? (size.sudPrice || size.price) : (size.nordPrice || size.price)
    }));
  }
  
  // For jentes and mixtes
  if (userRegion === 'Sud France') {
    return product.sudPrice || product.price || product.sellingPrice || product.sellPrice || 0;
  } else {
    return product.nordPrice || product.price || product.sellingPrice || product.sellPrice || 0;
  }
};

// Function to get regional price for a specific size (for pneus)
const getRegionalPriceForSize = (size, userRegion = 'Nord France') => {
  if (!size) return null;
  
  if (userRegion === 'Sud France') {
    return size.sudPrice || size.price;
  } else {
    return size.nordPrice || size.price;
  }
};

export { selctCategory, getRegionalPrice, getRegionalPriceForSize };