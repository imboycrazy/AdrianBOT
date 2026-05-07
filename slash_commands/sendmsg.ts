import {type ChatInputCommandInteraction, SlashCommandBuilder} from "discord.js";

export default {
    data: new SlashCommandBuilder()
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

    async execute(interaction: ChatInputCommandInteraction) {
        if (interaction.user.id !== "1178243446817955933") {
            await interaction.reply({
                content: "You don't have permission to use this command.",
                ephemeral: true,
            });
            return;
        }

        const targetUser = interaction.options.getUser("user", true);
        const messageText = interaction.options.getString("message", true);

        try {
            await targetUser.send(messageText);
            await interaction.reply({
                content: `Message sent to **${targetUser.username}** 📬`,
                ephemeral: true,
            });
        } catch {
            await interaction.reply({
                content: `Couldn't send a message to **${targetUser.username}**. They may have DMs disabled.`,
                ephemeral: true,
            });
        }
    }
}