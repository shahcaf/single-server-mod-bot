const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    category: 'general',
    data: new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('Shows info about the server'),
    async execute(interaction, client) {
        const { guild } = interaction;
        const { members, channels, roles } = guild;

        const serverinfoEmbed = new EmbedBuilder()
            .setColor('#D4AF37')
            .setAuthor({ name: `${guild.name}`, iconURL: guild.iconURL() })
            .setTitle(`🏢 Info for ${guild.name}`)
            .setThumbnail(guild.iconURL())
            .addFields(
                { name: 'Server Owner', value: `<@${guild.ownerId}>`, inline: true },
                { name: 'Main Category', value: `${guild.id}`, inline: true },
                { name: 'Created At', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:R>`, inline: true },
                { name: 'Total Roles', value: `${roles.cache.size}`, inline: true },
                { name: 'Total Members', value: `${guild.memberCount}`, inline: true },
                { name: 'Total Channels', value: `${channels.cache.size}`, inline: true }
            )
            .setTimestamp();

        await interaction.editReply({ embeds: [serverinfoEmbed] });
    },
};
