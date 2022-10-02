exports.keyMap = {};

exports.bracketPairs = {
	'{': '}',
	'[': ']',
	'(': ')',
	"'": "'",
	'"': '"',
	'<': '>',
};

exports.menuTemplate = [
	{
		label: 'File',
		noCaret: true,
		submenu: [
			{
				label: 'Open File',
				accelerator: 'Ctrl+O',
				click: async () => {
					wbcmds.openFile();
				},
			},
			{
				type: 'separator',
			},
			{
				id: 'saveFile',
				label: 'Save File',
				click: async () => {
					wbcmds.saveFile();
				},
				enabled: false,
				accelerator: 'Ctrl+S',
			},
			{
				id: 'saveFileAs',
				label: 'Save File As...',
				click: async () => {
					wbcmds.saveFileAs();
				},
				accelerator: 'Ctrl+Shift+S',
			},
			{
				type: 'separator',
			},
			{
				label: 'Print to PDF...',
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
					wbcmds.closeFile();
				},
				accelerator: 'Ctrl+F4',
			},
		],
	},
	{ label: 'Edit', role: 'editMenu', noCaret: true },
	{
		label: 'View',
		noCaret: true,
		submenu: [
			{
				id: 'showEditor',
				label: 'Show Editor',
				type: 'checkbox',
				checked: true,
				// accelerator: 'Ctrl+H',
				enabled: false,
				click: async () => {
					console.log('test');
					wbcmds.hideEditor();
				},
			},
			{
				type: 'separator',
			},
			{
				id: 'rerenderPreview',
				label: 'Refresh Preview',
				accelerator: 'F5',
			},
			{
				type: 'separator',
			},
			{
				label: 'Open Dev Tools',
				accelerator: 'Ctrl+Shift+I',
			},
		],
	},
	{
		label: 'Go',
		noCaret: true,
		submenu: [
			{ id: 'goToHeading', label: 'Go to Heading...', enabled: false, submenu: [] },
			{ label: 'Go to Line/Column...', enabled: false },
		],
	},
	{
		label: 'Help',
		noCaret: true,
		submenu: [
			{ label: 'Markdown Documentation', enabled: false },
			{ type: 'separator' },
			{
				label: 'About',
			},
		],
	},
];
