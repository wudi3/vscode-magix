'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { Initializer } from './initializer';
import { ToDefinitionCommand } from './command';
import { MXDefinitionProvider, MXInnerDefinitionProvider, HtmlDefinitionProvider } from './provider/VSDefinitionProvider';
import { MXEventCompletionItemProvider } from './provider/VSCompletionItemProvider';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    //初始化期，初始化基本数据
    new Initializer().init().then(() => {
        //注册跳转到定义command
        let command: ToDefinitionCommand = new ToDefinitionCommand();
        command.registerCommand(context);
        //注册es代码跳转command
        const JTS_MODE = [{ language: 'javascript', scheme: 'file' }, { language: 'typescript', scheme: 'file' }];
        context.subscriptions.push(vscode.languages.registerDefinitionProvider(JTS_MODE, new MXDefinitionProvider()));
        context.subscriptions.push(vscode.languages.registerDefinitionProvider(JTS_MODE, new MXInnerDefinitionProvider()));
        //注册html代码跳转
        const HTML_MODE = [{ language: 'html', scheme: 'file' }];
        context.subscriptions.push(vscode.languages.registerDefinitionProvider(HTML_MODE, new HtmlDefinitionProvider()));
        //注册代码提示
        context.subscriptions.push(vscode.languages.registerCompletionItemProvider(HTML_MODE, new MXEventCompletionItemProvider(),'=','\'','"'));
       
        vscode.window.setStatusBarMessage('http://www.baidu.com',10000);
        
        const panel =  vscode.window.createWebviewPanel('beautifulGirl','test', vscode.ViewColumn.One, {
            enableScripts: true, // 启用JS，默认禁用
            retainContextWhenHidden: true, // webview被隐藏时保持状态，避免被重置
        });
        panel.webview.html = 'test';
        
    }).catch((info) => {

    });

    //定义跳转器




    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "mx-plugin" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('mx.plugin', (args) => {
        // The code you place here will be executed every time your command is executed
        vscode.window.showInformationMessage('Hello World!');
    });
    context.subscriptions.push(disposable);

}
// this method is called when your extension is deactivated
export function deactivate() {
    console.info('插件不活动啦。。。。deactivate');
}
