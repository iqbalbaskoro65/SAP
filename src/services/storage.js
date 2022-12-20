import { Drivers, Storage } from "@ionic/storage";
import * as CordovaSQLiteDriver from "localforage-cordovasqlitedriver";
// const STORAGE_KEY = "mylist";

const storage = new Storage({
  name: "SAPDatabase",
  driverOrder: [
    CordovaSQLiteDriver._driver,
    Drivers.IndexedDB,
    Drivers.LocalStorage,
  ],
});
storage.defineDriver(CordovaSQLiteDriver);
storage.create();
console.log("Storage connected");
export default {
  getData(STORAGE_KEY) {
    return storage.get(STORAGE_KEY) || [];
  },
  async addData(STORAGE_KEY, item) {
    const storedData = (await storage.get(STORAGE_KEY)) || [];
    storedData.push(item);
    return storage.set(STORAGE_KEY, storedData);
  },
  async removeData(STORAGE_KEY, index) {
    const storedData = (await storage.get(STORAGE_KEY)) || [];
    storedData.splice(index, 1);
    return storage.set(STORAGE_KEY, storedData);
  },
  async clearData(STORAGE_KEY) {
    return await storage.remove(STORAGE_KEY);
  },
};
