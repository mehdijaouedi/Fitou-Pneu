# Excel File Upload Feature

## 🎯 What This Does

This feature allows you to:
1. **Upload Excel files** directly from your laptop
2. **View all data one by one** in a nice interface
3. **Navigate through products** with Previous/Next buttons
4. **See all Excel fields** displayed clearly

## 🚀 How to Use

### Step 1: Open Sanity Studio
```bash
cd art
yarn dev
```

### Step 2: Create a New Pneu
1. **Go to "Pneus"** in the left sidebar
2. **Click "Create new"**
3. **You'll see "Upload Excel File"** at the top

### Step 3: Upload Your Excel File
1. **Click "Choose Excel File"**
2. **Select your Excel file** from your laptop
3. **The file will be processed** automatically

### Step 4: View Your Data
After uploading, you'll see:
- ✅ **Success message** with number of products loaded
- 📊 **Product counter** (e.g., "Product 1 of 17")
- 🔄 **Navigation buttons** (Previous/Next)
- 📋 **Detailed product information** displayed

## 📋 What You'll See

For each product, you'll see:
- **Size and Item Number** (e.g., "155/70R12 - CL1948H1")
- **Price badge** (e.g., "€19.90")
- **All Excel fields:**
  - EAN
  - SAP
  - LI/SI
  - Pattern
  - EPREL CODE
  - RR (Rolling Resistance)
  - WG (Wet Grip)
  - Sound Class
  - Sound DB
  - CAT
  - QTY /40'HC
  - Extra

## 🔄 Navigation

- **← Previous**: Go to the previous product
- **Next →**: Go to the next product
- **Clear Data**: Remove the uploaded file and start over

## 📁 Supported File Types

- **Excel files** (.xlsx, .xls)
- **CSV files** (.csv)

## ⚠️ Important Notes

1. **Save your Excel as CSV** if you have issues with Excel files
2. **Make sure your Excel has headers** in the first row
3. **Required columns**: EAN, SIZE (these must be present)
4. **The file is processed in your browser** - no server upload needed

## 🎯 Expected Excel Format

Your Excel should have these columns:
```
EAN,SAP,ITEM NO.,SIZE,LI/SI,Extra,Pattern,EPREL CODE,RR,WG,SOUND CLASS,SOUND DB,CAT,QTY /40'HC,Price
6972508642560,1018199,CL1948H1,155/70R12,73T,,BLAZER HP,457757,D,C,B,70,C1,2230,19.90
```

## 🚀 Benefits

- ✅ **Direct file upload** from your laptop
- ✅ **No need to copy/paste** data
- ✅ **View all products** one by one
- ✅ **Easy navigation** through your data
- ✅ **Clear display** of all Excel fields
- ✅ **Works with your existing** Excel files

## 🔧 Troubleshooting

**If the file doesn't upload:**
1. Make sure it's a valid Excel or CSV file
2. Check that the file has the correct headers
3. Try saving your Excel as CSV format
4. Make sure the file isn't too large

**If you don't see the data:**
1. Check that EAN and SIZE columns exist
2. Make sure the file has data rows (not just headers)
3. Try a different file format

The feature is now ready to use! Simply upload your Excel file and browse through all your products one by one. 🎉 