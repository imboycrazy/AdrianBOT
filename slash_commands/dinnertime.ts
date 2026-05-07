import {type ChatInputCommandInteraction, SlashCommandBuilder} from "discord.js";
import { dinnerAnswers, getRandomResponse} from "../responses.js";

export default {
    data: new SlashCommandBuilder()
        .setName("dinnertime")
        .setDescription("Ask AdrianBOT what's for dinner"),

    async execute(interaction: ChatInputCommandInteraction) {
        const answer = getRandomResponse(dinnerAnswers);
        await interaction.reply(answer);
    }
}