const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    category: 'general',
    data: new SlashCommandBuilder()
        .setName('memberstats')
        .setDescription('Shows human vs bot stats of the server'),
    async execute(interaction, client) {
        
        const totalUsers = interaction.guild.memberCount;
        const totalBots = interaction.guild.members.cache.filter(m => m.user.bot).size;
        const totalHumans = totalUsers - totalBots;
        
        const statsEmbed = new EmbedBuilder()
            .setTitle(`👤 Current Demographics: ${interaction.guild.name}`)
            .setColor('#D4AF37')
            .addFields(
                { name: '┃ Total Members', value: `» **${totalUsers}**`, inline: false },
                { name: '┃ Humans', value: `👤 **${totalHumans}**`, inline: true },
                { name: '┃ Bots', value: `🤖 **${totalBots}**`, inline: true }
            )
            .setFooter({ text: 'Administrative Statistics Oracle' })
            .setTimestamp();

        await interaction.followUp({ embeds: [statsEmbed] });
    },
};
