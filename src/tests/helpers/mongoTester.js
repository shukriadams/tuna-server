module.exports = class {

    constructor(mongoComponent){
        this.mongoComponent =  Object.assign({}, mongoComponent);
        
        if (!this.mongoComponent.mongoHelper)
            throw 'MongoComponent must expost mongoHelper';

        let _in = {

        };
        let out ={
            err : null,
            // set this to whatever object should be returned in result. will be packed into whatever structure
            // a specific mongo call expect
            resuls : null,
            isDone : false
        }
        
        this.in = _in;
        this.out = out;

        this.mongoCollection = {
            insertOne(record, callback){
                _in = record;

                // result must be be packed into "opts" array
                callback(out.err, { ops : out.result ? [out.result] : [] } );
            },
            
            insertMany(records, callback){
                callback(out.err);
            },

            updateOne(query, record, callback){
                callback(out.err)
            },

            deleteOne(query, callback){
                callback(out.err)
            },

            deleteMany(query, callback){
                callback(out.err)
            },

            find(query) {
                return {
                    toArray(callback){

                        callback(out.err, out.result ? [out.result] : [])
                    }
                }
            },

            findOne(query, callback){
                callback(out.err, out.result)
            }

        }

        this.mongoComponent.mongoHelper.getCollection=(collectionName)=> {
            this.mongoCollection.name = collectionName;

            return {
                collection : this.mongoCollection,

                // done should be called after each transaction to clean up
                done(){
                    out.isDone = true;
                }
            }
            
        }
    }

}