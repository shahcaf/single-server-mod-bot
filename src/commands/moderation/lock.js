const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    modOnly: true,
    data: new SlashCommandBuilder()
        .setName('lock')
        .setDescription('Lock the current channel')
        .addStringOption(option => option.setName('reason').setDescription('Reason for locking').setRequired(false)),
    async execute(interaction, client) {
        const reason = interaction.options.getString('reason') ?? 'No reason provided';

        try {
            await interaction.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
                SendMessages: false
            }, { reason });

            const embed = new EmbedBuilder()
                .setTitle('🔒 Channel Locked')
                .setColor('#D4AF37')
                .setDescription(`This channel has been locked.\n**Reason:** ${reason}`)
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            const errorEmbed = new EmbedBuilder().setColor('#D4AF37').setDescription('❌ Failed to lock this channel. Please check my permissions.');
            await interaction.editReply({ embeds: [errorEmbed], ephemeral: false });
        }
    },
};
