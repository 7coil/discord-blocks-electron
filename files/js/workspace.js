/* eslint-env browser */
const Blockly = require('node-blockly/browser');
const prompt = require('electron-prompt');
const { ipcRenderer } = require('electron');

const name = 'DiscordBlocks';

const title = [...document.getElementsByTagName('title')][0];

// Make safe with Electron!
Blockly.prompt = (message, def, callback) => {
	prompt({
		title: message,
	}).then(r => callback(r));
};

// Initialise the blockly area
const workspace = Blockly.inject('block', {
	media: 'media/',
	toolbox: document.getElementById('toolbox')
});

const loadCode = (xml) => {
	const xmlDom = Blockly.Xml.textToDom(xml);
	Blockly.Xml.domToWorkspace(xmlDom, workspace);
};

// On file open...
ipcRenderer.on('file-data', (event, data) => {
	const { contents, filename } = data;
	title.innerHTML = `${name} - ${filename}`;
	console.log(contents);
	if (Blockly.mainWorkspace.getAllBlocks().length && !confirm('Do you want to clear the workspace?')) { // eslint-disable-line
		console.log('Cancelled');
	} else {
		Blockly.mainWorkspace.clear();
		loadCode(contents);
	}
});

// On project execute...
ipcRenderer.on('execute-project', (event) => {
	event.sender.send('execute-project-reply', Blockly.JavaScript.workspaceToCode(workspace));
});
