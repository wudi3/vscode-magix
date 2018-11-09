import * as vscode from 'vscode';
import { Command } from './command';
import * as path from 'path';
import * as fs from 'fs';

export class Jumper {
/**
 * 注册 command 和 provider
 * @param context 
 */
  register(context: vscode.ExtensionContext) {
    this.registerCommand(context);
    this.registerProvider(context);
  }
/**
 * 注册command
 * @param context 
 */
  private registerCommand(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.commands.registerCommand(Command.COMMAND_JUMP_TO_HTML, (args) => {
      this.jumpToHtml(args.path);
    }));
    context.subscriptions.push(vscode.commands.registerCommand(Command.COMMAND_JUMP_TO_JTS, (args) => {
      this.jumpToJTS(args.path);
    }));
  }
  /**
   * 注册跳转provider
   * @param context 
   */
  private registerProvider(context: vscode.ExtensionContext) {
    const JTS_MODE = [{ language: 'javascript', scheme: 'file' }, { language: 'typescript', scheme: 'file' }];
    context.subscriptions.push(vscode.languages.registerDefinitionProvider(JTS_MODE, new MXDefinitionProvider()));
  }
  /**
   * 跳转至 js 或 ts 文件
   * @param filePath 
   */
  private jumpToJTS(filePath: string) {
    let dirPath: string = path.dirname(filePath);
    let baseName: string = path.basename(filePath, path.extname(filePath));
    dirPath = path.join(dirPath, baseName);
    let jsPath: string = dirPath + '.js';
    if (!this.tryShowEditor(jsPath)) {
      let tsPath: string = dirPath + '.ts';
      this.tryShowEditor(tsPath);
    }
  }
  /**
   * 跳转至 html文件
   * @param filePath 
   */
  private jumpToHtml(filePath: string) {
    let dirPath: string = path.dirname(filePath);
    let baseName: string = path.basename(filePath, path.extname(filePath));
    dirPath = path.join(dirPath, baseName);
    let htmlPath: string = dirPath + '.html';
    this.tryShowEditor(htmlPath);
  }
  private tryShowEditor(filePath: string): boolean {
    if (fs.existsSync(filePath)) {
      vscode.window.showTextDocument(vscode.Uri.file(filePath));
      return true;
    }
    return false;
  }
}
/**
 * 跳段到定义
 */
class MXDefinitionProvider implements vscode.DefinitionProvider {
  provideDefinition(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken) {
      
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

