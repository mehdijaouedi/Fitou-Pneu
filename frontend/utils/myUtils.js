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
  if (!product) return 0;
  
  // Check if product is on promotion and has promotional prices
  if (product.isPromotion) {
    if (userRegion === 'Sud France') {
      return product.promotionPriceSud || product.sellPriceSud || product.sudPrice || product.sellPrice || product.price || product.sellingPrice || 0;
    } else {
      return product.promotionPriceNord || product.sellPriceNord || product.nordPrice || product.sellPrice || product.price || product.sellingPrice || 0;
    }
  }
  
  // For pneus with sizes - return the first size price or average
  if (product.sizes && Array.isArray(product.sizes) && product.sizes.length > 0) {
    const firstSize = product.sizes[0];
    return userRegion === 'Sud France' 
      ? (firstSize.sellPriceSud || firstSize.sudPrice || firstSize.price || firstSize.sellPrice || 0) 
      : (firstSize.sellPriceNord || firstSize.nordPrice || firstSize.price || firstSize.sellPrice || 0);
  }
  
  // For jentes and mixtes - check both naming conventions
  if (userRegion === 'Sud France') {
    return product.sellPriceSud || product.sudPrice || product.sellPrice || product.price || product.sellingPrice || 0;
  } else {
    return product.sellPriceNord || product.nordPrice || product.sellPrice || product.price || product.sellingPrice || 0;
  }
};

// Function to get regional price for a specific size (for pneus)
const getRegionalPriceForSize = (size, userRegion = 'Nord France') => {
  if (!size) return 0;
  
  if (userRegion === 'Sud France') {
    return size.sellPriceSud || size.sudPrice || size.sellPrice || size.price || 0;
  } else {
    return size.sellPriceNord || size.nordPrice || size.sellPrice || size.price || 0;
  }
};

// Function to apply regional pricing to a product
const applyRegionalPricing = (product, userRegion = 'Nord France') => {
  if (!product) return null;
  
  // Calculate the final price based on promotion status and region
  const finalPrice = getRegionalPrice(product, userRegion);
  
  if (product.sizes && Array.isArray(product.sizes)) {
    // For pneus with sizes
    return {
      ...product,
      sizes: product.sizes.map(size => ({
        ...size,
        price: userRegion === 'Sud France' 
          ? (size.sellPriceSud || size.sudPrice || size.sellPrice || size.price || 0) 
          : (size.sellPriceNord || size.nordPrice || size.sellPrice || size.price || 0)
      })),
      price: finalPrice // Set main price for display
    };
  } else {
    // For jentes and mixtes
    return {
      ...product,
      price: finalPrice
    };
  }
};

// Function to apply regional pricing to an array of products
const applyRegionalPricingToProducts = (products, userRegion = 'Nord France') => {
  if (!Array.isArray(products)) return [];
  
  return products.map(product => applyRegionalPricing(product, userRegion));
};

export { 
  selctCategory, 
  getRegionalPrice, 
  getRegionalPriceForSize, 
  applyRegionalPricing, 
  applyRegionalPricingToProducts 
};