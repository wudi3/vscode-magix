'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { Initializer } from './initializer';
import { Command } from './command';
import {ToDefinitionCommand} from './command/ToDefinitionCommand';
import {DiamondCommand} from './command/DiamondCommand';
import { MXDefinitionProvider, MXInnerDefinitionProvider, HtmlDefinitionProvider } from './provider/VSDefinitionProvider';
import { MXEventCompletionItemProvider } from './provider/VSCompletionItemProvider';
import {ConfigManager} from './utils/ConfigManager';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {



    //初始化期，初始化基本数据
    new Initializer().init().then(() => {
        //注册跳转到定义command
        let command: ToDefinitionCommand = new ToDefinitionCommand();
        command.registerCommand(context);

        let  diamondCommand:DiamondCommand = new DiamondCommand();
        diamondCommand.registerCommand(context);

        //注册es代码跳转command
        const JTS_MODE = [{ language: 'javascript', scheme: 'file' }, { language: 'typescript', scheme: 'file' }];
        context.subscriptions.push(vscode.languages.registerDefinitionProvider(JTS_MODE, new MXDefinitionProvider()));
        context.subscriptions.push(vscode.languages.registerDefinitionProvider(JTS_MODE, new MXInnerDefinitionProvider()));
        //注册html代码跳转
        const HTML_MODE = [{ language: 'html', scheme: 'file' }];
        context.subscriptions.push(vscode.languages.registerDefinitionProvider(HTML_MODE, new HtmlDefinitionProvider()));
        //注册代码提示
        context.subscriptions.push(vscode.languages.registerCompletionItemProvider(HTML_MODE, new MXEventCompletionItemProvider(),'=','\'','"'));
       
        initViews();
        
    }).catch((info) => {

    });

    console.log('Congratulations, your extension "mx-plugin" is now active!');

    let disposable = vscode.commands.registerCommand('mx.plugin', (args) => {
       
        vscode.window.showInformationMessage('Hello World!');
    });
    context.subscriptions.push(disposable);

}

export function deactivate() {
    console.info('插件不活动啦。。。。deactivate');
}

function initViews(){

    let config:any = ConfigManager.read();

    let status = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right,100);
    status.text="Diamond日常";
    if(config.diamond.daily.appName){
        status.tooltip = 'http://www.baidu.com';
    }
    status.show();
    status.command=Command.COMMAND_DIAMOND_OPEN_DAILY;

    status = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right,100);
    status.text="Diamond预发";
    if(config.diamond.pre.appName){
        status.tooltip = 'http://www.baidu.com';
    }
    status.show();
    status.command=Command.COMMAND_DIAMOND_OPEN_PRE;
}