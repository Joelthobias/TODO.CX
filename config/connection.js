const { MongoClient } = require("mongodb");

const state={
    db:null
}
module.exports.connect=(done)=>{
//     const url ='mongodb://localhost:27017'
    const url='mongodb+srv://joel:Qwertyuiop@1@cluster0.chsu5.mongodb.net/admin'
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
