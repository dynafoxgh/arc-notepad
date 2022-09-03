const { app, BrowserWindow, Menu, dialog, ipcMain, ipcRenderer, MenuItem } = require('electron');

const fs = require('fs');
const path = require('path');
// const markdownpdf = require('markdown-pdf');
const pdf = require('html-pdf');

require('electron-reload')(__dirname);
let win;
let file;

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
			,
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
	// {
	// 	label: 'pdf',
	// 	click: async () => {
	// 		win.webContents.send('toPDF');
	// 	},
	// 	accelerator: 'Ctrl+P',
	// },
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
			// {
			// 	label: 'Preview Size',
			// 	id: 'previewSize',
			// 	submenu: [
			// 		{
			// 			label: 'Standard',
			// 			click: async e => {
			// 				win.webContents.send('previewSize:standard');
			// 			},
			// 		},
			// 		{
			// 			label: 'A4',
			// 			click: async e => {
			// 				win.webContents.send('previewSize:standard');
			// 			},
			// 		},
			// 	],
			// },
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
			{ label: 'Go to Header...', enabled: false },
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
		useContentSize: true,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
		},
		show: false,
		icon: path.join(__dirname, 'favicon.ico'),
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

// IPC FUNCTIONS

// Function to update window title
ipcMain.on('updateWindowTitle', (event, { file, ico }) => {
	console.log(`file:///${__dirname.replaceAll(`\\`, `/`)}/`);
	var suffix;
	if (ico == true) {
		var suffix = '• ';
	} else {
		var suffix = '';
	}
	if (file != '') {
		win.setTitle(`${suffix}${file} - Exo Notepad`);
	} else {
		win.setTitle(`Exo Notepad`);
	}
});

// Function to save file as...
ipcMain.on('saveFileAs', async (event, { contents }) => {
	console.log(contents);
	const { filePath } = await dialog.showSaveDialog({
		filters: [
			{ name: 'Valid File Types', extensions: ['enp', 'txt', 'md'] },
			{ name: 'Other File Types', extensions: ['*'] },
		],
	});

	if (filePath === undefined) {
		return;
	} else {
		fs.writeFile(filePath, contents.toString(), function (err) {
			console.log(err);
			if (err === undefined || err === null) {
				menu.getMenuItemById('saveFile').enabled = true;
				dialog.showMessageBox({
					title: 'Save Succesfull!',
					message: 'The file has been succesfully saved!',
					// icon: path.join(__dirname, 'favicon.ico'),
					buttons: ['OK'],
				});
				win.webContents.send('fileOpened', { contents, filePath });
			} else {
				dialog.showErrorBox('File save error', err.message);
			}
		});
	}
});

ipcMain.on('toPDF', async (event, { contents }) => {
	const { filePath } = await dialog.showSaveDialog({
		filters: [
			{ name: 'PDF', extensions: ['pdf'] },
			{ name: 'Other File Types', extensions: ['*'] },
		],
	});
	var options = {
		format: 'A4',
	};

	contents
		.printToPDF(options)
		.then(data => {
			fs.writeFile(filePath, data, function (err) {
				if (err) {
					console.log(err);
				} else {
					console.log('PDF Generated Successfully');
				}
			});
		})
		.catch(error => {
			console.log(error);
		});
	// markdownpdf({ cssPath: `css/markdown-test.css` })
	// 	.from.string(contents)
	// 	.to(filePath, function () {});

	// const base = path.resolve('./src').replace(/\\/g, '/');
	// console.log(base);

	// pdf.create(contents, options).toFile(filePath, function (err, res) {
	// 	if (err) return console.log(err);
	// 	console.log(res); // { filename: '/app/businesscard.pdf' }
	// });
});
