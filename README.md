# 🛡️ Single-Server Mod Bot

[![Render Status](https://img.shields.io/badge/Deploy-Render-4643CC?logo=render&logoColor=white)](https://render.com)
[![Discord.js](https://img.shields.io/badge/discord.js-v14-blue)](https://discord.js.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A high-performance, modular moderation bot designed specifically for **Single Server (Guild) Deployment**. Optimized for speed, reliability, and instant slash command updates.

## ✨ Features

- ⚡ **Instant Command Sync**: Dedicated to one guild for lightning-fast slash command loading.
- 📂 **Modular Architecture**: Commands, events, and utilities are fully separated for easy expansion.
- 🛡️ **Advanced Auto-Mod**: Detects spam, caps, bad words, and malicious links.
- 🎫 **Ticket System**: Built-in ticket creation with automatic transcript saving.
- 📊 **SQLite Persistence**: Local storage powered by `sql.js` (WebAssembly) for maximum compatibility.
- ⚙️ **Developer Portal Integration**: Built-in maintenance mode and hot-reloading commands.

## 🚀 Quick Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/shahcaf/single-server-mod-bot.git
   cd single-server-mod-bot
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file from the `.env.example` template:
   ```env
   BOT_TOKEN=your_bot_token
   CLIENT_ID=your_client_id
   GUILD_ID=your_guild_id
   PORT=3000
   ```

4. **Launch the Bot**:
   ```bash
   npm start
   ```

## ☁️ Deployment

### Render.com (Recommended)
This bot includes a `render.yaml` file for effortless deployment:
1. Push your code to GitHub.
2. Go to [Render Dashboard](https://dashboard.render.com).
3. Connect your repository under **Blueprints** or **Web Services**.
4. Set the following environment variables:
   - `BOT_TOKEN`
   - `CLIENT_ID`
   - `GUILD_ID`
5. (Optional) Use [UptimeRobot](https://uptimerobot.com) to ping your service URL to prevent it from sleeping on the free tier.

## 📁 Project Structure

```bash
├── src
│   ├── commands    # Slash commands grouped by category
│   ├── events      # Event handlers (messageCreate, ready, etc.)
│   ├── handlers    # Dynamic loaders for commands and events
│   ├── database    # SQLite connection and schema logic
│   └── utils       # Shared utilities (embeds, logs, autonomous checks)
├── data            # Persistent database storage
├── index.js        # Main entry point and Express server
└── render.yaml     # Render Blueprint configuration
```

## 🛠️ Requirements

- [Node.js](https://nodejs.org/) v16.9 or higher.
- A Discord Bot Application with **Message Content** and **Server Members** Intents.

## 📜 License

Distributed under the [MIT License](LICENSE).
