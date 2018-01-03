const electron = require('electron'); // eslint-disable-line import/no-extraneous-dependencies
const DiscordRPC = require('discord-rpc');
const path = require('path');
const url = require('url');
const fs = require('fs');

const clientID = '233702481375395843';
let file = 'Untitled Project';

const {
	app,
	BrowserWindow,
	shell,
	Menu,
	dialog,
	ipcMain
} = electron;

let mainWindow;

const createWindow = () => {
	mainWindow = new BrowserWindow({ width: 1280, height: 720 });

	mainWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'files', 'index.html'),
		protocol: 'file:',
		slashes: true,
	}));

	mainWindow.on('closed', () => {
		mainWindow = null;
	});

	mainWindow.webContents.openDevTools();

	mainWindow.webContents.on('new-window', (event, link) => {
		event.preventDefault();
		shell.openExternal(link);
	});

	const template = [
		{
			label: 'File',
			submenu: [
				{
					label: 'Open Project',
					click() {
						dialog.showOpenDialog({
							title: 'Import DiscordBlocks Project',
							defaultPath: app.getPath('documents'),
							filters: [
								{
									name: 'DiscordBlocks Project (.🅱3, .🅱)',
									extensions: [
										'🅱3',
										'🅱'
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
								file = filename;
								fs.readFile(files[0], {
									encoding: 'UTF8'
								}, (error, contents) => {
									mainWindow.webContents.send('file-data', {
										contents,
										filename
									});
								});
							}
						});
					}
				}
			]
		},
		{
			label: 'Run',
			submenu: [
				{
					label: 'Execute Project',
					click() {
						mainWindow.webContents.send('execute-project');
					}
				}
			]
		}
	];

	const menu = Menu.buildFromTemplate(template);
	mainWindow.setMenu(menu);
};

const createRuntime = (js) => {
	console.log(js);
	let runtime = new BrowserWindow({
		width: 800,
		height: 600,
		show: false,
		frame: false
	});

	runtime.on('closed', () => {
		runtime = null;
	});

	runtime.on('ready-to-show', () => {
		console.log('loaded!');
		runtime.webContents.send('eval', js);
	});

	runtime.loadURL(url.format({
		pathname: path.join(__dirname, 'files', 'runtime.html'),
		protocol: 'file:',
		slashes: true,
	}));
	runtime.setMenu(null);
	runtime.webContents.openDevTools({
		mode: 'detach'
	});

	runtime.webContents.on('new-window', (event, link) => {
		event.preventDefault();
		shell.openExternal(link);
	});
};

app.on('ready', createWindow);

// On project execute...
ipcMain.on('execute-project-reply', (event, js) => {
	createRuntime(js);
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
	app.quit();
});

app.on('activate', () => {
	if (mainWindow === null) {
		createWindow();
	}
});

DiscordRPC.register(clientID);
const rpc = new DiscordRPC.Client({
	transport: 'ipc'
});
const startTimestamp = new Date();

const setActivity = async () => {
	if (rpc && mainWindow) {
		console.log('Setting!');
		rpc.setActivity({
			details: file,
			state: 'Editing Blocks',
			startTimestamp,
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
