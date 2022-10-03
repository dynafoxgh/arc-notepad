const { ipcRenderer, BrowserWindow, remote, dialog } = require('electron');

const ecmds = require(`${__dirname}\\ecmds.js`);
const mdcmds = require(`${__dirname}\\mdcmds.js`);

exports.openFile = async () => {
	var contents = await ipcRenderer.invoke('openFile');
	this.hide('startup');
	ecmds.loadContent(contents);
	oldContent = editor.value;
	this.updateWindowTitle(true, false);
	this.enable('saveFile');
	ipcRenderer.send('updateRatio');
};

exports.saveFile = async () => {
	if ((await ipcRenderer.invoke('getFilePath')) === undefined) {
		this.saveFileAs;
	} else {
		var contents = await ecmds.getContents();
		this.updateWindowTitle(true, false);
		oldContent = editor.value;
		ipcRenderer.invoke('saveFile', contents);
	}
};

exports.saveFileAs = async () => {
	var contents = await ecmds.getContents();
	// console.log(await ipcRenderer.invoke('saveFileAs', contents));
	if (await ipcRenderer.invoke('saveFileAs', contents)) {
		oldContent = editor.value;
		this.enable('saveFile');
		this.updateWindowTitle(true, false);
	}
};

exports.closeFile = async () => {
	ipcRenderer.invoke('closeFile');
	this.show('startup');
	ecmds.loadContent('');
	this.updateWindowTitle(false, false);
	mdcmds.updateMarkdown();
	this.disable('saveFile');
};

exports.enable = async element => {
	document.getElementById(element).className = '';
};
exports.disable = async element => {
	document.getElementById(element).className = 'disabled';
};

exports.show = async element => {
	document.getElementById(element).style.display = 'block';
};

exports.hide = async element => {
	document.getElementById(element).style.display = 'none';
};

exports.getState = async element => {
	console.log(document.getElementById(element).getElementsByTagName('i')[0].className);
	if (document.getElementById(element).getElementsByTagName('i')[0].className != '') {
		return true;
	} else {
		return false;
	}
	document.getElementById(element).getElementsByTagName('i')[0].className = '';
};

// YOU LEFT OFF HERE

exports.setState = async (element, state) => {
	if (state) {
		document.getElementById(element).getElementsByTagName('i')[0].className = 'fa-solid fa-check';
	} else {
		document.getElementById(element).getElementsByTagName('i')[0].className = '';
	}
};

exports.hideEditor = async () => {
	var state = await this.getState('showEditor');
	console.log(state);
	if (state) {
		this.hide('code-area');
		this.setState('showEditor', false);
	} else {
		this.show('code-area');
		this.setState('showEditor', true);
	}
	return;
};

exports.updateWindowTitle = async (filename, indicator) => {
	var temp = await ipcRenderer.invoke('getFilePath');

	if (temp === undefined || !filename) {
		filename = 'Unnamed File';
	} else {
		filename = `${temp.split('\\').pop()}`;
	}
	if (indicator) {
		indicator = '● ';
	} else {
		indicator = '';
	}
	ipcRenderer.send('updateWindowTitle', `${indicator}${filename} - Arc Notepad`);
	document.getElementById('title').innerHTML = `${indicator}${filename} - Arc Notepad`;
};
