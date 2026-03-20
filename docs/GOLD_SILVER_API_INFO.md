# 🔑 Gold & Silver API Information

## 📍 API Details

### **API Key**
```
ccca0cd9442d38bf1b9fdf11bdf89aeeccca0cd9
```

### **Primary API Service**
**Metals-API.com** - https://metals-api.com

---

## 🔗 API Endpoints Used

### 1. **Main Price Endpoint (Your App)**
```
GET http://localhost:3000/api/prices
```
This is your app's endpoint that fetches and processes gold/silver prices.

### 2. **Metals-API.com Endpoints**

#### **Primary Endpoint (with all symbols)**
```
https://api.metals-api.com/v1/latest?access_key=ccca0cd9442d38bf1b9fdf11bdf89aeeccca0cd9&base=USD&symbols=XAU,XAG,INR
```

#### **Alternative Endpoint (INR base)**
```
https://api.metals-api.com/v1/latest?access_key=ccca0cd9442d38bf1b9fdf11bdf89aeeccca0cd9&base=INR&symbols=XAU,XAG
```

#### **Separate Gold Endpoint**
```
https://api.metals-api.com/v1/latest?access_key=ccca0cd9442d38bf1b9fdf11bdf89aeeccca0cd9&base=USD&symbols=XAU
```

#### **Separate Silver Endpoint**
```
https://api.metals-api.com/v1/latest?access_key=ccca0cd9442d38bf1b9fdf11bdf89aeeccca0cd9&base=USD&symbols=XAG
```

### 3. **Exchange Rate API (USD to INR)**
```
https://api.exchangerate-api.com/v4/latest/USD
```
Used to convert USD prices to INR when needed.

---

## 📊 API Response Format

### **Metals-API.com Response Structure**
```json
{
  "success": true,
  "timestamp": 1234567890,
  "date": "2024-01-01",
  "base": "USD",
  "rates": {
    "XAU": 0.0005,    // Ounces per USD (inverted to get USD per ounce)
    "XAG": 0.04,      // Ounces per USD (inverted to get USD per ounce)
    "INR": 83.0       // USD to INR exchange rate
  }
}
```

### **Your App's Response Format**
```json
{
  "gold24k": 12742.50,    // 24K Gold price per gram in INR
  "gold22k": 11685.00,   // 22K Gold price per gram in INR
  "silver": 150.56,      // Silver price per gram in INR
  "lastUpdated": "2024-01-01T12:00:00.000Z",
  "source": "metals-api.com"
}
```

---

## 🧮 Price Calculation Logic

### **Constants Used**
```javascript
const GRAMS_PER_OUNCE = 31.1035;      // 1 troy ounce = 31.1035 grams
const GOLD_24K_PURITY = 0.999;         // 24K gold is 99.9% pure
const GOLD_22K_PURITY = 0.916;         // 22K gold is 91.6% pure
const GOLD_PREMIUM = 1.025;            // 2.5% premium for gold
const SILVER_PREMIUM = 1.03;           // 3% premium for silver
```

### **Calculation Steps**

1. **Get Gold Price per Ounce in USD:**
   ```javascript
   goldPricePerOunceUSD = 1 / rates.XAU
   ```

2. **Convert to INR per Gram:**
   ```javascript
   goldPricePerGramINR = (goldPricePerOunceUSD * usdToInr) / GRAMS_PER_OUNCE
   ```

3. **Add Indian Market Premium:**
   ```javascript
   goldPricePerGramINRWithPremium = goldPricePerGramINR * GOLD_PREMIUM
   ```

4. **Apply Purity:**
   ```javascript
   gold24k = goldPricePerGramINRWithPremium * GOLD_24K_PURITY
   gold22k = goldPricePerGramINRWithPremium * GOLD_22K_PURITY
   ```

5. **Same process for Silver:**
   ```javascript
   silverPricePerOunceUSD = 1 / rates.XAG
   silverPricePerGramINR = (silverPricePerOunceUSD * usdToInr) / GRAMS_PER_OUNCE
   silver = silverPricePerGramINR * SILVER_PREMIUM
   ```

---

## 📁 File Locations

### **Backend (Server)**
- **File**: `server.js`
- **Endpoint**: Line 265 - `/api/prices`
- **API Key**: Line 267
- **Fetch Function**: Line 770 - `fetchURL()`

### **Frontend (Old HTML/JS)**
- **File**: `script.js`
- **API Key**: Line 2
- **Fetch Functions**: Multiple methods starting from line 41

### **Frontend (Next.js)**
- **File**: `frontend/lib/api.ts` (if exists)
- **Store**: `frontend/store/usePriceStore.ts`
- **Components**: Various dashboard components

---

## 🔄 API Fallback Strategy

The app tries multiple methods in order:

1. **Method 1**: Metals-API.com with all symbols (XAU, XAG, INR)
2. **Method 2**: Separate API calls for gold and silver
3. **Method 3**: Exchange rate API for USD to INR conversion
4. **Fallback**: Uses demo/test data if all APIs fail

---

## 🧪 Testing the API

### **Test Your App's Endpoint**
```bash
curl http://localhost:3000/api/prices
```

### **Test Metals-API Directly**
```bash
curl "https://api.metals-api.com/v1/latest?access_key=ccca0cd9442d38bf1b9fdf11bdf89aeeccca0cd9&base=USD&symbols=XAU,XAG,INR"
```

### **Test Exchange Rate API**
```bash
curl https://api.exchangerate-api.com/v4/latest/USD
```

---

## 📝 Notes

1. **API Key**: The key `ccca0cd9442d38bf1b9fdf11bdf89aeeccca0cd9` is used throughout the app
2. **Rate Limits**: Check Metals-API.com documentation for rate limits
3. **Premium**: Indian market premiums (2.5% gold, 3% silver) are added to match local prices
4. **Purity**: 24K = 99.9% pure, 22K = 91.6% pure
5. **Fallback**: If API fails, the app uses realistic demo data for testing

---

## 🔗 Related Files

- `server.js` - Backend API endpoint
- `script.js` - Frontend price fetching (old HTML version)
- `frontend/lib/api.ts` - Frontend API client (Next.js)
- `frontend/store/usePriceStore.ts` - Price state management

---

## ⚠️ Important

- **API Key Security**: In production, move the API key to environment variables
- **Rate Limits**: Be aware of API rate limits from Metals-API.com
- **Error Handling**: The app has fallback mechanisms if the API fails
- **Testing**: Use demo mode if API is unavailable

---

*Last Updated: Based on current codebase*


