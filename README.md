# Fitou-Pneu

A comprehensive tire and wheel management system with regional pricing support.

## Features

### Regional Pricing
The system now supports regional pricing for France:
- **Nord France**: Users from northern France see prices for the northern region
- **Sud France**: Users from southern France see prices for the southern region

### How Regional Pricing Works

1. **User Registration**: During registration, users can select their region (Nord France or Sud France)
2. **Product Pricing**: Products now have separate price fields:
   - `nordPrice`: Price for Nord France users
   - `sudPrice`: Price for Sud France users
   - `price`: Legacy price field (now defaults to Nord France pricing)
3. **Automatic Price Selection**: The system automatically displays the appropriate price based on the user's region
4. **Fallback**: If regional prices are not set, the system falls back to the default price

### Product Types Supported

- **Pneus (Tires)**: Support regional pricing per size
- **Jentes (Wheels)**: Support regional pricing
- **Mixtes (Combos)**: Support regional pricing

### Technical Implementation

#### Database Changes
- Added `region` field to `Utilisateur` table
- Default value: "Nord France"

#### Sanity CMS Changes
- Updated product schemas to include `nordPrice` and `sudPrice` fields
- Updated client schema to include `region` field

#### Frontend Changes
- Registration form includes region selection
- Product display automatically shows regional prices
- Cart and checkout use regional pricing

#### Backend Changes
- User creation and authentication include region field
- Sync services handle regional data

## Getting Started

1. Run database migrations:
   ```bash
   cd Backend
   npx prisma migrate dev
   ```

2. Start the backend:
   ```bash
   cd Backend
   npm run start:dev
   ```

3. Start the frontend:
   ```bash
   cd frontend
   npm run dev
   ```

4. Access Sanity Studio:
   ```bash
   cd art
   npm run dev
   ```

## Usage

1. **Register a new user** and select their region
2. **Add products** in Sanity Studio with regional pricing
3. **Users will automatically see** prices based on their region
4. **Cart and checkout** will use the appropriate regional pricing

## Migration Notes

- Existing users will default to "Nord France" region
- Existing products will use the legacy `price` field as fallback
- New products should include both `nordPrice` and `sudPrice` for proper regional pricing