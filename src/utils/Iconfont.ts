
const request = require('request');

export class Iconfont{
  s:string = `<?xml version="1.0" standalone="no"?>
  <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd" >
  <svg width="100" height="100">
      <path d="M770.301 171.596l-42.485-42.485-212.41 212.41-212.414-212.41-42.464 42.485 212.403 212.41-212.403 212.41 42.464 42.48 212.414-212.41 212.41 212.406 42.485-42.48-212.41-212.406 212.41-212.41z"  fill="#000" stroke="#fff" stroke-width="10" />
  </svg>`;
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