# 🚀 Cursor + Hostinger MCP Integration Guide

## 🎯 What This Does

The Hostinger MCP integration allows Cursor IDE to directly interact with your Hostinger account, making deployment and server management easier.

**Benefits:**
- ✅ Manage your VPS from Cursor
- ✅ Deploy code directly from IDE
- ✅ Monitor server status
- ✅ Manage domains and DNS
- ✅ Automate deployment tasks

---

## 📋 STEP 1: Get Your Hostinger API Token

1. **Login to Hostinger:**
   - Go to https://hpanel.hostinger.com
   - Login to your account

2. **Get API Token:**
   - Go to **Account Settings** or **API** section
   - Look for **"API Tokens"** or **"Developer API"**
   - Click **"Generate New Token"** or **"Create API Key"**
   - **Copy the token** (you'll only see it once!)
   - **Save it securely** - you'll need it

**⚠️ Important:** Keep this token secret! Don't share it or commit it to Git.

---

## 📋 STEP 2: Configure Cursor

### Option A: Using Cursor Settings (Recommended)

1. **Open Cursor Settings:**
   - Press `Ctrl + ,` (Windows/Linux) or `Cmd + ,` (Mac)
   - Or: File → Preferences → Settings

2. **Search for "MCP" or "Model Context Protocol"**

3. **Open MCP Settings:**
   - Look for **"MCP Servers"** or **"Model Context Protocol"**
   - Click **"Edit in settings.json"** or **"Open Settings JSON"**

4. **Add Hostinger MCP Configuration:**

   Paste this configuration:

   ```json
   {
     "mcpServers": {
       "hostinger-mcp": {
         "command": "npx",
         "args": [
           "hostinger-api-mcp@latest"
         ],
         "env": {
           "API_TOKEN": "YOUR_HOSTINGER_API_TOKEN_HERE"
         }
       }
     }
   }
   ```

5. **Replace `YOUR_HOSTINGER_API_TOKEN_HERE`** with your actual API token

6. **Save the file**

### Option B: Manual Configuration File

1. **Find Cursor Config Directory:**
   - Windows: `%APPDATA%\Cursor\User\globalStorage\`
   - Mac: `~/Library/Application Support/Cursor/User/globalStorage/`
   - Linux: `~/.config/Cursor/User/globalStorage/`

2. **Create or edit MCP config file:**
   - Look for `mcp.json` or create it in the config directory

3. **Add the same JSON configuration as above**

---

## 📋 STEP 3: Restart Cursor

1. **Close Cursor completely**
2. **Reopen Cursor**
3. **The integration should now be active**

---

## 📋 STEP 4: Verify Connection

1. **Open Cursor Chat/Composer** (usually `Ctrl + L` or `Cmd + L`)
2. **Ask Cursor:**
   ```
   Can you check my Hostinger VPS status?
   ```
3. **If it works**, Cursor should be able to access your Hostinger account

---

## 🚀 How This Helps with Deployment

### What You Can Do Now:

1. **Check Server Status:**
   - Ask Cursor: "What's the status of my VPS?"
   - Get server info without logging into Hostinger

2. **Manage Domains:**
   - "List my domains"
   - "Add DNS record for mydomain.com"
   - "Point domain to my VPS IP"

3. **Server Management:**
   - "Restart my VPS"
   - "Check server resources"
   - "View server logs"

4. **Deployment Assistance:**
   - Cursor can help you with deployment commands
   - Can check if services are running
   - Can help troubleshoot issues

---

## 📝 Deployment Workflow with Cursor Integration

### Step 1: Prepare Your Code

```bash
# In Cursor, you can ask:
"Help me prepare my backend code for deployment"
```

### Step 2: Upload Code (Still Manual)

**You still need to upload code manually:**
- Using FileZilla (SFTP)
- Using Git (if you have a repository)
- Or ask Cursor: "How do I upload files to my Hostinger VPS?"

### Step 3: Deploy with Cursor Help

**You can now ask Cursor:**
```
"Help me deploy my Node.js backend to my Hostinger VPS at 93.127.206.164"
```

**Cursor can:**
- Generate deployment commands
- Check server status
- Help troubleshoot issues
- Guide you through each step

### Step 4: Monitor Deployment

**Ask Cursor:**
```
"Is my backend running on my VPS?"
"Check the status of my server"
"Show me server logs"
```

---

## 🎯 Example: Complete Deployment with Cursor

### 1. Ask Cursor to Help:

```
I want to deploy my GoldApp to my Hostinger VPS.
Server IP: 93.127.206.164
Temporary domain: srv1226397.hstgr.cloud
Help me step by step.
```

### 2. Cursor Will:

- ✅ Guide you through each step
- ✅ Generate exact commands for your server
- ✅ Help configure environment variables
- ✅ Assist with Nginx setup
- ✅ Help troubleshoot if issues arise

### 3. You Execute:

- Follow Cursor's guidance
- Copy-paste commands it provides
- Ask questions if stuck

---

## 🔧 Advanced: Create Deployment Scripts

**You can ask Cursor to create custom scripts:**

```
Create a deployment script that:
1. Connects to my VPS at 93.127.206.164
2. Uploads backend code
3. Installs dependencies
4. Configures environment
5. Starts with PM2
```

**Cursor can generate the exact script for your setup!**

---

## ⚠️ Limitations

**What MCP Integration CAN'T Do:**
- ❌ Directly upload files to server (still need SFTP/Git)
- ❌ Execute commands on server directly (need SSH)
- ❌ Replace manual configuration steps

**What It CAN Do:**
- ✅ Help generate commands
- ✅ Check server status
- ✅ Manage Hostinger services
- ✅ Guide you through deployment
- ✅ Troubleshoot issues

---

## 💡 Pro Tips

### 1. Use Cursor as Your Deployment Assistant

**Instead of:**
- Manually looking up commands
- Guessing what to do next
- Searching documentation

**You can:**
- Ask Cursor: "What's the next step?"
- Get personalized help for YOUR server
- Get exact commands for YOUR setup

### 2. Create Deployment Checklist

**Ask Cursor:**
```
Create a deployment checklist for my GoldApp deployment:
- Server: 93.127.206.164
- Domain: srv1226397.hstgr.cloud (temporary)
- Backend: Node.js/Express
- Frontend: Next.js
```

### 3. Troubleshoot with Cursor

**When something goes wrong:**
```
My backend isn't starting on my VPS. 
Server IP: 93.127.206.164
Help me troubleshoot.
```

**Cursor can:**
- Check common issues
- Generate diagnostic commands
- Guide you to fix problems

---

## 📋 Quick Reference

### Useful Cursor Commands:

```
"Check my Hostinger VPS status"
"Help me deploy my backend to 93.127.206.164"
"Generate deployment commands for my Node.js app"
"Troubleshoot my server connection"
"Create a PM2 startup script for my backend"
"Help me configure Nginx for my domain"
```

---

## 🎯 Recommended Workflow

### 1. **Setup Phase:**
   - Connect Cursor to Hostinger MCP
   - Verify connection works

### 2. **Deployment Phase:**
   - Ask Cursor to guide you through deployment
   - Follow step-by-step instructions
   - Use Cursor to generate commands

### 3. **Monitoring Phase:**
   - Ask Cursor to check server status
   - Get help troubleshooting
   - Monitor deployment progress

---

## ✅ Summary

**With Hostinger MCP Integration:**

1. ✅ **Easier Deployment:** Cursor can guide you through each step
2. ✅ **Personalized Help:** Commands tailored to YOUR server
3. ✅ **Faster Troubleshooting:** Get help when things go wrong
4. ✅ **Server Management:** Check status, manage domains
5. ✅ **Better Workflow:** All in one place (Cursor IDE)

**You still need to:**
- Upload code (FileZilla/Git)
- Execute commands (SSH)
- Configure files manually

**But Cursor makes it:**
- Easier to know what to do
- Faster to get the right commands
- Simpler to troubleshoot issues

---

## 


🚀 Next Steps

1. **Get your Hostinger API token**
2. **Configure Cursor with the JSON above**
3. **Restart Cursor**
4. **Test the connection**
5. **Start deploying with Cursor's help!**

**Now you can deploy with Cursor as your intelligent assistant!** 🎉

