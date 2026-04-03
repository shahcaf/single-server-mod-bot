const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    category: 'general',
    data: new SlashCommandBuilder()
        .setName('cmd')
        .setDescription('Shows all available commands organized by category'),
    async execute(interaction, client) {
        const embed = this.getMainEmbed(interaction, client);
        const row = this.getCategoryButtons(interaction.user);

        await interaction.editReply({ embeds: [embed], components: [row] });
    },

    getMainEmbed(interaction, client) {
        return new EmbedBuilder()
            .setTitle('✧ Command Center')
            .setDescription('Welcome to your premium administrative suite. Orchestrate your server with elegance and precision.')
            .setColor('#D4AF37')
            .addFields({ name: '┃ Status', value: '» Online & Ready', inline: true })
            .setThumbnail(client.user.displayAvatarURL())
            .setFooter({ text: `EST. ${interaction.guild.name.toUpperCase()}`, iconURL: interaction.guild.iconURL() })
            .setTimestamp();
    },

    getCategoryButtons(user) {
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('help_general')
                .setLabel('General')
                .setEmoji('💠')
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId('help_moderation')
                .setLabel('Security')
                .setEmoji('🛡️')
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId('help_tickets')
                .setLabel('Support')
                .setEmoji('✉️')
                .setStyle(ButtonStyle.Secondary)
        );

        if (user.id === process.env.DEV_ID) {
            row.addComponents(
                new ButtonBuilder()
                    .setCustomId('help_developer')
                    .setLabel('Terminal')
                    .setEmoji('⚙️')
                    .setStyle(ButtonStyle.Danger)
            );
        }

        return row;
    },

    async handleButton(interaction, client) {
        if (!interaction.customId.startsWith('help_')) return;

        const category = interaction.customId.split('_')[1];
        const commands = client.commands.filter(cmd => cmd.category === category);
        const categoryLabels = { 'moderation': 'Security', 'general': 'General', 'tickets': 'Support', 'developer': 'Terminal' };
        const categoryIcons = { 'moderation': '🛡️', 'general': '💠', 'tickets': '✉️', 'developer': '⚙️' };

        const embed = new EmbedBuilder()
            .setTitle(`${categoryIcons[category] || '✧'} ${categoryLabels[category] || 'Module'}`)
            .setColor('#D4AF37')
            .setDescription(commands.map(cmd => `┃ \`/${cmd.data.name}\` » ${cmd.data.description}`).join('\n') || '» No tools available in this suite.')
            .setFooter({ text: `EST. ${interaction.guild.name.toUpperCase()}`, iconURL: interaction.guild.iconURL() })
            .setTimestamp();

        const row = this.getCategoryButtons(interaction.user);
        await interaction.update({ embeds: [embed], components: [row] });
    }
};
