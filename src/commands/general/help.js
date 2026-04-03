const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    category: 'general',
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Shows all available commands organized by category'),
    async execute(interaction, client) {
        const cmdFile = require('./cmd.js');
        await cmdFile.execute(interaction, client);
    },
};
