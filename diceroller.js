// Import the discord.js module
const { Client, Events, GatewayIntentBits } = require('discord.js');
const Commands = require("./functions.js");
const { token } = require('./config.json');

// Create an instance of a Discord client
const client = new Client({ 
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	], 
});

client.once("ready", () => {
	console.log('Ready');
});

var game = '';
if (process.argv[2]) {
	game = process.argv[2];
} else {
	console.log('Choose a game, idiot.');
	process.exit(1);
}

//Called whenever a user sends a message to the server
client.on("messageCreate", (message) => {
	//Ignore messages sent by the bot
	if (message.author.bot) return;

	//Ignore messages that dont start with the command symbol
	if (!message.content.startsWith("/r")) return;

	//Read out some info for the "Help" command
	if (message.content.includes("help")) {
		message.channel.send("Add exclamation point in front of dice to explode 10s.");
		message.channel.send("Add number after dice to clarify a DC.");
		message.channel.send("Example commands: /r 3d10, /r 5d6 5, /r !2d100 56");
		return;
	}

	//VTM
	if (game == 'VTM') {
		var result = Commands.VTM(message.content.substring(3, message.content.length));
		message.channel.send(result);
		return;

	//DND
	} else if (game == 'DND') {
		var result = Commands.DND(message.content.substring(3, message.content.length));
		message.channel.send(result);
		return;
	
	//L5R
	} else if (game == 'L5R') {
		var result = Commands.L5R(message.content.substring(3, message.content.length));
		message.channel.send(result);
		return;
	
	//Twelve
	} else if (game == '12') {
		var result = Commands.Twelve(message.content.substring(3, message.content.length));
		message.channel.send(result);
		return;
	}
});

// Log our bot in
client.login(token);
