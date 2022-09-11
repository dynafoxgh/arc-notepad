const { ipcRenderer, BrowserWindow, remote, dialog } = require('electron');
const fs = require('fs');
const hljs = require('highlight.js/lib/core');
const marked = require('marked');
// const pdf = require('html-pdf');

// hljs.registerLanguage('js', require('highlight.js/lib/languages/javascript'));
// hljs.registerLanguage('bash', require('highlight.js/lib/languages/bash'));

// Markdown node module
var md = require('markdown-it')({
	html: true,
	linkify: true,
	typographer: true,
})
	.use(require('markdown-it-highlightjs'), { auto: false })
	.use(require('markdown-it-task-lists'))
	.use(require('markdown-it-container'))
	.use(require('markdown-it-footnote'))
	.use(require('markdown-it-deflist'))
	.use(require('markdown-it-anchor'))
	.use(require('markdown-it-emoji'))
	.use(require('markdown-it-mark'))
	.use(require('markdown-it-abbr'))
	.use(require('markdown-it-sub'))
	.use(require('markdown-it-sup'))
	.use(require('markdown-it-ins'));
md.enable('table');

let openedFilePath;
const editor = document.getElementById('editor');
const preview = document.getElementById('preview');

// Setup for auto update
var typingTimer;
var doneTypingInterval = 500;
var ratio;
var lastTimeStamp = 0;
var oldContent;

// Function to update markdown in the preview area
function updateMarkdown() {
	var result = md.render(editor.value);

	document.getElementById('preview').innerHTML = result;
	document.getElementById('startup').style.display = 'none';
	ratio =
		(div2.scrollHeight - div2.clientHeight) /
		(editor.scrollHeight - editor.clientHeight) /*  + (div2.scrollHeight / div2.clientHeight) */;
	// console.log(ratio);
}

// IPC FUNCTIONS

const div2 = document.getElementById('preview-area');
// const workspace = document.getElementById('workspace');

editor.addEventListener('scroll', event => {
	if (event.timeStamp - lastTimeStamp > 12) {
		div2.scrollTop = editor.scrollTop * ratio;
		lastTimeStamp = event.timeStamp;
	}
});

div2.addEventListener('scroll', event => {
	if (event.timeStamp - lastTimeStamp > 12) {
		editor.scrollTop = div2.scrollTop / ratio;
		lastTimeStamp = event.timeStamp;
	}
});

// Functions for autoupdating the preview area
editor.addEventListener('change', event => {
	updateMarkdown();
});

editor.addEventListener('keyup', function () {
	clearTimeout(typingTimer);
	typingTimer = setTimeout(doneTyping, doneTypingInterval);
});

function doneTyping() {
	//
	if (editor.value != oldContent) ipcRenderer.send('updateWindowTitle', { ico: true });
	updateMarkdown();
}

// Communication with the main.js file
ipcRenderer.on('fileOpened', (event, { contents, filePath }) => {
	openedFilePath = filePath;
	editor.value = contents;
	oldContent = contents;
	// editor.style.display = 'block';
	// document.getElementById('file-path').innerText = filePath;
	document.getElementsByTagName('title').value = filePath;
	document.getElementById('startup').style.display = 'none';

	ipcRenderer.send('updateWindowTitle', { file: filePath.split('\\').pop() });
	updateMarkdown();
	// console.log(document.getElementsByTagName('h2'));
});

// Function to save file if file exists
ipcRenderer.on('saveFile', event => {
	const currentTextValue = editor.value;
	oldContent = currentTextValue;
	fs.writeFileSync(openedFilePath, currentTextValue, 'utf-8');
	ipcRenderer.send('updateWindowTitle', { ico: false });
	// ipcRenderer.send('updateWindowTitle', { file: filePath.split('\\').pop(), ico: false });
});

// Function to send current contents of the editor to save
ipcRenderer.on('saveFileAs', event => {
	const currentTextValue = editor.value;
	oldContent = currentTextValue;
	ipcRenderer.send('saveFileAs', { contents: currentTextValue });
	ipcRenderer.send('updateWindowTitle', { ico: false });
});

// Function to hide editor
ipcRenderer.on('hideEditor', event => {
	document.getElementById('code-area').style.display = 'none';
	document.getElementById('workspace').style.gap = 0;
});

// Function to unhide editor
ipcRenderer.on('showEditor', event => {
	document.getElementById('code-area').style.display = 'block';
	document.getElementById('workspace').style.gap = '32px';
});

// Function to run when a file is closed
ipcRenderer.on('closeFile', event => {
	editor.value = '';
	updateMarkdown();
	document.getElementById('startup').style.display = 'block';
	ipcRenderer.send('updateWindowTitle', { file: '', ico: false });
});

ipcRenderer.on('toPDF', event => {
	const currentTextValue = editor.value;
	ipcRenderer.send('toPDF', { contents: currentTextValue });
});

ipcRenderer.on('rerenderPreview', event => {
	updateMarkdown();
});
