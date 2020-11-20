const MongoClient = require('mongodb').MongoClient;



exports.findOne = async (url,dba,coll,obj,callback) => {

    const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true  })
    
        .catch(err => { console.log(err); });

    if (!client) {
        return;
    }

    try {

        const db = client.db(dba);

        let collection = db.collection(coll);

        let query = obj

        let res = await collection.findOne(query)

        if(res){
            return callback(true)
        }else{
            return callback(false)
        }
        //return callback(res)
 
    } catch (err) {

        console.log(err);
    } finally {
        
        client.close();
       
    }
    
}

