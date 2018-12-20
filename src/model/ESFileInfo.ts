import { FnInfo } from './FnInfo';

export class ESFileInfo {
  path: string;
  htmlPath: string;
  functions: Array<FnInfo>;
  constructor(data: any = {}) {
    this.path = data.path || "";
    this.htmlPath = data.htmlPath || "";
    this.functions = data.functions || new Array<FnInfo>();
  }
}