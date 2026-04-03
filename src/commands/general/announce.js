const { SlashCommandBuilder, EmbedBuilder, ChannelType } = require('discord.js');

module.exports = {
    category: 'general',
    modOnly: true,
    data: new SlashCommandBuilder()
        .setName('announce')
        .setDescription('Create a professional gold-styled announcement')
        .addChannelOption(option => 
            option.setName('channel')
            .setDescription('The channel to send the announcement in')
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true))
        .addStringOption(option => option.setName('title').setDescription('The title of the announcement').setRequired(true))
        .addStringOption(option => option.setName('message').setDescription('The message content').setRequired(true))
        .addStringOption(option => option.setName('image').setDescription('Optional image URL for the announcement').setRequired(false)),
    async execute(interaction, client) {
        const channel = interaction.options.getChannel('channel');
        const title = interaction.options.getString('title');
        const message = interaction.options.getString('message').replace(/\\n/g, '\n');
        const image = interaction.options.getString('image');

        const announceEmbed = new EmbedBuilder()
            .setTitle(`✦ ${title}`)
            .setColor('#D4AF37')
            .setDescription(message)
            .setFooter({ text: 'Official Announcement from Administration', iconURL: interaction.guild.iconURL() })
            .setTimestamp();

        if (image && image.startsWith('http')) {
            announceEmbed.setImage(image);
        }

        try {
            await channel.send({ embeds: [announceEmbed] });
            await interaction.editReply({ content: `» Announcement has been broadcast successfully to ${channel}.`, ephemeral: false });
        } catch (error) {
            console.error(error);
            await interaction.editReply({ content: '❌ Failed to send announcement. Please check my permissions in that channel.', ephemeral: false });
        }
    },
};
