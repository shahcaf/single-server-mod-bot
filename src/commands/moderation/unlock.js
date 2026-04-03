const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    modOnly: true,
    data: new SlashCommandBuilder()
        .setName('unlock')
        .setDescription('Unlock the current channel')
        .addStringOption(option => option.setName('reason').setDescription('Reason for unlocking').setRequired(false)),
    async execute(interaction, client) {
        const reason = interaction.options.getString('reason') ?? 'No reason provided';

        try {
            await interaction.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
                SendMessages: null
            }, { reason });

            const embed = new EmbedBuilder()
                .setTitle('🔓 Channel Unlocked')
                .setColor('#D4AF37')
                .setDescription(`This channel has been unlocked.\n**Reason:** ${reason}`)
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            const errorEmbed = new EmbedBuilder().setColor('#D4AF37').setDescription('❌ Failed to unlock this channel. Please check my permissions.');
            await interaction.editReply({ embeds: [errorEmbed], ephemeral: false });
        }
    },
};
