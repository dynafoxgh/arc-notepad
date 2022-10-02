const { ipcRenderer, BrowserWindow, remote, dialog, clipboard } = require('electron');
const fs = require('fs');

const interface = require(`${__dirname}\\js\\services\\interface.js`);
const mdcmds = require(`${__dirname}\\js\\services\\mdcmds.js`);
const wbcmds = require(`${__dirname}\\js\\services\\wbcmds.js`);
const ecmds = require(`${__dirname}\\js\\services\\ecmds.js`);
// const windowbar = require(`${__dirname}\\js\\handlers\\windowbar.js`);

let openedFilePath;
const editor = document.getElementById('editor');
const preview = document.getElementById('preview');

interface.init();

// Setup for auto update
var typingTimer;
var doneTypingInterval = 500;
var ratio;
var lastTimeStamp = 0;
var oldContent;

// Function to update markdown in the preview area
function calculateRatio() {
	setTimeout(() => {
		ratio = mdcmds.calculateRatio();
	}, 500);
}

// IPC FUNCTIONS

const previewArea = document.getElementById('preview-area');
// const workspace = document.getElementById('workspace');

editor.addEventListener('scroll', event => {
	if (event.timeStamp - lastTimeStamp > 12) {
		previewArea.scrollTop = editor.scrollTop * ratio;
		lastTimeStamp = event.timeStamp;
	}
});

previewArea.addEventListener('scroll', event => {
	if (event.timeStamp - lastTimeStamp > 12) {
		editor.scrollTop = previewArea.scrollTop / ratio;
		lastTimeStamp = event.timeStamp;
	}
});

// Functions for autoupdating the preview area
editor.addEventListener('change', event => {
	mdcmds.updateMarkdown();
	calculateRatio();
});

editor.addEventListener('keyup', function () {
	clearTimeout(typingTimer);
	typingTimer = setTimeout(doneTyping, doneTypingInterval);
});

function doneTyping() {
	if (editor.value != oldContent) wbcmds.updateWindowTitle(true, true);
	mdcmds.updateMarkdown();
	calculateRatio();
}

ipcRenderer.on('rerenderPreview', event => {
	mdcmds.updateMarkdown();
});

ipcRenderer.on('updateRatio', event => {
	calculateRatio();
});

/*

ipcRenderer.on('toPDF', event => {
	const currentTextValue = editor.value;
	ipcRenderer.send('toPDF', { contents: currentTextValue });
});

*/
