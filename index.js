require('dotenv').config();
const { Client, IntentsBitField, Collection, ActivityType, Events } = require('discord.js')
const fs = require('fs')
const path = require('path')


const client = new Client({
    disableEveryone: true,
    intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMembers],
});
module.exports = client;

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
  }
}


client.on(Events.ClientReady, async () => {
  client.user.setStatus('dnd')
  client.user.setActivity('Async#4226', { type: ActivityType.Watching })
	console.info(`Logged in as ${client.user.username}`);
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction, client);
	} catch (error) {
		console.error('[Anti-Crash]:', error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

process.on('unhandledRejection', error => {
	console.error('[Anti-Crash]:', error);
});


/*-------- Client Login --------*/
client.login(process.env.TOKEN)
