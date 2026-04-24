import {
  Client,
  GatewayIntentBits,
  Events,
  REST,
  Routes,
  SlashCommandBuilder,
  EmbedBuilder,
  ActivityType,
  type ChatInputCommandInteraction,
  type Message,
} from "discord.js";
import {
  pingResponses,
  commandResponses,
  askAdrianAnswers,
  dinnerAnswers,
  getRandomResponse,
} from "./responses.js";

const token = process.env["DISCORD_BOT_TOKEN"];

if (!token) {
  console.error("DISCORD_BOT_TOKEN is required but was not set.");
  process.exit(1);
}

const commands = [
  new SlashCommandBuilder()
    .setName("adrian")
    .setDescription("Call upon AdrianBOT for a response"),
  new SlashCommandBuilder()
    .setName("askadrian")
    .setDescription("Ask AdrianBOT a question and get an answer")
    .addStringOption((option) =>
      option
        .setName("question")
        .setDescription("The question you want to ask")
        .setRequired(true),
    ),
  new SlashCommandBuilder()
    .setName("dinnertime")
    .setDescription("Ask AdrianBOT what's for dinner"),
  new SlashCommandBuilder()
    .setName("sendmsg")
    .setDescription("Send a private message to someone via AdrianBOT")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to send the message to")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("The message to send")
        .setRequired(true),
    ),
];

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
  ],
});

client.once(Events.ClientReady, async (readyClient) => {
  console.log(`AdrianBOT is online! Logged in as ${readyClient.user.tag}`);
  console.log(`Bot ID: ${readyClient.user.id}`);
  console.log(
    "NOTE: To enable !adrian and !askadrian text commands, enable 'Message Content Intent' in the Discord Developer Portal → your bot → Bot → Privileged Gateway Intents.",
  );

  const rest = new REST().setToken(token!);
  try {
    console.log("Registering slash commands...");
    await rest.put(Routes.applicationCommands(readyClient.user.id), {
      body: commands.map((cmd) => cmd.toJSON()),
    });
    console.log("Slash commands registered successfully!");
  } catch (err) {
    console.error("Failed to register slash commands:", err);
  }
});

function buildAskEmbed(question: string): EmbedBuilder {
  const answer = getRandomResponse(askAdrianAnswers);
  return new EmbedBuilder()
    .setColor(0xff69b4)
    .addFields(
      { name: "**Asked Question:**", value: question },
      { name: "**Answer:**", value: answer },
    );
}

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

  if (contentLower.startsWith("!askadrian")) {
    const question = content.slice("!askadrian".length).trim();
    if (!question) {
      await message.reply("You need to ask me something! e.g. `!askadrian will I be rich?`");
      return;
    }
    const embed = buildAskEmbed(question);
    await message.reply({ embeds: [embed] });
    return;
  }

  if (contentLower.startsWith("!adrian")) {
    const response = getRandomResponse(commandResponses);
    await message.reply(response);
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  const cmd = interaction as ChatInputCommandInteraction;

  if (cmd.commandName === "adrian") {
    const response = getRandomResponse(commandResponses);
    await cmd.reply(response);
  }

  if (cmd.commandName === "askadrian") {
    const question = cmd.options.getString("question", true);
    const embed = buildAskEmbed(question);
    await cmd.reply({ embeds: [embed] });
  }

  if (cmd.commandName === "dinnertime") {
    const answer = getRandomResponse(dinnerAnswers);
    await cmd.reply(answer);
  }

  if (cmd.commandName === "sendmsg") {
    if (cmd.user.id !== "1178243446817955933") {
      await cmd.reply({
        content: "You don't have permission to use this command.",
        ephemeral: true,
      });
      return;
    }

    const targetUser = cmd.options.getUser("user", true);
    const messageText = cmd.options.getString("message", true);

    try {
      await targetUser.send(messageText);
      await cmd.reply({
        content: `Message sent to **${targetUser.username}** 📬`,
        ephemeral: true,
      });
    } catch {
      await cmd.reply({
        content: `Couldn't send a message to **${targetUser.username}**. They may have DMs disabled.`,
        ephemeral: true,
      });
    }
  }
});

client.once(Events.ClientReady, (c) => {
    c.user.setActivity('Low Rise Jeans', { type: ActivityType.Listening });
    console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.login(token);
