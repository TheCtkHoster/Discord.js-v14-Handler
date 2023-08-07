const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction, client) {
		return interaction.reply({ content: `🏓 Pong! ${client.ws.ping}ms`, ephemeral: true });
	},
};




