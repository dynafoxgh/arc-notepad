var TEMP = {
	DIRECTION: 0,
	SELECTION: [editor.selectionStart, editor.selectionEnd],
};

function updateSelection() {
	TEMP.SELECTION = [editor.selectionStart, editor.selectionEnd];
}

module.exports = {
	cursorLeft() {
		updateSelection();
		editor.setSelectionRange(editor.selectionStart - 1, editor.selectionStart - 1);
	},
	cursorRight() {
		updateSelection();
		editor.setSelectionRange(editor.selectionEnd + 1, editor.selectionEnd + 1);
	},
	cursorLeftSelect() {
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
	},
	cursorRightSelect() {
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
	},
};
