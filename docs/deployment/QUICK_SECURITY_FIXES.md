# 🔒 Quick Security Fixes

## Fix 1: Configure CORS (5 minutes)

**On Server:**
```bash
ssh root@93.127.206.164
cd /var/www/backend
nano .env
```

**Add/Update:**
```env
ALLOWED_ORIGINS=https://shreeomjisaraf.com,https://www.shreeomjisaraf.com
NODE_ENV=production
```

**Restart:**
```bash
pm2 restart goldapp-backend
```

---

## Fix 2: Add Rate Limiting (10 minutes)

**Install package:**
```bash
cd /var/www/backend
npm install express-rate-limit
```

**Add to server.js (after line 116):**
```javascript
const rateLimit = require('express-rate-limit');

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5 // limit each IP to 5 login requests per windowMs
});

app.use('/api/', limiter);
app.use('/api/login', loginLimiter);
```

**Restart:**
```bash
pm2 restart goldapp-backend
```

---

## Fix 3: Add Security Headers (5 minutes)

**Add to server.js (after CORS):**
```javascript
// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});
```

**Restart:**
```bash
pm2 restart goldapp-backend
```

---

## ✅ Done!

Your website security is now improved!

