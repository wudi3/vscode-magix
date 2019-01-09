import * as vscode from 'vscode';
import { Command } from './command';
import * as path from 'path';
import * as fs from 'fs';
import { ESFileProvider } from './provider/ESFileProvider';
import { ESHtmlMappingDao } from './db/ESHtmlMappingDao';

export class Jumper {

  /**
   * 注册 command 和 provider
   * @param context 
   */
  public register(context: vscode.ExtensionContext) {

    this.registerCommand(context);
    this.registerProvider(context);
  }
  /**
   * 注册command
   * @param context 
   */
  private registerCommand(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.commands.registerCommand(Command.COMMAND_JUMP_TO_HTML, (args) => {
      this.jumpBackAndForth(args.path);
    }));
    context.subscriptions.push(vscode.commands.registerCommand(Command.COMMAND_JUMP_TO_JTS, (args) => {
      this.jumpBackAndForth(args.path);
    }));
    context.subscriptions.push(vscode.commands.registerCommand(Command.COMMAND_JUMP_BACK_AND_FORTH, (args) => {
      
      try {
        let filePath: string = '';
        if (args && args.path) {
          filePath = args.path;
        } else {
          let editor: vscode.TextEditor | undefined = vscode.window.activeTextEditor
          if (editor) {
            filePath = editor.document.fileName;
          }
        }
        if (filePath !== '') {
          this.jumpBackAndForth(filePath);
        }

      } catch (error) {
        console.error(error);
      }

    }));
  }
  /**
   * 注册跳转provider
   * @param context 
   */
  private registerProvider(context: vscode.ExtensionContext) {

    const JTS_MODE = [{ language: 'javascript', scheme: 'file' }, { language: 'typescript', scheme: 'file' }];
    context.subscriptions.push(vscode.languages.registerDefinitionProvider(JTS_MODE, new MXDefinitionProvider()));
    context.subscriptions.push(vscode.languages.registerDefinitionProvider(JTS_MODE,new MXInnerDefinitionProvider()));
    const HTML_MODE = [{ language: 'html', scheme: 'file' }];
    let htmlProvider: HtmlDefinitionProvider = new HtmlDefinitionProvider();
    context.subscriptions.push(vscode.languages.registerDefinitionProvider(HTML_MODE, htmlProvider));
  }

  private jumpBackAndForth(filePath: string) {
    let extName: string = path.extname(filePath);
    let dao: ESHtmlMappingDao = new ESHtmlMappingDao();
    if (extName === '.ts' || extName === '.js') {
      dao.getHtmlByES(filePath).then((arr: Array<string>) => {
        if (arr.length > 0) {
          let jsPath: string = arr[0];
          this.tryShowEditor(jsPath);
        }
      });
    } else if (extName === '.html') {
      dao.getESByHtml(filePath).then((arr: Array<string>) => {
        if (arr.length > 0) {
          let jsPath: string = arr[0];
          this.tryShowEditor(jsPath);
        }
      });
    }
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
    let word = document.getText(document.getWordRangeAtPosition(position, new RegExp('\'(.*?)\'|\"(.*?)\"')));
    const line = document.lineAt(position);
    if(word === ''){
      word = document.getText(document.getWordRangeAtPosition(position, new RegExp('\.(.*?)\(')));
    }
    //const projectPath = util.getProjectPath(document);
    let text = line.text.replace(/\s+/g, '');
    if (text.indexOf('tmpl:') > -1) {
      let path = workDir + '/' + word.replace(/(^\'*)|(\'*$)/g, '').replace(/(^\"*)|(\"*$)/g, '').replace('@', '');
      return new vscode.Location(vscode.Uri.file(path), new vscode.Position(0, 0));
    }

  }
}
/**
 * magix 内部函数跳转
 */
class MXInnerDefinitionProvider implements vscode.DefinitionProvider {
  provideDefinition(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken) {

    const fileName = document.fileName;
    //const workDir = path.dirname(fileName);
   // const  word = document.getText(document.getWordRangeAtPosition(position, new RegExp('\.(\w*?)\(')));
    const line = document.lineAt(position);
   
    let arr:any = line.text.match(/.(\w+)\(/);
    if(arr.length === 2){
      let position: vscode.Position = ESFileProvider.provideFnPosition(arr[1], fileName, document.getText());
      return  new vscode.Location(document.uri, position);
    }
    

  }
}
class HtmlDefinitionProvider implements vscode.DefinitionProvider {

  provideDefinition(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken) {

    const fileName = document.fileName;
    
    let word = document.getText(document.getWordRangeAtPosition(position, new RegExp('mx-[a-z]+\s*=\s*\'(.*?)\'|mx-[a-z]+\s*=\s*\"(.*?)\"')));
   
    // word = 'advance<click>';
    let mappingDao: ESHtmlMappingDao = new ESHtmlMappingDao();
    let p: Promise<vscode.Location> = new Promise((resolve, reject) => {
      if (word.indexOf('mx-') > -1) {
        let mx = word.match(/mx-[a-z]+/);
        if(mx && mx.length > 0){
          let mxMethod = mx[0].replace('mx-', '');
          let userMethod = word.replace(/mx-[a-z]+\s*=\s*\'|mx-[a-z]+\s*=\s*\"/, '');
          userMethod = userMethod.replace(/(\(.*?\)|\s*)(\'|\")/, '');
          let fnName: Array<string> = [userMethod, userMethod + '<' + mxMethod + '>'];
  
          mappingDao.getESByHtml(fileName).then((arr: Array<string>) => {
            if (arr.length > 0) {
              let position: vscode.Position = ESFileProvider.provideFnPosition(fnName, arr[0], '');
              resolve(new vscode.Location(vscode.Uri.file(arr[0]), position));
            }
          });
        }
       



      }
    });
    return p;

  }
}

