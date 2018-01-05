/* eslint-env browser */
const Blockly = require('node-blockly/browser');
const electronPrompt = require('electron-prompt');
const { ipcRenderer, remote } = require('electron');
const path = require('path');
const url = require('url');
const fs = require('fs');

let filepath = null;
let saved = true;

// Make safe with Electron!
Blockly.prompt = (message, def, callback) => {
	electronPrompt({
		title: message,
	}).then(r => callback(r));
};

Blockly.Css.inject(false, url.format({
	pathname: path.join(__dirname, '..', 'media'),
	protocol: 'file:',
	slashes: true,
}));

// Initialise the blockly area
const workspace = Blockly.inject('block', {
	media: 'media/',
	toolbox: document.getElementById('toolbox')
});

workspace.addChangeListener(() => {
	saved = false;
});

const loadCode = (xml) => {
	const xmlDom = Blockly.Xml.textToDom(xml);
	Blockly.Xml.domToWorkspace(xmlDom, workspace);
};
const openCode = () => {
	remote.dialog.showOpenDialog({
		title: 'Import DiscordBlocks Project',
		defaultPath: remote.app.getPath('documents'),
		filters: [
			{
				name: 'DiscordBlocks Project (\uD83C\uDD71, .\uD83C\uDD71)',
				extensions: [
					'\uD83C\uDD713',
					'\uD83C\uDD71'
				],
				openFile: true,
				openDirectory: false,
				multiSelections: false
			},
			{
				name: 'XML (.xml)',
				extensions: [
					'xml'
				],
				openFile: true,
				openDirectory: false,
				multiSelections: false
			},
			{
				name: 'All Files',
				extensions: [
					'*'
				],
				openFile: true,
				openDirectory: false,
				multiSelections: false
			}
		]
	}, (files) => {
		if (!files) {
			console.log('Cancelled file opening');
		} else {
			const { name: filename } = path.parse(files[0]);
			fs.readFile(files[0], {
				encoding: 'UTF8'
			}, (error, contents) => {
				if (Blockly.mainWorkspace.getAllBlocks().length && !confirm('Do you want to clear the workspace?')) { // eslint-disable-line
					console.log('Cancelled');
				} else {
					Blockly.mainWorkspace.clear();
					loadCode(contents);
				}
				[filepath] = files;
				ipcRenderer.send('rpc-set-file', filename);
			});
		}
	});
};
const saveCode = location =>
	new Promise((resolve, reject) => {
		filepath = location;
		const xml = Blockly.Xml.workspaceToDom(workspace);
		const xmlText = Blockly.Xml.domToPrettyText(xml);
		const { name: filename } = path.parse(location);
		fs.writeFile(filepath, xmlText, (err) => {
			if (err) reject();
			ipcRenderer.send('rpc-set-file', filename);
			resolve();
		});
	});

const saveAsCode = () =>
	new Promise((resolve, reject) => {
		remote.dialog.showOpenDialog({
			title: 'Import DiscordBlocks Project',
			defaultPath: remote.app.getPath('documents'),
			filters: [
				{
					name: 'Compatible Files',
					extensions: [
						'\uD83C\uDD713',
						'\uD83C\uDD71',
						'xml'
					],
					openFile: true,
					openDirectory: false,
					multiSelections: false
				},
				{
					name: 'DiscordBlocks Project (.\uD83C\uDD713, .\uD83C\uDD71)',
					extensions: [
						'\uD83C\uDD713',
						'\uD83C\uDD71'
					],
					openFile: true,
					openDirectory: false,
					multiSelections: false
				},
				{
					name: 'XML (.xml)',
					extensions: [
						'xml'
					],
					openFile: true,
					openDirectory: false,
					multiSelections: false
				},
				{
					name: 'All Files',
					extensions: [
						'*'
					],
					openFile: true,
					openDirectory: false,
					multiSelections: false
				}
			]
		}, (files) => {
			if (files) {
				saveCode(files[0])
					.then(() => resolve())
					.catch(() => reject());
			} else {
				reject();
			}
		});
	});
const saveWith = () => {
	if (filepath) {
		saveCode()
			.then(() => {
				saved = true;
			});
	} else {
		saveAsCode()
			.then(() => {
				saved = true;
			});
	}
};

ipcRenderer.on('open-project', () => openCode());
ipcRenderer.on('save-project', () => saveWith());
ipcRenderer.on('saveas-project', () => saveAsCode());
ipcRenderer.on('execute-project', (event) => {
	event.sender.send('execute-project-reply', Blockly.JavaScript.workspaceToCode(workspace));
});

ipcRenderer.on('leave', (event) => {
	event.sender.send('leave-reply', saved);
});

// On keypresses...
document.onkeydown = (e) => {
	if (e.ctrlKey && e.keyCode === 83) {
		saveWith();
	}
};

// On close
// if (!saved) {
// 	remote.dialog.showMessageBox({
// 		type: 'question',
// 		title: 'You have unsaved changes',
// 		message: 'You have unsaved changes. Would you like to save them? Running bots will be closed.',
// 		buttons: [
// 			'Save',
// 			'Don\'t Save',
// 			'Cancel'
// 		]
// 	}, (button) => {
// 		if (button === 0) {
// 			saveWith();
// 		} else if (button !== 2) {
// 			e.preventDefault();
// 		}
// 	});
// }
