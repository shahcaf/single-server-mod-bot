const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const os = require('os');

module.exports = {
    category: 'general',
    data: new SlashCommandBuilder()
        .setName('botinfo')
        .setDescription('Shows technical info about the bot'),
    async execute(interaction, client) {
        const botinfoEmbed = new EmbedBuilder()
            .setTitle(`🤖 Information for ${client.user.username}`)
            .setColor('#D4AF37')
            .setThumbnail(client.user.displayAvatarURL())
            .addFields(
                { name: 'Developer', value: 'r4z_x', inline: true },
                { name: 'Library', value: 'discord.js v14', inline: true },
                { name: 'Node.js', value: process.version, inline: true },
                { name: 'Uptime', value: `<t:${Math.floor(client.readyTimestamp / 1000)}:R>`, inline: true },
                { name: 'Memory Usage', value: `\`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB\``, inline: true },
                { name: 'Server ID', value: `\`${process.env.GUILD_ID}\``, inline: true }
            )
            .setFooter({ text: 'Powered by r4z_x API' })
            .setTimestamp();

        await interaction.editReply({ embeds: [botinfoEmbed] });
    },
};
