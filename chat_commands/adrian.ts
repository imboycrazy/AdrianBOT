import {Message} from "discord.js";
import {commandResponses, getRandomResponse} from "../responses.js";

export default {
    name: 'adrian',
    execute: async (message: Message) => {
        const response = getRandomResponse(commandResponses);
        await message.reply(response);
    }
}