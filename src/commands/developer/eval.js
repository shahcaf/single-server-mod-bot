const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    category: 'developer',
    devOnly: true,
    data: new SlashCommandBuilder()
        .setName('eval')
        .setDescription('Evaluate JavaScript code dynamically (Developer Only)')
        .addStringOption(option => option.setName('code').setDescription('The code to evaluate').setRequired(true)),
    async execute(interaction, client) {
        const code = interaction.options.getString('code');
        

        try {
            let evaled = eval(code);

            if (typeof evaled !== 'string') {
                evaled = require('util').inspect(evaled);
            }

            const embed = new EmbedBuilder()
                .setTitle('⚙️ JavaScript Evaluation')
                .setColor('#D4AF37')
                .addFields(
                    { name: '┃ Input', value: `\`\`\`js\n${code}\n\`\`\`` },
                    { name: '┃ Output', value: `\`\`\`js\n${evaled.slice(0, 1000)}\n\`\`\`` }
                )
                .setTimestamp();

            await interaction.followUp({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            const errorEmbed = new EmbedBuilder().setColor('#D4AF37').setDescription(`» ⚠️ Evaluation Failed:\n\`\`\`js\n${error}\n\`\`\``);
            await interaction.followUp({ embeds: [errorEmbed] });
        }
    },
};
