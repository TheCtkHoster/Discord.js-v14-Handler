require('dotenv').config();
const { REST, Routes } = require('discord.js');
const fs = require('fs');

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));


for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

const rest = new REST().setToken(process.env.TOKEN);

(async () => {
	try {
		console.log('Started refreshing application (/) commands. (By Async#4226)');

await rest.put(
	Routes.applicationCommands(process.env.clientId),
	{ body: commands },
);

//Uncomment the below line and comment the above line to enable slash commands to one guild. 
//Modify your .env file and set the guildId there.

/* const data = await rest.put(
	Routes.applicationGuildCommands(process.env.clientId, process.env.guildId),
	{ body: commands },
);*/

	console.log('Successfully reloaded application (/) commands. (By Async#4226)');
	} catch (error) {
		console.error(error);
	}
})();