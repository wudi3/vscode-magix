import { FnInfo } from "../model/FnInfo";

export class HtmlFileInfoDao{
  db:any;
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

    me.db.each("SELECT rowid AS id, info FROM lorem", function (err:any, row:any) {
      console.log(row.id + ": " + row.info);
    });

  }
}