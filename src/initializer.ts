import {window,commands} from 'vscode';

export class Initializer{
   test(params:string) {
    commands.getCommands(true);
  }
  init(){

  }
}