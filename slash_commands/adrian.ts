import {type ChatInputCommandInteraction, SlashCommandBuilder} from "discord.js";
import {commandResponses, getRandomResponse} from "../responses.js";

export default {
    data: new SlashCommandBuilder()
        .setName("adrian")
        .setDescription("Call upon AdrianBOT for a response"),

    async execute(interaction: ChatInputCommandInteraction) {
        const response = getRandomResponse(commandResponses);
        await interaction.reply(response);
    }
}