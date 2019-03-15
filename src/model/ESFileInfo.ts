import { FnInfo } from './FnInfo';

export class ESFileInfo {

  functions: Array<FnInfo>;
  
  constructor(data: any = {}) {
    this.functions = data.functions || new Array<FnInfo>();
  }
}