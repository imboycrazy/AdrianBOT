# AdrianBOT

A Discord bot built with discord.js v14 and TypeScript.

## Commands

- `@AdrianBOT` — mention the bot for a random response
- `!adrian` — text command (requires Message Content Intent)
- `!askadrian <question>` — ask a question via text (requires Message Content Intent)
- `/adrian` — slash command for a random response
- `/askadrian <question>` — ask AdrianBOT a question, get an embed answer
- `/dinnertime` — ask what's for dinner
- `/sendmsg <user> <message>` — DM a user (restricted to one user ID)

## Setup

### 1. Install dependencies

```
npm install
```

### 2. Set your bot token

Create a `.env` file in the root folder:

```
DISCORD_BOT_TOKEN=your_bot_token_here
```

On Railway, set `DISCORD_BOT_TOKEN` as an environment variable in your project settings.

### 3. Run the bot

```
npm start
```

## Optional: Enable text commands (!adrian, !askadrian)

In the Discord Developer Portal → your bot → Bot → Privileged Gateway Intents, enable **Message Content Intent**.

## Deploying to Railway

1. Push this folder to a GitHub repo
2. Create a new project on [railway.app](https://railway.app) and connect your repo
3. Add `DISCORD_BOT_TOKEN` as an environment variable
4. Set the start command to `npm start`
5. Deploy!
