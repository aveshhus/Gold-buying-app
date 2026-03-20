# ✅ Test Your Cursor + Hostinger Connection

## 🔍 How to Verify Connection

### Step 1: Restart Cursor

**Important:** You must restart Cursor for the MCP configuration to take effect!

1. **Close Cursor completely** (all windows)
2. **Reopen Cursor**
3. **Wait a few seconds** for MCP to initialize

---

## 🧪 Step 2: Test the Connection

### Method 1: Ask Cursor Directly

**Open Cursor Chat** (Press `Ctrl + L` or `Cmd + L`) and ask:

```
Can you check my Hostinger VPS status?
```

**Or:**

```
Check if my Hostinger account is connected. 
My VPS IP is 93.127.206.164
```

**Expected Response:**
- ✅ If connected: Cursor will show server information
- ❌ If not connected: Cursor will say it can't access Hostinger

---

### Method 2: Check MCP Status

1. **Open Cursor Settings:**
   - Press `Ctrl + ,` (or `Cmd + ,` on Mac)
   - Search for "MCP"

2. **Look for:**
   - MCP servers list
   - Should show "hostinger-mcp" as active/connected

---

### Method 3: Try a Simple Command

**Ask Cursor:**

```
List my Hostinger services or check my VPS at 93.127.206.164
```

**If it works:**
- ✅ Connection is successful!
- You can now use Cursor to help with deployment

**If it doesn't work:**
- Check the troubleshooting section below

---

## ✅ Signs of Successful Connection

**Cursor will be able to:**
- ✅ Access your Hostinger account information
- ✅ Check your VPS status
- ✅ Help with deployment commands
- ✅ Manage your domains
- ✅ Provide server-specific guidance

---

## 🐛 Troubleshooting

### Problem: "Cannot connect" or "MCP not available"

**Solutions:**

1. **Verify API Token:**
   - Make sure token is correct in `.cursor/mcp-config.json`
   - No extra spaces or quotes around the token
   - Token should be exactly as provided by Hostinger

2. **Check File Location:**
   - Config file should be in: `.cursor/mcp-config.json`
   - Or in Cursor's settings directory

3. **Restart Cursor:**
   - Close completely
   - Reopen
   - Wait 10-15 seconds

4. **Check Cursor Version:**
   - Make sure you have latest Cursor version
   - MCP support requires recent version

5. **Verify Token Permissions:**
   - Login to Hostinger
   - Check if API token has correct permissions
   - Regenerate token if needed

---

## 🎯 Next Steps (Once Connected)

### 1. Test Basic Commands

**Ask Cursor:**
```
What's the status of my Hostinger VPS at 93.127.206.164?
```

### 2. Start Deployment

**Ask Cursor:**
```
Help me deploy my GoldApp backend to my Hostinger VPS.
Server: 93.127.206.164
Temporary domain: srv1226397.hstgr.cloud
```

### 3. Get Deployment Commands

**Ask Cursor:**
```
Generate the exact commands to:
1. Install Node.js on my VPS
2. Install PM2
3. Start my backend
4. Configure Nginx
```

---

## 💡 Pro Tips

### If Connection Works:

1. **Be Specific:** Give Cursor your exact server details
2. **Ask Step-by-Step:** "Walk me through deploying my backend"
3. **Get Commands:** "Generate commands for my server"
4. **Troubleshoot:** "Help me fix [specific issue]"

### Example Good Questions:

```
"Help me deploy my Node.js backend to 93.127.206.164"
"Generate PM2 startup commands for my backend"
"Help me configure Nginx for srv1226397.hstgr.cloud"
"Troubleshoot my server connection issue"
```

---

## ✅ Quick Test Checklist

- [ ] API token added to config file
- [ ] Cursor restarted completely
- [ ] Asked Cursor to check Hostinger connection
- [ ] Cursor can access your VPS information
- [ ] Ready to use for deployment!

---

## 🚀 Ready to Deploy?

**Once connection is verified, you can start deploying!**

**Just ask Cursor:**
```
I'm ready to deploy my GoldApp. 
Help me step by step with exact commands for my server at 93.127.206.164
```

**Cursor will guide you through everything!** 🎉

