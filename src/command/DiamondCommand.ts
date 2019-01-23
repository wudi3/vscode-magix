import * as vscode from 'vscode';
import { Command } from '../command';
const opn = require('opn');
import { ConfigManager } from '../utils/ConfigManager';


export class DiamondCommand {

  private readonly dailyUrl: string = 'http://diamond.alibaba.net/diamond-ops/static/pages/config/index.html';
  private readonly preUrl: string = 'http://diamond.alibaba-inc.com/diamond-ops/static/pages/config/index.html';

  registerCommand(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.commands.registerCommand(Command.COMMAND_DIAMOND_OPEN_DAILY, (args) => {
      let config: any = ConfigManager.read();
      let daily = config.diamond.daily;
      this.open(daily, this.dailyUrl, context);
    }));
    context.subscriptions.push(vscode.commands.registerCommand(Command.COMMAND_DIAMOND_OPEN_PRE, (args) => {
      let config: any = ConfigManager.read();
      let pre = config.diamond.pre;
      this.open(pre, this.preUrl, context);
    }));
  }
  open(diamondConfig: any, url: string, context: vscode.ExtensionContext) {

    if (diamondConfig.serverId && diamondConfig.appName) {
      opn(url + '?serverId=' + diamondConfig.serverId +
        '&dataId=' + diamondConfig.dataId +
        '&group=' + diamondConfig.group +
        '&appName=' + diamondConfig.appName
      );
    } else {
      vscode.window.showWarningMessage('没有配置diamond信息').then((value: any) => {
        ConfigManager.openConfigPanel(context);
      });
    }
  }
}
