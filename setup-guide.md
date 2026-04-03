# Single-Server Mod Bot - Setup Guide

Welcome to your new Single-Server Moderation Bot! This bot is designed to be purely modular, highly efficient, and only registers commands natively to **ONE** guild (server) for instant command refreshing.

## Prerequisites
- **Node.js**: Version 16.9.0 or higher.
- **Discord Bot Token**: Create an application on the [Discord Developer Portal](https://discord.com/developers/applications).
- Ensure your bot has the **Message Content, Server Members, and Presence Intents** enabled in the Developer Portal.

---

## 1) Configuration
Before starting the bot, you need to configure your `.env` and `config.json` files.

### The `.env` file
Duplicate the `.env.example` file and rename it to `.env`. Fill in the values:
```env
BOT_TOKEN=your_bot_token
CLIENT_ID=your_bot_application_id
GUILD_ID=your_server_id
PORT=3000
```

### The `config.json` file
Open `config.json` and insert your specific IDs:
- **roles.admin / roles.moderator**: IDs for your moderation team. They bypass auto-mod and can run moderation commands.
- **channels.modLogs**: ID for where you want kicks/bans/warns/transcripts sent.
- **tickets.categoryId**: Category ID where new ticket channels will be created.
- **tickets.supportRole**: The role that gets pinged/has access to new tickets.

---

## 2) Running Locally
1. Open a terminal in the folder.
2. Run `npm install` to gather the necessary packages.
3. Run `npm start` (or `node index.js`).
4. If configured properly, the bot will log in and you'll see `[Ready] Logged in as YOUR_BOT_NAME` and `[Deploy] Successfully reloaded guild (/) commands`.

---

## 3) Hosting on a VPS (Recommended for 24/7)
If you have a Linux VPS (Ubuntu/Debian):
1. Connect via SSH.
2. Install Node.js (`sudo apt install nodejs npm`).
3. Screen or PM2 is recommended to keep it alive:
   - `npm install -g pm2`
   - `pm2 start index.js --name modbot`
4. The bot will now run constantly in the background.

---

## 4) Hosting on Free Services (Render/Railway)
This bot includes a built-in Express server specifically to keep it alive on free hosting platforms.
1. Push your code to a GitHub repository.
2. Connect your GitHub to Render/Railway.
3. Use the start command: `npm start`
4. Make sure to set your **Environment Variables** (BOT_TOKEN, CLIENT_ID, GUILD_ID) in their respective dashboards.
5. Set up an exact ping using [UptimeRobot](https://uptimerobot.com) pointing to the URL of your app in Render/Railway. This prevents the bot from sleeping.

---

### Need help?
The code uses `better-sqlite3` which saves locally. Be aware that on Ephemeral File Systems (like Render's free tier), that data will reset on redeployment unless you attach a persistent disk. For full permanence, a small VPS is highly recommended.
