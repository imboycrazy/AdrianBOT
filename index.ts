import 'dotenv/config';
import {
  Client,
  GatewayIntentBits,
  Events,
  ActivityType,
  Collection,
  type Message,
} from "discord.js";
import {
  pingResponses,
  getRandomResponse,
} from "./responses.js";
import fs from 'fs';
import path from 'path';
import { pathToFileURL, fileURLToPath } from "url";

const token = process.env["DISCORD_BOT_TOKEN"];

if (!token) {
  console.error("DISCORD_BOT_TOKEN is required but was not set.");
  process.exit(1);
}

class myClient extends Client {
  public slashCommands = new Collection<string, any>();
  public chatCommands = new Collection<string, any>();
}

const client = new myClient({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// prefix used for all chat commands
const prefix = '!';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// get chat commands
const chat_commandsPath = path.join(__dirname, "chat_commands");
const chat_commandsFiles = fs.readdirSync(chat_commandsPath).filter(file => ['.ts', '.js'].some(ext => file.endsWith(ext)));
for (const file of chat_commandsFiles) {
  const imported = await import(pathToFileURL(path.join(chat_commandsPath, file)).href);
  const command = imported.default ?? imported;

  if ('name' in command && 'execute' in command) {
    client.chatCommands.set(command.name, command);
  } else {
    console.log(`Invalid command structure: "${file}"`);
  }
}

// get slash commands
const slash_commandsPath = path.join(__dirname, "slash_commands");
const slash_commandsFiles = fs.readdirSync(slash_commandsPath).filter(file => ['.ts', '.js'].some(ext => file.endsWith(ext)));
for (const file of slash_commandsFiles) {
  const imported = await import(pathToFileURL(path.join(slash_commandsPath, file)).href);
  const command = imported.default ?? imported;

  if ('data' in command && 'execute' in command) {
    client.slashCommands.set(command.data.name, command);
  } else {
    console.log(`Invalid command structure: "${file}"`);
  }
}

client.once(Events.ClientReady, async (readyClient) => {
  console.log(`AdrianBOT is online! Logged in as ${readyClient.user.tag}`);
  console.log(`Bot ID: ${readyClient.user.id}`);
  console.log(
    "NOTE: To enable !adrian and !askadrian text commands, enable 'Message Content Intent' in the Discord Developer Portal → your bot → Bot → Privileged Gateway Intents.",
  );

  // status
  readyClient.user.setActivity('Low Rise Jeans', { type: ActivityType.Listening });
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on(Events.MessageCreate, async (message: Message) => {
  if (message.author.bot) return;

  const isMentioned =
    client.user !== null && message.mentions.has(client.user);
  const content = message.content?.trim() ?? "";
  const contentLower = content.toLowerCase();

  if (isMentioned) {
    const response = getRandomResponse(pingResponses);
    await message.reply(response);
    return;
  }

  if (!contentLower.startsWith(prefix)) return;

  const args = content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift()?.toLowerCase();
  if (!commandName) return;
  const notSlicedArgs = content.slice(prefix.length + commandName.length).trim();

  const command = client.chatCommands.get(commandName);
  if (!command) return;

  try {
    await command.execute(message, args, notSlicedArgs);
  } catch (error) {
    console.error(`Error executing ${commandName}:`, error);
    await message.reply('An error occurred during command execution.');
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const commandName = interaction.commandName;
  const command = client.slashCommands.get(commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(`Error executing ${commandName}:`, error);

    await interaction.reply({
      content: 'An error occurred during command execution.',
      ephemeral: true,
    })
  }
});

client.login(token);
