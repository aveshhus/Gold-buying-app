# 📱 Physical Device Setup Guide

## Why Network Error Occurs

When you install an APK on a **physical phone**, `localhost` refers to the phone itself, not your computer. Your phone needs to connect to your **computer's IP address** on your local network.

## ✅ Solution Steps

### Step 1: Check Your Computer's IP Address

```powershell
ipconfig
```

Look for **IPv4 Address** (usually starts with `192.168.x.x` or `10.x.x.x`)

**Example:** `192.168.31.233`

### Step 2: Allow Windows Firewall Access

**Option A: Using PowerShell Script (Recommended)**
```powershell
# Run PowerShell as Administrator
cd "C:\Users\Admin\Desktop\Goldapp 2\backend"
powershell -ExecutionPolicy Bypass -File fix-network-access.ps1
```

**Option B: Manual Firewall Rule**
1. Open Windows Defender Firewall
2. Click "Advanced settings"
3. Click "Inbound Rules" → "New Rule"
4. Select "Port" → Next
5. Select "TCP" and enter port `3001` → Next
6. Select "Allow the connection" → Next
7. Check all profiles → Next
8. Name it "Node.js Backend Port 3001" → Finish

### Step 3: Verify API URL in Mobile App

Check `mobile/src/api/client.ts`:

```typescript
const API_BASE_URL = 'http://YOUR_IP_ADDRESS:3001/api';
```

**Example:**
```typescript
const API_BASE_URL = 'http://192.168.31.233:3001/api';
```

### Step 4: Rebuild APK with Correct IP

If you already built the APK with the wrong IP:

```powershell
cd mobile

# Make sure API URL is correct
# Edit mobile/src/api/client.ts first!

# Rebuild APK
npm run build:android:local
# OR
eas build --platform android --profile preview
```

### Step 5: Verify Same Network

**Important:** Your phone and computer must be on the **same Wi-Fi network**!

- ✅ Same Wi-Fi network = Works
- ❌ Different networks = Won't work
- ❌ Phone on mobile data = Won't work

### Step 6: Test Backend Accessibility

From your phone's browser, try:
```
http://YOUR_IP_ADDRESS:3001
```

If you see the backend page, it's working!

## 🔍 Troubleshooting

### Still Getting Network Error?

1. **Check IP Address Changed**
   ```powershell
   ipconfig
   ```
   If IP changed, update `mobile/src/api/client.ts` and rebuild APK

2. **Check Firewall**
   ```powershell
   Get-NetFirewallRule -DisplayName "Node.js Backend Port 3001"
   ```
   Should show the rule exists

3. **Check Backend is Running**
   ```powershell
   netstat -ano | findstr :3001
   ```
   Should show LISTENING

4. **Test from Phone Browser**
   Open phone browser and go to: `http://YOUR_IP:3001`
   - If it works = Backend is accessible
   - If it doesn't = Firewall or network issue

5. **Check Same Network**
   - Phone Wi-Fi IP: Settings → Wi-Fi → Tap your network → Check IP
   - Computer IP: `ipconfig`
   - First 3 numbers should match (e.g., `192.168.31.x`)

6. **Restart Backend Server**
   ```powershell
   cd backend
   npm start
   ```

## 📝 Quick Checklist

- [ ] Computer and phone on same Wi-Fi
- [ ] Windows Firewall allows port 3001
- [ ] Backend server is running
- [ ] API URL in `mobile/src/api/client.ts` matches your IP
- [ ] APK rebuilt with correct IP address
- [ ] Tested backend URL from phone browser

## 🌐 Production Deployment

For production, you'll need:
- A public server (not localhost)
- Domain name or public IP
- HTTPS certificate
- Update API URL to: `https://your-domain.com/api`

## 💡 Pro Tips

1. **Use Static IP**: Configure your router to give your computer a static IP so it doesn't change
2. **Use ngrok for Testing**: For quick testing without firewall issues:
   ```bash
   npx ngrok http 3001
   ```
   Then use the ngrok URL in your app
3. **Development vs Production**: Use different API URLs for dev and production builds




