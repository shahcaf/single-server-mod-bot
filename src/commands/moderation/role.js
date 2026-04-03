const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    category: 'moderation',
    modOnly: true,
    data: new SlashCommandBuilder()
        .setName('role')
        .setDescription('Add or remove a role from a user')
        .addUserOption(option => option.setName('target').setDescription('The user to modify').setRequired(true))
        .addRoleOption(option => option.setName('role').setDescription('The role to assign/remove').setRequired(true)),
    async execute(interaction, client) {
        
        const target = interaction.options.getMember('target');
        const role = interaction.options.getRole('role');

        const errorEmbed = (msg) => new EmbedBuilder().setColor('#D4AF37').setDescription(`» » ⚠️ ${msg}`);
        
        if (!target) return interaction.followUp({ embeds: [errorEmbed('User not found in this guild.')] });

        if (!interaction.guild.members.me.permissions.has('ManageRoles')) {
            return interaction.followUp({ embeds: [errorEmbed('I do not have the **Manage Roles** permission.')] });
        }

        if (role.position >= interaction.guild.members.me.roles.highest.position) {
            return interaction.followUp({ embeds: [errorEmbed('I cannot manage this role as it is above my own.')] });
        }

        try {
            if (target.roles.cache.has(role.id)) {
                await target.roles.remove(role, `Authorized by ${interaction.user.tag}`);
                
                const embed = new EmbedBuilder()
                    .setTitle('🏷️ Role Removed')
                    .setColor('#D4AF37')
                    .setDescription(`┃ **${target.user.tag}** has been successfully removed from ${role}.`)
                    .setFooter({ text: 'Administrative Metadata Updated' })
                    .setTimestamp();
                
                await interaction.followUp({ embeds: [embed] });
            } else {
                await target.roles.add(role, `Authorized by ${interaction.user.tag}`);
                
                const embed = new EmbedBuilder()
                    .setTitle('🏷️ Role Assigned')
                    .setColor('#D4AF37')
                    .setDescription(`┃ **${target.user.tag}** has been successfully assigned the role ${role}.`)
                    .setFooter({ text: 'Administrative Metadata Updated' })
                    .setTimestamp();
                
                await interaction.followUp({ embeds: [embed] });
            }
        } catch (error) {
            console.error(error);
            await interaction.followUp({ embeds: [errorEmbed('There was a technical error managing roles for this user.')] });
        }
    },
};
