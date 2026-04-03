const fs = require('fs');
const path = require('path');
const { REST, Routes } = require('discord.js');

module.exports = (client) => {
    const commandsPath = path.join(__dirname, '../commands');
    if (!fs.existsSync(commandsPath)) {
        fs.mkdirSync(commandsPath, { recursive: true });
    }

    const commandArray = [];

    const loadDir = (dir) => {
        const files = fs.readdirSync(dir);

        for (const file of files) {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);

            if (stat.isDirectory()) {
                loadDir(filePath);
            } else if (file.endsWith('.js')) {
                const command = require(filePath);
                if ('data' in command && 'execute' in command) {
                    // Assign category based on folder name
                    const category = path.basename(dir);
                    command.category = category;
                    
                    client.commands.set(command.data.name, command);
                    commandArray.push(command.data.toJSON());
                } else {
                    console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
                }
            }
        }
    };

    loadDir(commandsPath);

    // Save commands array to client so we can access it in the ready event to register
    client.commandArray = commandArray;
    console.log(`[Handler] Loaded ${client.commands.size} commands.`);
};
