const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');
const db = require('../../database/db');
const logger = require('../../utils/logger');
const configPath = path.join(__dirname, '../../../config.json');

module.exports = {
    modOnly: true,
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Set up the ticket system')
        .addRoleOption(option => 
            option.setName('support_role')
            .setDescription('The role that will answer tickets')
            .setRequired(true))
        .addChannelOption(option => 
            option.setName('category')
            .setDescription('The category to create tickets under')
            .addChannelTypes(ChannelType.GuildCategory)
            .setRequired(true)),
    
    async execute(interaction, client) {
        // Save to config
        const supportRole = interaction.options.getRole('support_role');
        const category = interaction.options.getChannel('category');

        try {
            const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
            config.tickets = {
                categoryId: category.id,
                supportRole: supportRole.id
            };
            fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

            const embed = new EmbedBuilder()
                .setTitle('🎫 Support Tickets')
                .setDescription('Click the button below to create a private ticket and speak with our staff team.')
                .setColor('#2b2d31');

            const button = new ButtonBuilder()
                .setCustomId('ticket_create')
                .setLabel('Create Ticket')
                .setEmoji('📩')
                .setStyle(ButtonStyle.Primary);

            const row = new ActionRowBuilder().addComponents(button);

            await interaction.channel.send({ embeds: [embed], components: [row] });
            await interaction.editReply({ content: `Ticket system localized. Configured to Category: \`${category.name}\` with Support Role: \`${supportRole.name}\`.`, ephemeral: false });
        } catch (err) {
            console.error(err);
            await interaction.editReply({ content: 'Failed to update config or send embed.', ephemeral: false });
        }
    },
    
    async handleButton(interaction, client) {
        if (interaction.customId === 'ticket_create') {
            

            const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
            const categoryId = config.tickets?.categoryId;
            const supportRoleId = config.tickets?.supportRole;

            if (!categoryId || !supportRoleId) {
                return interaction.followUp({ content: 'The ticket system has not been setup correctly via `/setup` yet.'});
            }

            // Check if user already has an open ticket
            const stmt = db.prepare('SELECT * FROM tickets WHERE userId = ? AND guildId = ? AND status = ?');
            const existingTicket = stmt.get(interaction.user.id, interaction.guild.id, 'open');

            if (existingTicket) {
                return interaction.followUp({ content: `You already have an open ticket: <#${existingTicket.channelId}>` });
            }

            try {
                const channel = await interaction.guild.channels.create({
                    name: `ticket-${interaction.user.username}`,
                    type: ChannelType.GuildText,
                    parent: categoryId,
                    permissionOverwrites: [
                        {
                            id: interaction.guild.id,
                            deny: [PermissionFlagsBits.ViewChannel],
                        },
                        {
                            id: interaction.user.id,
                            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory],
                        },
                        {
                            id: supportRoleId,
                            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory],
                        }
                    ],
                });

                const insertStmt = db.prepare('INSERT INTO tickets (channelId, userId, guildId, status) VALUES (?, ?, ?, ?)');
                insertStmt.run(channel.id, interaction.user.id, interaction.guild.id, 'open');

                const embed = new EmbedBuilder()
                    .setTitle(`Ticket: ${interaction.user.tag}`)
                    .setDescription('Please describe your issue here. Our support team will be with you shortly.')
                    .setColor('#2b2d31');

                const closeBtn = new ButtonBuilder()
                    .setCustomId('ticket_close')
                    .setLabel('Close Ticket')
                    .setEmoji('🔒')
                    .setStyle(ButtonStyle.Danger);

                const row = new ActionRowBuilder().addComponents(closeBtn);

                await channel.send({ content: `${interaction.user} <@&${supportRoleId}>`, embeds: [embed], components: [row] });

                return interaction.followUp({ content: `Ticket created: ${channel}` });
            } catch (err) {
                console.error(err);
                return interaction.followUp({ content: 'Failed to create a ticket channel. Make sure my role has permission to create channels.' });
            }

        } else if (interaction.customId === 'ticket_close') {
            
            
            const stmt = db.prepare('SELECT * FROM tickets WHERE channelId = ?');
            const ticket = stmt.get(interaction.channel.id);

            if (!ticket) return interaction.followUp({ content: 'This is not a registered ticket channel.', ephemeral: false });

            try {
                const messages = await interaction.channel.messages.fetch({ limit: 100 });
                const transcriptData = messages.map(m => `${new Date(m.createdTimestamp).toLocaleString()} - ${m.author.tag}: ${m.content}`).reverse().join('\n');
                
                const fs = require('fs');
                const filePath = path.join(__dirname, `../../../data/transcript-${interaction.channel.id}.txt`);
                fs.writeFileSync(filePath, transcriptData);

                const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
                if (config.channels?.modLogs) {
                    const logChannel = client.channels.cache.get(config.channels.modLogs);
                    if (logChannel) {
                        await logChannel.send({
                            content: `Ticket closed for <@${ticket.userId}>`,
                            files: [filePath]
                        }).catch(() => null);
                    }
                }

                setTimeout(() => {
                    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
                }, 10000);

            } catch (err) {
                console.error('Failed to generate transcript', err);
            }

            db.prepare('UPDATE tickets SET status = ? WHERE channelId = ?').run('closed', interaction.channel.id);

            await interaction.followUp({ content: 'Ticket will be closed in 5 seconds...' });
            
            setTimeout(() => {
                interaction.channel.delete('Ticket Closed by user').catch(() => null);
            }, 5000);
        }
    }
};
