# Excel Import Solution - Complete Setup

## ✅ What We've Built

### 1. **Simplified Pneus Schema** (`art/schemaTypes/pneus.ts`)
- Only includes fields from your Excel spreadsheet
- Buy price and sell price fields
- Promotion mode field
- All European tire label data (RR, WG, Sound ratings)

### 2. **Bulk Import Schema** (`art/schemaTypes/bulkImport.ts`)
- New document type for managing Excel imports
- Tracks import status and history
- Simple text field for pasting CSV data

### 3. **Processing Script** (`art/processBulkImport.js`)
- Automatically processes pending bulk imports
- Converts CSV data to pneu documents
- Calculates buy prices (80% of sell price)
- Updates import status

### 4. **Updated Package Scripts** (`art/package.json`)
- `yarn populate-pneus` - Original population script
- `yarn process-bulk-import` - New bulk import processor

## 🚀 How to Use

### **Step 1: Start Sanity Studio**
```bash
cd art
yarn dev
```

### **Step 2: Create Bulk Import**
1. Open Sanity Studio
2. Go to "Bulk Import Pneus" in sidebar
3. Create new import
4. Paste your Excel data in CSV format
5. Save the import

### **Step 3: Process the Import**
```bash
# Set your Sanity token
export SANITY_TOKEN="your_token_here"

# Process bulk imports
yarn process-bulk-import
```

## 📋 CSV Format Required

Your Excel data should have these columns:

```
EAN,SAP,ITEM NO.,SIZE,LI/SI,Extra,Pattern,EPREL CODE,RR,WG,SOUND CLASS,SOUND DB,CAT,QTY /40'HC,Price
6972508642560,1018199,CL1948H1,155/70R12,73T,,BLAZER HP,457757,D,C,B,70,C1,2230,19.90
```

## ✅ What Gets Created

- **All Excel fields** mapped to pneu schema
- **Buy price** calculated (80% of sell price)
- **Sell price** from Excel
- **Promotion mode** (set to false)
- **Complete product information** (EAN, SAP, sizes, etc.)

## 🔧 Files Created/Modified

1. ✅ `art/schemaTypes/pneus.ts` - Simplified schema
2. ✅ `art/schemaTypes/bulkImport.ts` - Bulk import schema
3. ✅ `art/schemaTypes/index.ts` - Added bulk import
4. ✅ `art/processBulkImport.js` - Processing script
5. ✅ `art/package.json` - Added new script
6. ✅ `art/EXCEL_IMPORT_INSTRUCTIONS.md` - Detailed instructions

## 🎯 Benefits

- ✅ **Simple workflow** - Paste Excel data, run script
- ✅ **No complex dependencies** - Works with existing setup
- ✅ **Automatic processing** - Script handles everything
- ✅ **Status tracking** - See which imports are processed
- ✅ **Error handling** - Failed imports are marked
- ✅ **Buy/Sell prices** - Automatic calculation
- ✅ **Promotion mode** - Ready for future use

## 🚀 Ready to Use!

Your Excel import solution is now complete and ready to use. Simply:

1. **Paste your Excel data** into the bulk import form
2. **Run the processing script** to create all pneus
3. **Check the status** to confirm completion

The system will automatically handle buy prices, sell prices, and promotion mode as requested! 🎉 