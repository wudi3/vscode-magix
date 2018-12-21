import * as vscode from 'vscode';
import { Cache } from '../utils/CacheUtils';
import { ESFileInfo } from '../model/ESFileInfo';
import { ESFileAnalyzer } from '../utils/ESFileAnalyzer';
import * as fs from 'fs';
import { FnInfo } from '../model/FnInfo';

export class ESFileProvider {
  public static provide(filePath: string, content: string): ESFileInfo | any {
    if (Cache.has(filePath)) {
      return Cache.get(filePath);
    }
    else {
      if (!content) {
        content = fs.readFileSync(filePath, 'UTF-8');
      }
      let info: ESFileInfo | null = ESFileAnalyzer.analyseESFile(content, filePath);
      if (info) {
        Cache.set(filePath, info);
      }
      return info;
    }
  }
  public static provideFnPosition(fnName: string, filePath: string, content: string): vscode.Position {
    let fileInfo: ESFileInfo = this.provide(filePath, content);
    if (!fileInfo) {
      return new vscode.Position(0, 0);
    }
    let fnInfo: FnInfo | undefined = fileInfo.functions.find(fn => {
      return fn.fnName === fnName;
    });
    if (!fnInfo) {
      return new vscode.Position(0, 0);
    }
    return new vscode.Position(fnInfo.startLine, fnInfo.startColumn);
  }
}