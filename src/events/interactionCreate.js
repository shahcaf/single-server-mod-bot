const { Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
const configPath = path.join(__dirname, '../../config.json');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (interaction.isChatInputCommand()) {
            await interaction.deferReply({ ephemeral: false }).catch(() => null);
            console.log(`[Interaction] /${interaction.commandName} started - User: ${interaction.user.tag}`);
            
            const command = client.commands.get(interaction.commandName);
            if (!command) return;

            try {
                // Cooldowns
                const { cooldowns } = client;
                if (!cooldowns.has(command.data.name)) {
                    cooldowns.set(command.data.name, new Collection());
                }

                const now = Date.now();
                const timestamps = cooldowns.get(command.data.name);
                const defaultCooldownDuration = 0.5;
                const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1000;

                // Maintenance Check
                const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
                if (config.maintenanceMode && interaction.user.id !== process.env.DEV_ID) {
                    return interaction.editReply({ content: "🛠️ The bot is currently undergoing maintenance. Only authorized developers can access modules at this time." });
                }

                if (timestamps.has(interaction.user.id)) {
                    const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;
                    if (now < expirationTime) {
                        const expiredTimestamp = Math.round(expirationTime / 1000);
                        return interaction.editReply({ content: `Please wait, you are on a cooldown for \`${command.data.name}\`. You can use it again <t:${expiredTimestamp}:R>.` });
                    }
                }

                timestamps.set(interaction.user.id, now);
                setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

                // Perm check for mod commands
                if (command.modOnly) {
                     const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
                     const adminRole = config.roles.admin;
                     const modRole = config.roles.moderator;

                     // Safely check membership
                     const isMod = interaction.member?.roles?.cache?.has(adminRole) || 
                                   interaction.member?.roles?.cache?.has(modRole) || 
                                   interaction.member?.permissions?.has('Administrator');
                     
                     if (!isMod) {
                         return interaction.editReply({ content: "You do not have permission to use this command." });
                     }
                }

                // Perm check for dev commands
                if (command.devOnly) {
                    if (interaction.user.id !== process.env.DEV_ID) {
                        return interaction.editReply({ content: "❌ This command is restricted to the **Bot Developer** only." });
                    }
                }

                await command.execute(interaction, client);
            } catch (error) {
                console.error('[Interaction Error]', error);
                
                let errString = error.stack || error.message || String(error);
                if (errString.length > 1000) errString = errString.substring(0, 1000) + '...';

                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: `There was an error while executing this command!\n\`\`\`js\n${errString}\n\`\`\`` }).catch(()=>null);
                } else {
                    await interaction.editReply({ content: `There was an error while executing this command!\n\`\`\`js\n${errString}\n\`\`\`` }).catch(()=>null);
                }
            }
        } else if (interaction.isButton()) {
            const setupCmd = client.commands.get('setup');
            const helpCmd = client.commands.get('cmd');

            try {
                if (interaction.customId.startsWith('help_') && helpCmd?.handleButton) {
                    await helpCmd.handleButton(interaction, client);
                } else if (setupCmd?.handleButton) {
                    await setupCmd.handleButton(interaction, client);
                }
            } catch (e) {
                console.error('[Button Error]', e);
                if (!interaction.replied && !interaction.deferred) {
                    await interaction.reply({ content: 'An error occurred processing that button.', ephemeral: false }).catch(() => null);
                }
            }
        }
    },
};
