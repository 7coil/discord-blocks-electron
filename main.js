const electron = require('electron'); // eslint-disable-line import/no-extraneous-dependencies
const path = require('path');
const url = require('url');

const { app, BrowserWindow, shell } = electron;

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
};

app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (mainWindow === null) {
		createWindow();
	}
});

process.on('uncaughtException', (err) => {
	console.log(err);
});
