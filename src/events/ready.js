const { REST, Routes, ActivityType } = require('discord.js');
require('dotenv').config();

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log(`[Ready] Logged in as ${client.user.tag}`);

        // Set status
        client.user.setPresence({
            activities: [{ name: 'made by r4z_x', type: ActivityType.Playing }],
            status: 'online',
        });

        const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);
        
        try {
            if (!process.env.GUILD_ID || process.env.GUILD_ID.includes('YOUR')) {
                console.warn('[Deploy] Warning: GUILD_ID is missing or set to a placeholder.');
                return;
            }

            console.log(`[Deploy] Started refreshing ${client.commandArray.length} guild (/) commands.`);
            await rest.put(
                Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
                { body: client.commandArray },
            );
            console.log(`[Deploy] Successfully reloaded guild (/) commands.`);
        } catch (error) {
            console.error(`[Deploy] Failed guild deploy: ${error.message}`);
            if (error.code === 50001) {
                console.error('[Deploy] Fix: Make sure the bot is invited with the "applications.commands" scope.');
            }
            
            console.log(`[Deploy] Falling back to global deployment...`);
            try {
                await rest.put(
                    Routes.applicationCommands(process.env.CLIENT_ID),
                    { body: client.commandArray },
                );
                console.log(`[Deploy] Successfully reloaded GLOBAL (/) commands.`);
            } catch (err) {
                console.error(`[Deploy] Failed global deploy:`, err);
            }
        }
    },
};
