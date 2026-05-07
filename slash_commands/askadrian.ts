import {type ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder} from "discord.js";
import {askAdrianAnswers, getRandomResponse} from "../responses.js";

export default {
    data: new SlashCommandBuilder()
        .setName("askadrian")
        .setDescription("Ask AdrianBOT a question and get an answer")
        .addStringOption((option) =>
            option
                .setName("question")
                .setDescription("The question you want to ask")
                .setRequired(true),
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        const question = interaction.options.getString("question", true);

        const answer = getRandomResponse(askAdrianAnswers);
        const embed = new EmbedBuilder()
            .setColor(0xff69b4)
            .addFields(
                { name: "**Asked Question:**", value: question },
                { name: "**Answer:**", value: answer },
            );

        await interaction.reply({ embeds: [embed] });
    }
}