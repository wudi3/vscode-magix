
import { FnInfo } from '../model/FnInfo';


const sqlite3 = require('sqlite3').verbose();

export class DBHelper {
  private db: any;
  constructor(path: string | undefined) {
    if (!path) {
      this.db = new sqlite3.Database(':memory:');
    }
    else {
      this.db = new sqlite3.Database(path);
    }

  }
  init(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        let sql = `
        CREATE TABLE es_html_mapping (es_path TEXT,html_path TEXT);
        CREATE TABLE es (path TEXT,html_path TEXT,fn TEXT,fn_start_line INTEGER,fn_start_column INTEGER,fn_end_line INTEGER,fn_end_column INTEGER );
        CREATE TABLE html_mx (path TEXT,fn TEXT,fn_start_line INTEGER,fn_start_column INTEGER,fn_end_line INTEGER,fn_end_column INTEGER )
        `;
        this.db.run(sql, function (info: any) {
          if (info) {
            reject(info);
          } else {
            resolve();
          }
        });
      });
    });
  }
  /**
   * 添加 js、ts文件与html模板文件的映射关系
   * @param esPath 
   * @param htmlPath 
   */
  public addESHtmlFileMapping(esPath: string, htmlPath: string) {
    this.db.run("INSERT INTO es_html_mapping (es_path,html_path) VALUES (?,?);",
      esPath,
      htmlPath
    );
  }
  public deleteMappingByES(esPath: string) {
    this.db.run("DELETE FROM es_html_mapping WHERE es_path = ?;",
      esPath
    );
  }
  public getESByHtml(htmlPath:string):Promise<Array<string>>{
    return new Promise((resolve,reject)=>{
      let arr:Array<string>=new Array<string>();
      this.db.each("select es_path from es_html_mapping where html_path = ? ",htmlPath, (error: any, row: any) => {
        arr.push(row.es_path);
      },(error:any,count:any)=>{
        if(error){
          reject(error);
        }else{
          resolve(arr);
        }
      });
    });
  }
  addESFnInfo(fnInfo: FnInfo) {
    this.db.run("INSERT INTO es (path,html_path,fn,fn_start_line,fn_start_column,fn_end_line,fn_end_column) VALUES (?,?,?,?,?,?,?);",
      'fnInfo.path', 'fnInfo.htmlPath', fnInfo.fnName, fnInfo.startLine, fnInfo.startColumn, fnInfo.endLine, fnInfo.endColumn);
  }
  
  getAll() {
    if (this.db) {
      this.db.each("select fn from es where fn = 'getParams' limit 0,10", (error: any, row: any) => {
        console.log(row.fn);
      });
    }
  }
  test() {
    let me = this;

    var stmt = this.db.prepare("INSERT INTO lorem VALUES (?)");
    for (var i = 0; i < 10; i++) {
      stmt.run("Ipsum " + i);
    }
    stmt.finalize();

    me.db.each("SELECT rowid AS id, info FROM lorem", function (err, row) {
      console.log(row.id + ": " + row.info);
    });

  }

  close() {
    if (this.db) {
      this.db.close();
    }
  }
}