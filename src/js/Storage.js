
function ChromeStorage(storage){
    this._storage = storage;
}

ChromeStorage.prototype.set = function(keyValue, callback){
    this._storage.sync.set(keyValue, callback);
}

ChromeStorage.prototype.get = function(keys, callback){
    this._storage.sync.get(keys, callback);
}