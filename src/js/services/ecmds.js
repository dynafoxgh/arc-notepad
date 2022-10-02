const editor = document.getElementById('editor');

const mdcmds = require(`${__dirname}\\mdcmds.js`);

var TEMP = {
	DIRECTION: 0,
	SELECTION: [editor.selectionStart, editor.selectionEnd],
};

function updateSelection() {
	TEMP.SELECTION = [editor.selectionStart, editor.selectionEnd];
}

exports.cursorLeft = () => {
	updateSelection();
	editor.setSelectionRange(editor.selectionStart - 1, editor.selectionStart - 1);
};
exports.cursorRight = () => {
	updateSelection();
	editor.setSelectionRange(editor.selectionEnd + 1, editor.selectionEnd + 1);
};
exports.cursorLeftSelect = () => {
	updateSelection();
	if (editor.selectionStart == editor.selectionEnd) {
		TEMP.DIRECTION = 0;
		editor.setSelectionRange(TEMP.SELECTION[0] - 1, TEMP.SELECTION[1]);
	}
	if (!TEMP.DIRECTION) {
		editor.setSelectionRange(TEMP.SELECTION[0] - 1, TEMP.SELECTION[1]);
	} else {
		editor.setSelectionRange(TEMP.SELECTION[0], TEMP.SELECTION[1] - 1);
	}
};
exports.cursorRightSelect = () => {
	updateSelection();
	if (editor.selectionStart == editor.selectionEnd) {
		TEMP.DIRECTION = 1;
		editor.setSelectionRange(TEMP.SELECTION[0], TEMP.SELECTION[1] + 1);
	}
	if (!TEMP.DIRECTION) {
		editor.setSelectionRange(TEMP.SELECTION[0] + 1, TEMP.SELECTION[1]);
	} else {
		editor.setSelectionRange(TEMP.SELECTION[0], TEMP.SELECTION[1] + 1);
	}
};

exports.loadContent = content => {
	editor.value = content;
	mdcmds.updateMarkdown();
};

exports.getContents = async () => {
	return await editor.value;
};
