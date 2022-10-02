const { ipcRenderer } = require('electron');
const path = require('path');

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

const preview = document.getElementById('preview');
const previewArea = document.getElementById('preview-area');
const editor = document.getElementById('editor');

exports.updateMarkdown = async () => {
	preview.innerHTML = md.render(editor.value);
	wbcmds.hide('startup');
	var filePath = await ipcRenderer.invoke('getFilePath');
	preview.querySelectorAll('img').forEach(e => {
		if (!/(http[s]?:\/\/)/.test(e.src)) {
			e.src = path.join(filePath, '..', e.alt);
		}
	});
};

exports.calculateRatio = () => {
	return (previewArea.scrollHeight - previewArea.clientHeight) / (editor.scrollHeight - editor.clientHeight);
};
