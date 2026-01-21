# Discord Welcome Bot (Multi-Server & Customizable)

A powerful **Discord Welcome Bot** that works in **multiple servers**, stays **online 24/7**, and allows **each server owner to customize**:
- Welcome channel
- Welcome message
- Welcome DM
- Auto-role on join
- Enable / disable system per server

Built with **Node.js**, **discord.js v14**, and **MongoDB**.

---

##  Features

- Multi-server support
- Per-server customization
- Slash commands (`/welcome`)
- Welcome message in a channel
- Optional welcome DM
- Optional auto-role
- Persistent settings (MongoDB)
- Production-ready
- One-file setup

---

##  Project Structure (One-File Version)
welcome-bot/

├── index.js        # Full bot code (single file)

├── package.json


├── .env            # Environment variables (DO NOT SHARE)

---

##  Requirements

- Node.js **v18+**
- A Discord Bot Token
- MongoDB database (MongoDB Atlas recommended)

---

## Discord Bot Setup

1. Go to **Discord Developer Portal**
2. Create a new application
3. Go to **Bot**
4. Enable:
   -  Server Members Intent
5. Copy:
   - **Bot Token**
   - **Application (Client) ID**

---

###  Enable required intents
In **Bot → Privileged Gateway Intents**, enable:
-  **Server Members Intent**

Click **Save Changes**

---

###  Get Discord credentials

#### DISCORD_TOKEN
- Go to **Bot**
- Click **Reset Token**
- Copy the token

#### DISCORD_CLIENT_ID
- Go to **General Information**
- Copy **Application ID**

---

###  Invite the bot to your server
1. Go to **OAuth2 → URL Generator**
2. Select scopes:
   - ☑️ `bot`
   - ☑️ `applications.commands`
3. Bot permissions:
   - ☑️ Send Messages
   - ☑️ View Channels
   - ☑️ Read Message History
   - ☑️ Manage Roles (optional)
4. Copy the generated URL
5. Open it in your browser
6. Select your server → **Authorize**

---

## 🍃 MongoDB Atlas Setup

###  Create an account
https://www.mongodb.com/atlas

---

###  Create a cluster
- Choose **M0 (FREE)** or **M10**
- Provider: AWS
- Region: closest to you
- Click **Create Deployment**

---

### 3️⃣ Create database user
1. Go to **Security → Database Access**
2. Click **Add New Database User**
3. Username: `welcomeBotUser`
4. Password: generate & save it
5. Privileges:
   - Read and write to any database
6. Save

---

### 4️⃣ Allow network access
1. Go to **Security → Network Access**
2. Click **Add IP Address**
3. Choose **Allow access from anywhere**
4. Confirm

---

### 5️⃣ Get MongoDB connection string
1. Go to **Database**
2. Click **Connect**
3. Choose **Drivers**
4. Driver: **Node.js**
5. Copy the connection string

Replace `<password>` with your real password.

Example:mongodb+srv://welcomeBotUser:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/welcomeBot?retryWrites=true&w=majority

o quotes. No spaces.
## ⚙️ Environment Variables

Create a `.env` file:
---
⚠️ Never commit `.env` to GitHub.

---



##  Installation

```bash
npm init -y
npm install discord.js mongoose dotenv
```



## 🧩 Message Placeholders

| Placeholder | Description |
|------------|------------|
| `{user}` | Mentions the user |
| `{username}` | Username |
| `{tag}` | Username#0000 |
| `{server}` | Server name |
| `{memberCount}` | Total members |


## ❌ Common Errors & Fixes

### MongoDB authentication failed
- Wrong password
- Quotes around password
- Password needs URL encoding

---

### Used disallowed intents
- Enable **Server Members Intent**
- Restart the bot

---

### Slash commands not showing
- Invite bot with `applications.commands`
- Wait 1 minute
- Restart bot

---

##  24/7 Hosting (Optional)

Recommended:
- Railway
- Render
- Fly.io
- VPS (DigitalOcean)
---

## 🔒 Security Tips

- ❌ Never share your Discord token
- ❌ Never commit `.env`
- ✅ Reset token if leaked

---

## 📄 License

MIT License — free to use and modify.

---

## ❤️ Author

**Ehsanul Haque**  
Built with ❤️ using Discord.js & MongoDB
