const { app, BrowserWindow, Menu, dialog, ipcMain, ipcRenderer, MenuItem } = require('electron');

const fs = require('fs');
const path = require('path');
// const markdownpdf = require('markdown-pdf');
const { mdToPdf } = require('md-to-pdf');

require('electron-reload')(__dirname);
let win;
let file;
var fileName;
var currentfilePath;

//electron-packager <sourcedir> <appname> --platform=win32 --arch=x86_64

// Create Window
const createWindow = () => {
	win = new BrowserWindow({
		name: 'Arc Notepad',
		backgroundColor: '#000000',
		// minWidth: 1280,
		// minHeight: 720,
		useContentSize: false,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
		},
		show: false,
		icon: path.join(__dirname, 'favicon.ico'),
		titleBarStyle: 'hidden',
		titleBarOverlay: {
			color: '#fff',
			symbolColor: '#111',
			height: 30,
		},
	});
	win.loadFile(path.join(__dirname, 'index.html'));
	// win.webContents.openDevTools();
	win.setTitle('Arc Notepad');
};

app.whenReady().then(() => {
	createWindow();
	win.maximize();
	win.webContents.send('hideEditor');
});

app.once('ready-to-show', () => {
	win.show();
});

// IPC FUNCTIONS

var suffix;

ipcMain.handle('openFile', async e => {
	const { filePaths } = await dialog.showOpenDialog({
		properties: ['openFile'],
		filters: [
			{ name: 'Valid File Types', extensions: ['enp', 'txt', 'md'] },
			{ name: 'Other File Types', extensions: ['*'] },
		],
	});
	file = filePaths[0];
	currentfilePath = file;
	const contents = fs.readFileSync(file, 'utf-8');
	return contents;
});

ipcMain.handle('saveFile', async (e, contents) => {
	if (currentfilePath === undefined) {
		return false;
	} else {
		fs.writeFile(currentfilePath, contents.toString(), function (err) {
			console.log(err);
			return true;
		});
	}
});

ipcMain.handle('saveFileAs', async (e, contents) => {
	const { filePath } = await dialog.showSaveDialog({
		filters: [
			{ name: 'Valid File Types', extensions: ['enp', 'txt', 'md'] },
			{ name: 'Other File Types', extensions: ['*'] },
		],
	});

	if (!filePath) {
		return false;
	} else {
		fs.writeFile(filePath, contents.toString(), function (err) {
			console.log(err);
			if (err === undefined || err === null) {
				dialog.showMessageBox({
					title: 'Save Succesfull!',
					message: 'The file has been succesfully saved!',
					// icon: path.join(__dirname, 'favicon.ico'),
					buttons: ['OK'],
				});
				return true;
			} else {
				dialog.showErrorBox('File save error', err.message);
				return false;
			}
		});
		return true;
	}
});

ipcMain.handle('closeFile', e => {
	currentfilePath = undefined;
});

ipcMain.handle('getFilePath', async e => {
	return currentfilePath;
});

ipcMain.on('updateRatio', async e => {
	// await new Promise(resolve => setTimeout(resolve, 1000));
	win.webContents.send('updateRatio');
});

ipcMain.on('updateWindowTitle', (event, title) => {
	win.setTitle(title);
});
