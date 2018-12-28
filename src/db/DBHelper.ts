
import { SqliteConnection } from './SqliteConnection';

export class DBHelper {

  public static init(path: string | undefined): Promise<any> {
    let sql: string = `
    CREATE TABLE es_html_mapping (es_path TEXT,html_path TEXT);
    CREATE TABLE es (path TEXT,html_path TEXT,fn TEXT,fn_start_line INTEGER,fn_start_column INTEGER,fn_end_line INTEGER,fn_end_column INTEGER );
    CREATE TABLE html_mx (path TEXT,fn TEXT,fn_start_line INTEGER,fn_start_column INTEGER,fn_end_line INTEGER,fn_end_column INTEGER )
    `;
    return SqliteConnection.init(sql, path);
  }
  public static close() {
    SqliteConnection.close();
  }

}