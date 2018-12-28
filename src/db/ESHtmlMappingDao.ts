
import { SqliteConnection } from "./SqliteConnection";

export class ESHtmlMappingDao{
  
   /**
   * 添加 js、ts文件与html模板文件的映射关系
   * @param esPath 
   * @param htmlPath 
   */
  public addESHtmlFileMapping(esPath: string, htmlPath: string) {
    SqliteConnection.open().run("INSERT INTO es_html_mapping (es_path,html_path) VALUES (?,?);",
      esPath,
      htmlPath
    );
  }
  public deleteMappingByES(esPath: string) {
    SqliteConnection.open().run("DELETE FROM es_html_mapping WHERE es_path = ?;",
      esPath
    );
  }
  public getESByHtml(htmlPath:string):Promise<Array<string>>{
    return new Promise((resolve,reject)=>{
      let arr:Array<string>=new Array<string>();
      SqliteConnection.open().each("select es_path from es_html_mapping where html_path = ? ",htmlPath, (error: any, row: any) => {
        arr.push(row.es_path);
      },(error:any,count:number)=>{
        if(error){
          reject(error);
        }else{
          resolve(arr);
        }
      });
    });
  }
  public getHtmlByES(esPath:string):Promise<Array<string>>{
    return new Promise((resolve,reject)=>{
      let arr:Array<string>=new Array<string>();
      SqliteConnection.open().each("select html_path from es_html_mapping where es_path = ? ",esPath, (error: any, row: any) => {
        arr.push(row.html_path);
      },(error:any,count:number)=>{
        if(error){
          reject(error);
        }else{
          resolve(arr);
        }
      });
    });
  }

  
}