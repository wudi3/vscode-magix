import * as vscode from 'vscode';
import {Command} from '../command';
const opn = require('opn');
export class DiamondCommand{
  registerCommand(context: vscode.ExtensionContext){
    context.subscriptions.push(vscode.commands.registerCommand(Command.COMMAND_DIAMOND_OPEN_DAILY, (args) => {
      opn('http://diamond.alibaba.net/diamond-ops/static/pages/config/index.html?serverId=daily&dataId=&group=&appName=branding-crm&version=1546431548037');
    }));
    context.subscriptions.push(vscode.commands.registerCommand(Command.COMMAND_DIAMOND_OPEN_PRE, (args) => {
      opn('http://diamond.alibaba-inc.com/diamond-ops/static/pages/config/index.html?serverId=pre&dataId=&group=&appName=branding-crm&version=1546667119311');
    }));
  }
}
