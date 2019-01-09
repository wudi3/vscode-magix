import { window,  TextEditor } from 'vscode';
import { DBHelper } from './db/DBHelper';
import { ESFileInfo } from './model/ESFileInfo';
import { Cache } from './utils/CacheUtils';
import { ESFileAnalyzer } from './utils/ESFileAnalyzer';
import * as fs from 'fs';
import * as path from 'path';
import * as fut from './utils/FileUtils';
//import * as parse5 from 'parse5';
import { ESHtmlMappingDao } from './db/ESHtmlMappingDao';


export class Initializer {
  /**
   * 扫描项目文件夹
   */
  private scanFile() {

    let fileList: Array<string> = [];
    let rootPath = fut.FileUtils.getProjectPath(undefined);
    this.listFiles(rootPath, fileList);
    let mappingDao:ESHtmlMappingDao  = new ESHtmlMappingDao();
    fileList.forEach((filePath) => {
      let extName = path.extname(filePath);
      if (filePath.indexOf('src') < 0) {
        return;
      }
      if (extName === '.html') {
        let content = fs.readFileSync(filePath, 'UTF-8');
       // let document: parse5.Document = parse5.parse(content, { scriptingEnabled: false, sourceCodeLocationInfo: true });
      
        var reg = new RegExp('<(\S*?)[^>]*>.*?|<.*? />', "g");
        let strArr = content.match(reg);
        if (strArr) {
          strArr.forEach(element => {
          });
        }
      }
      else if (extName === '.ts' || extName === '.js') {

        let content = fs.readFileSync(filePath, 'UTF-8');
        try {

          content.match(/(['"]?)tmpl\1.*?\@([^'"]*?)['"]/gi);
          console.log('strArr', RegExp.$2);
          let tmplVal:string = RegExp.$2;
          if(tmplVal){
            mappingDao.addESHtmlFileMapping(filePath, path.join(path.dirname(filePath), tmplVal));
          }else{
            //KISSY 版本
           let index:number = content.search(/\s*KISSY\s*\.\s*add\s*\(/g);
           if(index === 0){
            let htmlPath:string = path.join(path.dirname(filePath),path.basename(filePath).replace(path.extname(filePath),'.html'));
            mappingDao.addESHtmlFileMapping(filePath, htmlPath);
           }
          }
         

        } catch (error) {

        }
      }else if(extName === '.es'){
        let htmlPath:string = path.join(path.dirname(filePath),path.basename(filePath).replace(path.extname(filePath),'.html'));
        mappingDao.addESHtmlFileMapping(filePath, htmlPath);
      }
    });


    console.log('done');
  }

  /**
   * 列出项目所有文件
   * @param parentPath 
   * @param fileList 
   */
  private listFiles(parentPath: string, fileList: Array<string>) {
    let files = fs.readdirSync(parentPath);
    if (parentPath.indexOf('/.') > -1 || parentPath.indexOf('node_modules') > -1) {
      return;
    }

    files.forEach((item) => {
      item = path.join(parentPath, item);
      let stat = fs.statSync(item);
      try {
        if (stat.isDirectory()) {
          this.listFiles(item, fileList);
        }
        else if (stat.isFile()) {
          fileList.push(item);
        }
      } catch (error) {
        console.log(error);
      }
    });

  }
 
  private startWatching() {
    //当编辑窗口活动时分析其内容
    window.onDidChangeActiveTextEditor((e: any) => {
      let editor: TextEditor | undefined = window.activeTextEditor;
      if (editor && editor.document) {
        let path: string = editor.document.uri.path;
        let languageId: string = editor.document.languageId;
        if (languageId === 'typescript' || languageId === 'javascript') {
          let info: ESFileInfo | null = ESFileAnalyzer.analyseESFile(editor.document.getText(), path);
          if (info) {
            Cache.set(path, info);
            console.log(Cache.get(path));
          }
        }
      }
    });

  }
  public init(): Promise<any> {
    
    return new Promise((resolve, reject) => {
//       request('http://www.baidu.com', function (error, response, body) {
//   if (!error && response.statusCode == 200) {
//     console.log(body); // 打印google首页
//   }
// });
      DBHelper.init('').then(() => {
        this.startWatching();
        this.scanFile();
        resolve();
      }).catch((info) => {
        console.error(info);
        reject(info);
      });
    });
  }

}