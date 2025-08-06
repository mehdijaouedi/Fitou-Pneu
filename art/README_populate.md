# Pneus Population Script

This script will delete all existing pneus data and populate the database with new data from the Excel spreadsheet.

## Prerequisites

1. Make sure you have a Sanity token with write permissions
2. The token should be set as an environment variable: `SANITY_TOKEN`

## How to get your Sanity token:

1. Go to [manage.sanity.io](https://manage.sanity.io)
2. Select your project (rsg8mxls)
3. Go to API section
4. Create a new token with write permissions
5. Copy the token

## Running the script

### Option 1: Using Node.js directly

```bash
# Set your Sanity token as environment variable
export SANITY_TOKEN="your_token_here"

# Run the script
node populatePneus.js
```

### Option 2: Using npm script (add to package.json)

Add this to your package.json scripts:

```json
{
  "scripts": {
    "populate-pneus": "SANITY_TOKEN=$SANITY_TOKEN node populatePneus.js"
  }
}
```

Then run:
```bash
npm run populate-pneus
```

## What the script does:

1. **Deletes all existing pneus** from the database
2. **Creates new pneus** with data from the Excel spreadsheet including:
   - All tire specifications (EAN, SAP, size, load/speed index, etc.)
   - **Buy price** (calculated as 80% of sell price for 20% margin)
   - **Sell price** (from the Excel spreadsheet)
   - **Promotion mode** (set to false by default, can be modified in the script)

## Data included:

- **17 tire products** from the COMPASAL BLAZER HP line
- **Sizes**: 155/70R12, 145/80R12, 155/80R12, 165/70R12, 175/70R12, 145/80R13, 155/80R13, 165/80R13, 175/80R13, 185/80R13, 155/70R13, 165/70R13, 175/70R13, 185/70R13, 195/70R13, 205/70R13, 165/65R14
- **European tire label data**: Rolling resistance (RR), Wet grip (WG), Sound class, Sound DB
- **Technical specifications**: Load index, Speed rating, EAN codes, SAP codes, EPREL codes

## Important notes:

- The script assumes a 20% margin between buy and sell prices
- All tires are set as "all season" and "in stock"
- Promotion mode is set to false by default
- Initial quantity is set to 0 for all sizes

## Modifying the script:

If you want to:
- Change the margin percentage
- Set some products as promotional
- Modify prices
- Add more products

Edit the `pneusData` array in `populatePneus.js` and run the script again.

## Troubleshooting:

If you get permission errors:
1. Make sure your Sanity token has write permissions
2. Check that the project ID is correct (rsg8mxls)
3. Verify the dataset name is correct (production)

If you get connection errors:
1. Check your internet connection
2. Verify the Sanity project is accessible
3. Try running the script again 