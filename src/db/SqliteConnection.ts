

export class SqliteConnection {
  private static db: any;
  public static init(sql: string, path: string | undefined): Promise<any> {
  
    return new Promise((resolve, reject) => {
      resolve();
    });
  }

  public static open(): any {
    if (this.db) {
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