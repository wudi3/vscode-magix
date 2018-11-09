'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
const MODE = [{ language: 'html', scheme: 'file' }, { language: 'typescript', scheme: 'file' }];
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "mx-plugin" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('mx.plugin', () => {
        // The code you place here will be executed every time your command is executed

        // Display a message box to the user
        
        vscode.window.showInformationMessage('Hello World!');
    });

    context.subscriptions.push(disposable);

    context.subscriptions.push(vscode.languages.registerDefinitionProvider(MODE, new Definition()));
}

// this method is called when your extension is deactivated
export function deactivate() {
}
class Definition implements vscode.DefinitionProvider {
    provideDefinition(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken) {
        console.info(position);
        const fileName = document.fileName;
        const workDir = path.dirname(fileName);
        const word = document.getText(document.getWordRangeAtPosition(position, new RegExp('\'(.*?)\'|\"(.*?)\"')));
        const line = document.lineAt(position);
        //const projectPath = util.getProjectPath(document);
        let text = line.text.replace(/\s+/g, '');
        if (text.indexOf('tmpl:') > -1) {
            let path = workDir + '/' + word.replace(/(^\'*)|(\'*$)/g, '').replace(/(^\"*)|(\"*$)/g, '').replace('@', '');
            console.log(path);
            return new vscode.Location(vscode.Uri.file(path), new vscode.Position(0, 0));
        }
    }
}