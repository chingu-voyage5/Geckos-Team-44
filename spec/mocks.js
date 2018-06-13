
chromeMock = {
	runtime: {
		error: null
	},
	storage: {
        data: {},
		sync: {
			set: function(keyValues, callback){
                for (key in keyValues)
                    chromeMock.storage.data[key] = JSON.stringify(keyValues[key]);
                if (callback !== undefined )
                    callback();
            },

			get: function(keys, callback){
                let results = {}
                if (keys === null)
                    return chromeMock.storage.data
                for (key of keys){
                    let result = JSON.parse(chromeMock.storage.data[key]);
                    if (result)
                        results[key] = result;
                }
                callback(results);}
		}
	}
}
