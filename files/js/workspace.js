/* eslint-env browser */
const Blockly = require('node-blockly/browser');
const prompt = require('electron-prompt');

// Make safe with Electron!
Blockly.prompt = (message, def, callback) => {
	prompt({
		title: message,
	}).then(r => callback(r));
};

const hljs = require('highlight.js');

const codeArea = document.getElementById('code');
const workspace = Blockly.inject('block', {
	media: 'media/',
	toolbox: document.getElementById('toolbox')
});
workspace.addChangeListener((e) => {
	console.log(e.type);
	codeArea.innerHTML = Blockly.JavaScript.workspaceToCode(workspace);
	hljs.highlightBlock(codeArea);
});
