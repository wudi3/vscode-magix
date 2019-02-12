import * as fs from 'fs';
import * as request from 'request';

export class Iconfont{
  writeTempFiles(fontInfo:FontInfo){
    request(fontInfo.url, (error: any, response: any, body: any) => {
      if (!error && response.statusCode === 200) {
        console.log(body);
      } else {
        console.log('send log error');
      }
    });
  }
}
export class FontInfo{
  public fontFamily:string;
  public url:string;
  public className:string;
  constructor(){
    this.fontFamily = '';
    this.url = '';
    this.className = '';
  }
}