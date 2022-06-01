const { MongoClient } = require("mongodb");

const state={
    db:null
}
module.exports.connect=(done)=>{
    // const url ='mongodb://localhost:27017'
    const url='mongodb+srv://joel:123@cluster0.chsu5.mongodb.net/test'
    const dbname='todo'
    
    MongoClient.connect(url,(err,data)=>{
        if(err) return done(err)
        state.db=data.db(dbname)
        done()
    })
}
module.exports.get=()=>{
    return state.db
}
