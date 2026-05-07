/*
 * script to deploy slash commands to discord
 *
 * - reads all command files from the "slash_commands" folder
 * - sends them to discord using the REST API
 * - replaces all existing application (global) commands
 *
 * run this manually whenever you add, remove, or modify a slash command
 */

import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { pathToFileURL } from "url";
import {REST, Routes} from 'discord.js';

const commands = [];

const token = process.env["DISCORD_BOT_TOKEN"];
if (!token) {
    console.error("DISCORD_BOT_TOKEN is required but was not set.");
    process.exit(1);
}

const commandsPath = path.join(process.cwd(), 'slash_commands');
const commandsFiles = fs.readdirSync(commandsPath).filter(file => ['.ts', '.js'].some(ext => file.endsWith(ext)));
console.log('commands files:', commandsFiles);
for (const file of commandsFiles) {
    const fileUrl = pathToFileURL(path.join(commandsPath, file)).href;
    const imported = await import(fileUrl);
    const cmd = imported.default ?? imported;

    if (cmd.data) {
        commands.push(cmd.data.toJSON());
        console.log(cmd.data.toJSON());
    }
}

const rest = new REST().setToken(token);

(async () => {
    try {
        console.log('Deploying slash commands...');

        await rest.put(
            Routes.applicationCommands('1485724088486985778'),
            { body: commands }
        );

        console.log('Slash commands deployed!');
    } catch (error) {
        console.error(error);
    }
})();