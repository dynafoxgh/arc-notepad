const { readFile } = require('fs');
const path = require('path');

const { menuTemplate } = require(path.join(__dirname, '..\\..\\js\\exports\\export.defaults.js'));

const wbcmds = require(`${__dirname}\\wbcmds.js`);

exports.init = () => {
	document.querySelectorAll('a').forEach(x => (x.tabIndex = -1));
	this.generateMenu(document.getElementById('test'), menuTemplate);
};

exports.generateMenu = (menu, menuTemplate) => {
	menuTemplate.forEach(element => {
		if (element.type == 'separator') {
			var separator = document.createElement('hr');
			menu.appendChild(separator);
		} else {
			var menuItem = document.createElement('li');
			if (element.type == 'checkbox') {
				var checkmark = document.createElement('i');
				if (element.checked) {
					checkmark.className = 'fa-solid fa-check';
				}
				menuItem.appendChild(checkmark);
			}
			if (element.id != undefined) menuItem.id = element.id;
			if (element.enabled != undefined && element.enabled == false) menuItem.className = 'disabled';
			var menuItemName = document.createElement('a');
			menuItemName.innerHTML = element.label;
			menu.appendChild(menuItem).appendChild(menuItemName);
		}
		if (element.click != undefined) {
			menuItem.addEventListener('click', element.click);
		}

		if (element.accelerator != undefined) {
			var accelerator = document.createElement('p');
			accelerator.innerText = element.accelerator;
			menuItemName.appendChild(accelerator);
		}
		if (element.submenu != undefined) {
			if (!element.noCaret) {
				var caret = document.createElement('i');
				var menuItemInfo = document.createElement('p');
				caret.className = 'fas fa-caret-right';
				menuItemName.appendChild(menuItemInfo).appendChild(caret);
			}

			var submenu = document.createElement('ul');
			menuItem.appendChild(submenu);
			// console.log(element);
			// console.log(element.submenu);
			this.generateMenu(submenu, element.submenu);
		}
	});
};
