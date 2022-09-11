const ecmds = require(`${__dirname}/js/services/ecmds`);

var movement = false;
var direction;

const brackets = {
	'{': '}',
	'[': ']',
	'(': ')',
	"'": "'",
	'"': '"',
};

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
	if (/{|\[|\(|'|"/.test(event.key) && !event.ctrlKey && !event.altKey) {
		editor.setRangeText(brackets[event.key].toString(), editor.selectionStart, editor.selectionEnd, 'start');
	}
	if (event.key == 'Backspace') {
		query = editor.value.substr(editor.selectionStart - 1, 2);
		console.log(query);
		if (/{}|\[\]|\(\)|''|""/.test(query)) {
			event.preventDefault();
			editor.setRangeText('', editor.selectionStart - 1, editor.selectionEnd + 1, 'start');
		}
	}
	if (event.key == 'Tab') {
		event.preventDefault();

		editor.setRangeText('    ', editor.selectionStart, editor.selectionEnd, 'end');
	}
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
			if (event.code == 'KeyJ') ecmds.cursorLeftSelect();
			if (event.code == 'KeyL') ecmds.cursorRightSelect();
		} else {
			if (event.code == 'KeyJ') ecmds.cursorLeft();
			if (event.code == 'KeyL') ecmds.cursorRight();
		}
	} else {
		movement = false;
	}
	// getLineNumberAndColumnIndex(editor);
	// console.log(`selectionStart: ${editor.selectionStart} | selectionEnd: ${editor.selectionEnd}`);
	// console.log(event);

	// ipcRenderer.send('updateWindowTitle', { file: filePath.split('\\').pop(), ico: true });
});
