const { execSync } = require('child_process');
const { existsSync } = require('fs');
const path = require('path');

console.log('DiscordBlocks Build Process');

console.log('Installing dependencies');
execSync('npm i');

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

if (existsSync(path.join('build', 'eris'))) {
	console.log('Checking for updates for Eris');
	execSync('git pull', {
		cwd: path.join('build', 'eris')
	});
} else {
	console.log('Cloning Eris Documentation');
	execSync('git clone https://github.com/abalabahaha/eris.git build/eris');
}

console.log('Converting Eris to JSdoc');
execSync('node_modules/.bin/jsdoc build/eris -r -t templates/haruki -d console > build/eris.json');

console.log('DiscordBlocks Build Process Finished');
