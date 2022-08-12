// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
const stringify = require('json-stringify-pretty-compact');
const jsonlint = require("jsonlint-mod");

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "json-compact-formatter-ts" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('json-compact-formatter-ts.prettify', () => {
		//vscode.window.showInformationMessage('Hello World from json-compact-formatter-ts!');

		// The code you place here will be executed every time your command is executed
		var srcText = getSelectionText();
		if (!srcText) {
				return;
		}

		//const jsonObj = JSON.parse(srcText);
		let jsonObj;
		try {
				jsonObj = jsonlint.parse(srcText);
				const formatted = stringify(jsonObj, {maxLength: 80, indent: 2});
				setSelectionText(formatted);
		} catch(e) {
				vscode.window.showInformationMessage("ERROR: " + e);
		}

	});

	context.subscriptions.push(disposable);
}

function setSelectionText(text:string) {
	let e = vscode.window.activeTextEditor;

	if (e !== undefined) {
		//let d = e.document;
		let sel = e.selection;

		e.edit(function (builder) {
				builder.replace(sel, text);
		});
	}
}

function getSelectionText():string|false {
	var editor = vscode.window.activeTextEditor;
	var msgNoText = 'Please select JSON fragment to format, in the active editor.';
	if (!editor) {
			vscode.window.showInformationMessage(msgNoText);
			return false;
	}

	var selection = editor.selection;
	var srcText = editor.document.getText(selection);

	if (srcText.length < 1) {
			vscode.window.showInformationMessage(msgNoText);
			return false;
	}

	return srcText;
}


// this method is called when your extension is deactivated
export function deactivate() {}
