const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    category: 'moderation',
    modOnly: true,
    data: new SlashCommandBuilder()
        .setName('unlockdown')
        .setDescription('Unlocks all text channels in the server'),
    async execute(interaction, client) {
        

        const channels = interaction.guild.channels.cache.filter(c => c.isTextBased() && c.type === 0);
        let count = 0;

        for (const [id, channel] of channels) {
            try {
                await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
                    SendMessages: null
                }, { reason: `Unlockdown by ${interaction.user.tag}` });
                count++;
            } catch(e) {
                console.error(`Failed to unlock ${channel.name}`);
            }
        }

        const embed = new EmbedBuilder()
            .setTitle('🔓 Server Lockdown Lifted')
            .setColor('#D4AF37')
            .setDescription(`┃ All **${count}** text channels have been successfully restored.`)
            .setFooter({ text: 'Administrative Protocol: Status Green' })
            .setTimestamp();

        await interaction.followUp({ embeds: [embed] });
    },
};
