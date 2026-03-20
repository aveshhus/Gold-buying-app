# ⚡ Quick Setup with Temporary Domain

## 🎯 What We're Doing

1. **Deploy with temporary domain** (for testing)
2. **Switch to final domain later** (easy process)

---

## 📋 Your Server Info

- **Server IP:** `93.127.206.164`
- **Hostname:** `srv1226397.hstgr.cloud`
- **SSH:** `ssh root@93.127.206.164`

---

## 🚀 Quick Setup (5 Steps)

### STEP 1: Connect & Install

```bash
ssh root@93.127.206.164
```

```bash
apt update && apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs nginx git
npm install -g pm2
```

---

### STEP 2: Upload Code

**Using FileZilla:**
- Connect to: `sftp://93.127.206.164`
- Upload `backend` → `/var/www/goldapp-backend/`
- Upload `frontend` → `/var/www/goldapp-frontend/`

---

### STEP 3: Configure Backend

```bash
cd /var/www/goldapp-backend
npm install --production
```

```bash
nano .env
```

**Paste this:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/gold-silver-app?retryWrites=true&w=majority
JWT_SECRET=<run: openssl rand -base64 32>
PORT=3001
NODE_ENV=production
ALLOWED_ORIGINS=http://srv1226397.hstgr.cloud
```

**Generate JWT:**
```bash
openssl rand -base64 32
# Copy output and paste in .env
```

**Save:** `Ctrl+X`, `Y`, `Enter`

```bash
mkdir -p logs
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
# Copy and run the command it shows
```

---

### STEP 4: Configure Nginx (Temporary Domain)

```bash
cd /var/www/goldapp-backend
cp nginx/goldapp-temp-domain.conf /etc/nginx/sites-available/goldapp
nano /etc/nginx/sites-available/goldapp
```

**Replace `srv1226397.hstgr.cloud` with your actual temporary domain (if different)**

**Save:** `Ctrl+X`, `Y`, `Enter`

```bash
ln -s /etc/nginx/sites-available/goldapp /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx
```

```bash
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

---

### STEP 5: Configure Frontend

```bash
cd /var/www/goldapp-frontend
npm install
```

```bash
nano .env.production
```

**Paste:**
```env
NEXT_PUBLIC_API_URL=http://srv1226397.hstgr.cloud/api
```

**Save:** `Ctrl+X`, `Y`, `Enter`

```bash
npm run build
pm2 start npm --name "goldapp-frontend" -- start
pm2 save
```

---

## ✅ Test Your App

**Backend:** `http://srv1226397.hstgr.cloud/api/prices`  
**Frontend:** `http://srv1226397.hstgr.cloud`

**✅ Your app is live on temporary domain!**

---

## 🔄 Switch to Final Domain (Later)

### Easy Way - Use the Script:

```bash
cd /var/www/goldapp-backend
chmod +x switch-domain.sh
./switch-domain.sh
```

**Follow the prompts:**
- Enter current domain: `srv1226397.hstgr.cloud`
- Enter new domain: `yourfinaldomain.com`
- Keep old domain? `y` (yes, so both work)

**The script will:**
- ✅ Update backend .env
- ✅ Update Nginx config
- ✅ Update frontend .env.production
- ✅ Rebuild frontend
- ✅ Restart everything

### Manual Way:

1. **Update DNS:**
   - A record: `@` → `93.127.206.164`
   - A record: `www` → `93.127.206.164`

2. **Update backend .env:**
   ```bash
   nano /var/www/goldapp-backend/.env
   ```
   Change: `ALLOWED_ORIGINS=https://yourfinaldomain.com,https://www.yourfinaldomain.com`

3. **Update Nginx:**
   ```bash
   nano /etc/nginx/sites-available/goldapp
   ```
   Replace `srv1226397.hstgr.cloud` with `yourfinaldomain.com`

4. **Update frontend:**
   ```bash
   nano /var/www/goldapp-frontend/.env.production
   ```
   Change: `NEXT_PUBLIC_API_URL=https://yourfinaldomain.com/api`

5. **Restart everything:**
   ```bash
   nginx -t && systemctl reload nginx
   pm2 restart goldapp-backend
   cd /var/www/goldapp-frontend && npm run build && pm2 restart goldapp-frontend
   ```

6. **Get SSL:**
   ```bash
   certbot --nginx -d yourfinaldomain.com -d www.yourfinaldomain.com
   ```

---

## 📝 Summary

**Temporary Domain Setup:**
- ✅ Use `srv1226397.hstgr.cloud` (or Hostinger's temp domain)
- ✅ Use HTTP (no SSL needed for testing)
- ✅ Test everything works

**Switch to Final Domain:**
- ✅ Run `switch-domain.sh` script
- ✅ Update DNS records
- ✅ Get SSL certificate
- ✅ Done!

---

## 🆘 Troubleshooting

**Can't access temporary domain?**
- Check if Nginx is running: `systemctl status nginx`
- Check PM2: `pm2 status`
- Check logs: `pm2 logs`

**Domain switch not working?**
- Check DNS: `ping yourfinaldomain.com`
- Verify Nginx config: `nginx -t`
- Check .env files are updated

---

**🎯 Start with temporary domain, test, then switch when ready!**

