const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const configPath = path.join(__dirname, '../../../config.json');

module.exports = {
    category: 'moderation',
    modOnly: true,
    data: new SlashCommandBuilder()
        .setName('setroles')
        .setDescription('Update administrative role configurations')
        .addRoleOption(option => 
            option.setName('admin')
            .setDescription('The role that will have full administrator powers')
            .setRequired(true))
        .addRoleOption(option => 
            option.setName('moderator')
            .setDescription('The role that will have moderation powers')
            .setRequired(true)),
    async execute(interaction, client) {
        const adminRole = interaction.options.getRole('admin');
        const modRole = interaction.options.getRole('moderator');

        try {
            const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
            config.roles.admin = adminRole.id;
            config.roles.moderator = modRole.id;
            fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

            const embed = new EmbedBuilder()
                .setTitle('👤 Administrative Roles Updated')
                .setColor('#D4AF37')
                .addFields(
                    { name: '┃ Admin Role', value: `» ${adminRole}`, inline: true },
                    { name: '┃ Moderator Role', value: `» ${modRole}`, inline: true }
                )
                .setFooter({ text: 'Administrative Protocol Updated' })
                .setTimestamp();
            
            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            const errorEmbed = new EmbedBuilder().setColor('#D4AF37').setDescription('» ⚠️ Failed to update role configuration.');
            await interaction.editReply({ embeds: [errorEmbed], ephemeral: false });
        }
    },
};
