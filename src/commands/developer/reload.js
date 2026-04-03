const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const path = require('path');

module.exports = {
    category: 'developer',
    devOnly: true,
    data: new SlashCommandBuilder()
        .setName('reload')
        .setDescription('Reloads a specific command file')
        .addStringOption(option => 
            option.setName('command')
            .setDescription('The name of the command to reload')
            .setRequired(true)),
    async execute(interaction, client) {
        const commandName = interaction.options.getString('command').toLowerCase();
        const command = client.commands.get(commandName);

        if (!command) {
            return interaction.editReply({ content: `❌ There is no command with name \`${commandName}\`.` });
        }

        const category = command.category;
        const commandPath = path.join(__dirname, `../${category}/${command.data.name}.js`);

        delete require.cache[require.resolve(commandPath)];

        try {
            const newCommand = require(commandPath);
            newCommand.category = category; // Re-assign category
            client.commands.set(newCommand.data.name, newCommand);
            
            const successEmbed = new EmbedBuilder()
                .setTitle('⚙️ Module Reloaded')
                .setColor('#D4AF37')
                .setDescription(`┃ Command \`/${commandName}\` has been successfully re-compiled.`)
                .setTimestamp();
            
            await interaction.editReply({ embeds: [successEmbed] });
        } catch (error) {
            console.error(error);
            await interaction.editReply({ content: `❌ Error reloading \`${commandName}\`:\n\`\`\`js\n${error.message}\n\`\`\`` });
        }
    },
};
