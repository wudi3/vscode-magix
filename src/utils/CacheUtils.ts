
const MapLRU = require("map-lru").default;
//https://www.npmjs.com/package/map-lru/v/1.0.2
export class Cache {
  static cache = new MapLRU(1000);
 
 
  static get(key: string) {
    return this.cache.get(key);
  }
  static set(key: string, obj: any) {
    return this.cache.set(key, obj);
  }
  static has(key: string) {
    return this.cache.has(key);
  }

}