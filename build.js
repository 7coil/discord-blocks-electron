const { execSync } = require('child_process');
const { existsSync } = require('fs');
const path = require('path');

console.log('DiscordBlocks Build Process');

if (existsSync(path.join('build', 'discordjs'))) {
	console.log('Checking for updates for Discord.js Documentation');
	execSync('git pull', {
		cwd: path.join('build', 'discordjs')
	});
} else {
	console.log('Cloning Discord.js Documentation');
	execSync('git clone https://github.com/hydrabolt/discord.js.git -b docs build/discordjs');
}

console.log('Building Blocks');
require('./build/blocks');
