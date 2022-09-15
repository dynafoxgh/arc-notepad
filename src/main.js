const { app, BrowserWindow, Menu, dialog, ipcMain, ipcRenderer, MenuItem } = require('electron');

const fs = require('fs');
const path = require('path');
// const markdownpdf = require('markdown-pdf');
const { mdToPdf } = require('md-to-pdf');

require('electron-reload')(__dirname);
let win;
let file;
var fileName;

//electron-packager <sourcedir> <appname> --platform=win32 --arch=x86_64

// Menu Template
const template = [
	{
		label: 'File',
		submenu: [
			{
				label: 'Open File',
				click: async () => {
					const { filePaths } = await dialog.showOpenDialog({
						properties: ['openFile'],
						filters: [
							{ name: 'Valid File Types', extensions: ['enp', 'txt', 'md'] },
							{ name: 'Other File Types', extensions: ['*'] },
						],
					});
					file = filePaths[0];
					const contents = fs.readFileSync(file, 'utf-8');
					// console.log(contents);
					win.webContents.send('fileOpened', { contents, filePath: file });
					menu.getMenuItemById('saveFile').enabled = true;
					win.webContents.send('showEditor');
				},
				accelerator: 'Ctrl+O',
			},
			{
				type: 'separator',
			},
			{
				id: 'saveFile',
				label: 'Save File',
				click: async () => {
					win.webContents.send('saveFile');
				},
				enabled: false,
				accelerator: 'Ctrl+S',
			},
			{
				id: 'saveFileAs',
				label: 'Save As...',
				click: async () => {
					win.webContents.send('saveFileAs');
				},
				accelerator: 'Ctrl+Shift+S',
			},
			{
				type: 'separator',
			},
			{
				label: 'Print to PDF...',
				click: async () => {
					win.webContents.send('toPDF');
				},
				enabled: false,
				accelerator: 'Ctrl+P',
			},
			{
				type: 'separator',
			},
			{
				id: 'closeFile',
				label: 'Close File',
				click: async () => {
					win.webContents.send('closeFile');
					win.webContents.send('hideEditor');
					menu.getMenuItemById('saveFile').enabled = false;
				},
				accelerator: 'Ctrl+F4',
			},
		],
	},
	{ label: 'Edit', role: 'editMenu' },
	{
		label: 'View',
		submenu: [
			{
				id: 'showEditor',
				label: 'Show Editor',
				type: 'checkbox',
				checked: true,
				click: async e => {
					if (e.checked) {
						win.webContents.send('showEditor');
					} else {
						win.webContents.send('hideEditor');
					}
				},
				accelerator: 'Ctrl+H',
			},
			{
				type: 'separator',
			},
			{
				id: 'rerenderPreview',
				label: 'Refresh Preview',
				click: async () => {
					win.webContents.send('rerenderPreview');
				},
				accelerator: 'F5',
			},
			{
				type: 'separator',
			},
			{
				label: 'Open Dev Tools',
				click: async () => {
					win.webContents.openDevTools();
				},
				accelerator: 'Ctrl+Shift+I',
			},
		],
	},
	{
		label: 'Go',
		submenu: [
			{ id: 'goToHeading', label: 'Go to Heading...', enabled: false, submenu: [] },
			{ label: 'Go to Line/Column...', enabled: false },
		],
	},
	{
		label: 'Help',
		submenu: [
			{ label: 'Markdown Documentation', enabled: false },
			{ type: 'separator' },
			{
				label: 'About',
				click: async () => {
					dialog.showMessageBox({
						type: 'info',
						title: 'Exo Notepad',
						message: 'Exo Notepad',
						detail: 'Version: 0.1.0',
					});
					menu.getMenuItemById('saveFile').enabled = false;
				},
			},
		],
	},
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

// Create Window
const createWindow = () => {
	win = new BrowserWindow({
		name: 'Exo Notepad',
		backgroundColor: '#000000',
		minWidth: 1280,
		minHeight: 720,
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
			height: 32,
		},
	});
	win.loadFile(path.join(__dirname, 'index.html'));
	// win.webContents.openDevTools();
	win.setTitle('Exo Notepad');
};

app.whenReady().then(() => {
	createWindow();
	win.maximize();
	win.webContents.send('hideEditor');
});

app.once('ready-to-show', () => {
	win.show();
});
