const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    category: 'general',
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('Shows info about a user')
        .addUserOption(option => option.setName('target').setDescription('The user to check').setRequired(false)),
    async execute(interaction, client) {
        
        const user = interaction.options.getUser('target') || interaction.user;
        const member = await interaction.guild.members.fetch(user.id);

        const roles = member.roles.cache
            .filter(role => role.id !== interaction.guild.id)
            .map(role => role.toString())
            .join(', ') || 'No roles.';

        const userinfoEmbed = new EmbedBuilder()
            .setColor('#D4AF37')
            .setTitle(`👤 Info for ${user.tag}`)
            .setThumbnail(user.displayAvatarURL())
            .addFields(
                { name: 'ID', value: `\`${user.id}\``, inline: true },
                { name: 'Joined Discord', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`, inline: true },
                { name: 'Joined Server', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`, inline: true },
                { name: 'Highest Role', value: `${member.roles.highest}`, inline: true },
                { name: 'Member Since', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:F>`, inline: false },
                { name: 'Roles', value: roles }
            )
            .setTimestamp();

        await interaction.editReply({ embeds: [userinfoEmbed] });
    },
};
