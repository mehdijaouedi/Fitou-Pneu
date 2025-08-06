# Excel Import Instructions

## How to Import Excel Data into Sanity

### Step 1: Create Bulk Import in Sanity

1. **Open Sanity Studio**
2. **Go to "Bulk Import Pneus"** in the left sidebar
3. **Create a new bulk import**
4. **Fill in the details:**
   - Title: Give your import a name (e.g., "COMPASAL March 2025")
   - Description: Optional description
   - Excel Data: Paste your Excel data in CSV format (see format below)

### Step 2: Convert Excel to CSV Format

1. **Open your Excel file**
2. **Select all your data** (Ctrl+A)
3. **Copy the data** (Ctrl+C)
4. **Open a text editor** (Notepad, VS Code, etc.)
5. **Paste the data** (Ctrl+V)
6. **Copy the text** and paste it into the "Excel Data" field in Sanity

### Step 3: Process the Import

1. **Save the bulk import** in Sanity
2. **Run the processing script**:
   ```bash
   yarn process-bulk-import
   ```
3. **Check the status** - it will update to "completed" when done

### Expected CSV Format

Your Excel data should have these columns in this order:

```
EAN,SAP,ITEM NO.,SIZE,LI/SI,Extra,Pattern,EPREL CODE,RR,WG,SOUND CLASS,SOUND DB,CAT,QTY /40'HC,Price
6972508642560,1018199,CL1948H1,155/70R12,73T,,BLAZER HP,457757,D,C,B,70,C1,2230,19.90
6972508642577,1018200,CL1948H2,145/80R12,71T,,BLAZER HP,457758,D,C,B,71,C1,2710,18.40
```

### Example Data

Here's an example of what your CSV should look like:

```csv
EAN,SAP,ITEM NO.,SIZE,LI/SI,Extra,Pattern,EPREL CODE,RR,WG,SOUND CLASS,SOUND DB,CAT,QTY /40'HC,Price
6972508642560,1018199,CL1948H1,155/70R12,73T,,BLAZER HP,457757,D,C,B,70,C1,2230,19.90
6972508642577,1018200,CL1948H2,145/80R12,71T,,BLAZER HP,457758,D,C,B,71,C1,2710,18.40
6972508642584,1018201,CL1948H3,155/80R12,75T,,BLAZER HP,457759,D,C,B,71,C1,2500,20.10
```

### What Happens When You Process

1. **Script fetches pending imports** from Sanity
2. **CSV data is parsed** and validated
3. **Buy price is calculated** as 80% of sell price (20% margin)
4. **All fields are mapped** to the pneu schema
5. **Products are created** automatically in Sanity
6. **Import status is updated** to "completed"

### Fields That Get Created

- **Name**: "BLAZER HP [SIZE]"
- **Brand**: "COMPASAL"
- **Model**: "BLAZER HP"
- **EAN**: From your Excel
- **SAP**: From your Excel
- **Item No.**: From your Excel
- **Size**: From your Excel
- **LI/SI**: From your Excel
- **Pattern**: "BLAZER HP"
- **All European tire label data**: RR, WG, Sound ratings
- **Buy Price**: Calculated as 80% of sell price
- **Sell Price**: From your Excel
- **Promotion Mode**: Set to false by default

### Running the Script

```bash
# Set your Sanity token
export SANITY_TOKEN="your_token_here"

# Process bulk imports
yarn process-bulk-import
```

### Troubleshooting

**If you get an error:**
1. Make sure your CSV has the correct column headers
2. Check that all required fields have data
3. Ensure the price column contains valid numbers
4. Make sure there are no extra commas in your data
5. Verify your SANITY_TOKEN is set correctly

**If data doesn't import:**
1. Check that your Excel data is properly formatted
2. Make sure you're copying the entire table including headers
3. Verify that the EAN and SIZE columns have data
4. Check the import status in Sanity Studio

### Tips

- **Test with a few rows first** before importing large datasets
- **Keep your Excel file as backup** in case you need to reimport
- **Check the import status** in Sanity Studio after running the script
- **Use the status field** to track which imports have been processed 