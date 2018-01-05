
const DiscordRPC = require('discord-rpc');

// Client ID for RPC
const clientID = '233702481375395843';

// Default states for DiscordBlocks to open into
let file = 'Untitled Project';
let state = 'Editing Blocks';
let start = new Date();

// Register with the end user's Discord client
DiscordRPC.register(clientID);
const rpc = new DiscordRPC.Client({
	transport: 'ipc'
});

const setActivity = async () => {
	if (rpc) {
		rpc.setActivity({
			details: file,
			state,
			startTimestamp: start,
			instance: false
		});
	}
};

rpc.on('ready', () => {
	setActivity();

	setInterval(() => {
		setActivity();
	}, 15 * 1000);
});

rpc.login(clientID).catch(console.error);

module.exports = {
	setFile(text) {
		file = text;
	},
	setMode(id) {
		switch (id) {
		case 0:
			state = 'Editing Blocks';
			break;
		case 1:
			state = 'Running Code';
			break;
		default:
			state = 'Unknown state';
			break;
		}
	},
	setStart() {
		start = new Date();
	}
};
