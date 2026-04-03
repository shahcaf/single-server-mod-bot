const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    category: 'moderation',
    modOnly: true,
    data: new SlashCommandBuilder()
        .setName('nuke')
        .setDescription('Completely wipe all messages in this channel'),
    async execute(interaction, client) {
        try {
            const channel = interaction.channel;
            const newChannel = await channel.clone({ 
                reason: `Nuked by ${interaction.user.tag}` 
            });

            await channel.delete(`Nuked by ${interaction.user.tag}`);

            const nukeEmbed = new EmbedBuilder()
                .setColor('#D4AF37')
                .setAuthor({ name: 'Security Protocol: Nuke', iconURL: client.user.displayAvatarURL() })
                .setDescription('» The sector has been irradiated and completely reset.')
                .addFields(
                    { name: '┃ Authorized By', value: `» ${interaction.user}`, inline: true },
                    { name: '┃ Status', value: '» Wiped & Replaced', inline: true }
                )
                .setImage('https://media.giphy.com/media/XUFPGrX5Zis6Y/giphy.gif')
                .setFooter({ text: 'Administrative Authorization Granted' })
                .setTimestamp();

            await newChannel.send({ embeds: [nukeEmbed] }).then(m => {
                setTimeout(() => m.delete().catch(() => null), 15000);
            });
        } catch (error) {
            console.error(error);
            const errorEmbed = new EmbedBuilder().setColor('#D4AF37').setDescription('❌ Failed to nuke this channel. I need permission to manage channels.');
            await interaction.editReply({ embeds: [errorEmbed], ephemeral: false });
        }
    },
};
