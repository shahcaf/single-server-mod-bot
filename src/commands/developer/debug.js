const { SlashCommandBuilder } = require('discord.js');
const { exec } = require('child_process');

module.exports = {
    category: 'developer',
    devOnly: true,
    data: new SlashCommandBuilder()
        .setName('system')
        .setDescription('Execute a system command for debugging (Developer Only)')
        .addStringOption(option => option.setName('input').setDescription('The command to execute (e.g. ping, dir, etc.)').setRequired(true)),
    async execute(interaction, client) {
        // Defer reply because system commands might take a few seconds
        

        const input = interaction.options.getString('input');

        exec(input, (error, stdout, stderr) => {
            let output = stdout || stderr;
            if (error) {
                output = error.message;
            }

            // Discord has a 2000 character limit for messages. 
            // We slice the output just in case it's too long.
            if (output.length > 1950) {
                output = output.slice(0, 1950) + '... (Output truncated)';
            }

            if (!output.trim()) {
                output = "Command executed with no output.";
            }

            interaction.followUp({ content: `**Command:** \`${input}\`\n**Output:**\n\`\`\`\n${output}\n\`\`\`` });
        });
    },
};
