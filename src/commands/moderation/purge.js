const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    modOnly: true,
    data: new SlashCommandBuilder()
        .setName('purge')
        .setDescription('Bulk delete messages')
        .addIntegerOption(option => 
            option.setName('amount')
            .setDescription('Number of messages to delete (1-100)')
            .setRequired(true)
            .setMinValue(1)
            .setMaxValue(100)
        ),
    async execute(interaction, client) {
        const amount = interaction.options.getInteger('amount');

        try {
            const deleted = await interaction.channel.bulkDelete(amount, true);
            const embed = new EmbedBuilder()
                .setColor('#D4AF37')
                .setDescription(`🧹 Successfully deleted **${deleted.size}** messages.`);
            
            await interaction.editReply({ embeds: [embed], ephemeral: false });
        } catch (error) {
            console.error(error);
            const errorEmbed = new EmbedBuilder().setColor('#D4AF37').setDescription('❌ There was an error trying to purge messages in this channel.');
            await interaction.editReply({ embeds: [errorEmbed], ephemeral: false });
        }
    },
};
