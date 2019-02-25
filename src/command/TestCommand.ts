import * as vscode from 'vscode';
import { Command } from '../command';
import { Iconfont, FontInfo } from '../utils/Iconfont';


export class TestCommand {
  registerCommand(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.commands.registerCommand(Command.COMMAND_TEST, (args) => {
     vscode.window.showInformationMessage('test');
     let fontInfo: FontInfo = new FontInfo();
     fontInfo.url = 'https://at.alicdn.com/t/font_386526_gh37yvyi89d.svg#iconfont';
     let iconfont: Iconfont = new Iconfont();
     iconfont.writeTempFiles(fontInfo);
    
    
     
    }));
   
  }

}