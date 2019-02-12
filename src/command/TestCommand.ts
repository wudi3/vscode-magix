import * as vscode from 'vscode';
import { Command } from '../command';

export class TestCommand {
  registerCommand(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.commands.registerCommand(Command.COMMAND_TEST, (args) => {
     vscode.window.showInformationMessage('test');
     let editor:vscode.TextEditor | undefined = vscode.window.activeTextEditor;
     if(editor){
      //editor.selection = new vscode.Selection(1, 0, 7, 0);
      //vscode.commands.executeCommand('editor.fold');
      //vscode.commands.executeCommand('editor.unfoldRecursively');
      //vscode.commands.executeCommand('editor.unfoldRecursively');
      //vscode.commands.executeCommand('editor.unfold');
      editor.revealRange(new vscode.Range(new vscode.Position(1,0),new vscode.Position(7,0)),vscode.TextEditorRevealType.Default);
      vscode.commands.executeCommand('editor.action.showReferences');
     }
    
    
     
    }));
   
  }

}