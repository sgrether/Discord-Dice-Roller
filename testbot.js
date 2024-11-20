// Import the discord.js module
const { Client, Events, GatewayIntentBits } = require('discord.js');

const { token } = require('./config.json');

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

client.on("messageCreate", (message) => {
	console.log(message.content);
	if(message.author.bot) return;
	if(message.content === "hello") {
		console.log("Here");
		message.reply("Hello World!");
	}
});

client.login(token);