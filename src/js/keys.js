var movement = false;
var direction;

function nextWord(input) {
	var words = input.value.split(/ |\n/g),
		index = 0;
	for (var i in words) {
		var word = words[i];
		if (index + word.length >= input.selectionStart) {
			input.setSelectionRange(index + word.length + 1, index + word.length + 1);
			break;
		}
		index += word.length + 1;
	}
}
function prevWord(input) {
	var words = input.value.split(/ |\n/g).reverse(),
		index = input.value.length;
	for (var i in words) {
		var word = words[i];
		if (index + 1 <= input.selectionStart) {
			input.setSelectionRange(index - word.length, index - word.length);
			break;
		}
		index -= word.length + 1;
	}
}

function getLineNumberAndColumnIndex(textarea) {
	var textLines = textarea.value.substr(0, textarea.selectionStart).split('\n');
	var lines = textarea.value.split('\n');
	var currentLineNumber = textLines.length;
	console.log(lines[currentLineNumber - 1]);
	var currentColumnIndex = textLines[textLines.length - 1].length;
	console.log('Current Line Number ' + currentLineNumber + ' Current Column Index ' + currentColumnIndex);
}

editor.addEventListener('keydown', event => {
	if (event.key == 'Alt') {
		oldSelectionStart = editor.selectionStart;
		oldSelectionEnd = editor.selectionEnd;
	}
	if (event.altKey) {
		movement = true;
		if (event.ctrlKey) {
			if (event.code == 'KeyJ') prevWord(editor);
			if (event.code == 'KeyL') nextWord(editor);
		} else if (event.shiftKey) {
			oldSelectionStart = editor.selectionStart;
			oldSelectionEnd = editor.selectionEnd;
			if (editor.selectionStart == editor.selectionEnd) {
				if (event.code == 'KeyJ') {
					direction = 'left';
					editor.setSelectionRange(editor.selectionStart - 1, oldSelectionEnd);
				}
				if (event.code == 'KeyL') {
					direction = 'right';
					editor.setSelectionRange(oldSelectionStart, editor.selectionEnd + 1);
				}
			} else if (direction == 'left') {
				if (event.code == 'KeyJ') {
					editor.setSelectionRange(editor.selectionStart - 1, oldSelectionEnd);
				}
				if (event.code == 'KeyL') {
					editor.setSelectionRange(editor.selectionStart + 1, oldSelectionEnd);
				}
			} else if (direction == 'right') {
				if (event.code == 'KeyJ') {
					editor.setSelectionRange(oldSelectionStart, editor.selectionEnd - 1);
				}
				if (event.code == 'KeyL') {
					editor.setSelectionRange(oldSelectionStart, editor.selectionEnd + 1);
				}
			}
		} else {
			if (direction == 'left') {
				if (event.code == 'KeyJ') editor.setSelectionRange(editor.selectionStart - 1, editor.selectionStart - 1);
				if (event.code == 'KeyL') editor.setSelectionRange(editor.selectionStart + 1, editor.selectionStart + 1);
			} else {
				if (event.code == 'KeyJ') editor.setSelectionRange(editor.selectionEnd - 1, editor.selectionEnd - 1);
				if (event.code == 'KeyL') editor.setSelectionRange(editor.selectionEnd + 1, editor.selectionEnd + 1);
			}
		}
	} else {
		movement = false;
	}
	// getLineNumberAndColumnIndex(editor);
	// console.log(`selectionStart: ${editor.selectionStart} | selectionEnd: ${editor.selectionEnd}`);
	// console.log(event);

	// ipcRenderer.send('updateWindowTitle', { file: filePath.split('\\').pop(), ico: true });
});
