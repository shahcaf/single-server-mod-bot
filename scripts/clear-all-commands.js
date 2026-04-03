require('dotenv').config();
const { REST, Routes } = require('discord.js');

const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

(async () => {
    try {
        console.log('Started clearing all Slash Commands...');

        // Clear Global
        await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: [] });
        console.log('Successfully cleared all GLOBAL (/) commands.');

        // Clear Guild
        await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: [] });
        console.log('Successfully cleared all GUILD (/) commands.');

        console.log('Bot is now clean. You can restart the bot to re-register commands.');
    } catch (error) {
        console.error(error);
    }
})();
