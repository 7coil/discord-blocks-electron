const electron = require('electron'); // eslint-disable-line import/no-extraneous-dependencies
const path = require('path');
const url = require('url');
const rpc = require('./src/rpc.js');

const {
	app,
	BrowserWindow,
	shell,
	Menu,
	ipcMain
} = electron;

let mainWindow;
let runtime;

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
					label: 'Open',
					click() {
						mainWindow.webContents.send('open-project');
					}
				},
				{
					label: 'Save',
					click() {
						mainWindow.webContents.send('save-project');
					}
				},
				{
					label: 'Save As',
					click() {
						mainWindow.webContents.send('saveas-project');
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
	// If a runtime window already exists, just reload and push the new js
	// Otherwise create the window then push
	if (runtime) {
		runtime.reload();
		runtime.webContents.send('eval', js);
	} else {
		runtime = new BrowserWindow({
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
			runtime.webContents.send('load');
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
	}
};

app.on('ready', createWindow);

// On project execute...
ipcMain.on('execute-project-reply', (event, js) => {
	createRuntime(js);
});

// On project name change
ipcMain.on('rpc-set-file', (event, file) => {
	rpc.setFile(file);
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
