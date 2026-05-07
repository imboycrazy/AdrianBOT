import {askAdrianAnswers, getRandomResponse} from "../responses.js";
import {EmbedBuilder, type Message} from "discord.js";

export default {
    name: 'askadrian',
    execute: async (message: Message, args: string[], notSlicedArgs: string) => {
        const question = notSlicedArgs;
        if (!question) {
            await message.reply("You need to ask me something! e.g. `!askadrian will I be rich?`");
            return;
        }
        const answer = getRandomResponse(askAdrianAnswers);
        const embed = new EmbedBuilder()
            .setColor(0xff69b4)
            .addFields(
                { name: "**Asked Question:**", value: question },
                { name: "**Answer:**", value: answer },
            );
        await message.reply({ embeds: [embed] });
    }
}