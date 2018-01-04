/* eslint-env browser */
const { remote, ipcRenderer } = require('electron');

const runtime = remote.getCurrentWebContents();

// Close the window when the devtools is closed
runtime.on('devtools-closed', () => {
	window.close();
});

ipcRenderer.on('eval', (event, js) => {
	console.log(js);
	eval(js); // eslint-disable-line no-eval
});

console.log('Welcome to DiscordBlocks');
console.log('Keep this window open for your program to keep running');
