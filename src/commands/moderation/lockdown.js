const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    category: 'moderation',
    modOnly: true,
    data: new SlashCommandBuilder()
        .setName('lockdown')
        .setDescription('Locks all text channels in the server')
        .addStringOption(option => option.setName('reason').setDescription('Reason for the lockdown').setRequired(false)),
    async execute(interaction, client) {
        const reason = interaction.options.getString('reason') ?? 'Emergency Maintenance';
        

        const channels = interaction.guild.channels.cache.filter(c => c.isTextBased() && c.type === 0);
        let count = 0;

        for (const [id, channel] of channels) {
            try {
                await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
                    SendMessages: false
                }, { reason: `Lockdown by ${interaction.user.tag}` });
                count++;
            } catch(e) {
                console.error(`Failed to lock ${channel.name}`);
            }
        }

        const embed = new EmbedBuilder()
            .setTitle('☣️ Server-Wide Lockdown')
            .setColor('#D4AF37')
            .setDescription(`┃ All **${count}** text channels have been successfully sealed.\n**Reason:** ${reason}`)
            .setFooter({ text: 'Administrative Command: Protocol Delta' })
            .setTimestamp();

        await interaction.followUp({ embeds: [embed] });
    },
};
