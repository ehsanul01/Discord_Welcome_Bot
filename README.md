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

##  Installation

```bash
npm init -y
npm install discord.js mongoose dotenv
