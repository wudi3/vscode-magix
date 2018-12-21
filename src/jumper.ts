import * as vscode from 'vscode';
import { Command } from './command';
import * as path from 'path';
import * as fs from 'fs';
import { DBHelper } from './utils/DBHelper';
import { ESFileProvider } from './provider/ESFileProvider';
import { ESFileInfo } from './model/ESFileInfo';


export class Jumper {

  dbHelper: DBHelper | undefined;

  /**
   * 注册 command 和 provider
   * @param context 
   */
  public register(context: vscode.ExtensionContext, dbHelper: DBHelper) {
    this.dbHelper = dbHelper;
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
    const HTML_MODE = [{ language: 'html', scheme: 'file' }];
    let htmlProvider: HtmlDefinitionProvider = new HtmlDefinitionProvider();
    htmlProvider.setDBHelper(this.dbHelper);
    context.subscriptions.push(vscode.languages.registerDefinitionProvider(HTML_MODE, htmlProvider));
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
      let p: Promise<vscode.Location> = new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(new vscode.Location(vscode.Uri.file(path), new vscode.Position(0, 0)));
        }, 1000);
      });
      return p;
    }

  }
}
class HtmlDefinitionProvider implements vscode.DefinitionProvider {
  dbHelper: DBHelper | undefined;
  public setDBHelper(dbHelper: DBHelper | undefined) {
    this.dbHelper = dbHelper;
  }
  provideDefinition(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken) {

    const fileName = document.fileName;
    const workDir = path.dirname(fileName);
    let word = document.getText(document.getWordRangeAtPosition(position, new RegExp('mx-click=\'(.*?)\'|mx-click=\"(.*?)\"')));
    const line = document.lineAt(position);
    word = 'advance<click>';
    let text = line.text.replace(/\s+/g, '');
    let p: Promise<vscode.Location> = new Promise((resolve, reject) => {
      if (text.indexOf('mx-') > -1) {
        if (this.dbHelper) {
          this.dbHelper.getESByHtml(fileName).then((arr: Array<string>) => {
            if (arr.length > 0) {
              let position: vscode.Position = ESFileProvider.provideFnPosition(word, arr[0], '');
              resolve(new vscode.Location(vscode.Uri.file(arr[0]), position));
            }
          });
        }


      }
    });
    return p;

  }
}

