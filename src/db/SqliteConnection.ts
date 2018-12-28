const sqlite3 = require('sqlite3').verbose();

export class SqliteConnection {
  private static db: any;
  public static init(sql: string, path: string | undefined): Promise<any> {
    if (path) {
      this.db = new sqlite3.Database(path);
    }
    else {
      this.db = new sqlite3.Database(':memory:');
    }
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
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

  public static open(): any {
    if (!this.db) {
      throw new Error('sqlite3 is not init');
    }
    return this.db;
  }

  public static close() {
    if (this.db) {
      this.db.close();
    }
  }
}