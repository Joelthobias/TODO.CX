const async = require('hbs/lib/async');
var db=require('../config/connection')

module.exports={

    addUser:(data)=>{
        return new Promise(async(resolve,reject)=>{
            db.get().collection("User").insertOne(data).then((response)=>{
                resolve({status:true})
                console.log("user added");
            })
        })

    },
    findUser:(email)=>{
        console.log("Finduser called");
        
        return new Promise(async(resolve,reject)=>{
            let user=await db.get().collection("User").findOne({"email":email})
           if(user){
               console.log("user found " +user.email)
               let data={
                   displayName:user.displayName,
                   email:user.email,
                   photoURL:user.photoURL
               };
               resolve(data)
           }else{
                user=false
                resolve(false)
                console.log("user not found");
           }
           
        })
    },
    addTodo:(data,user)=>{
        return new Promise((resolve,reject)=>{
            
            db.get().collection("User").updateOne({email:user},{$push:{todo:data}}).then(()=>{
                resolve(true)
                console.log("TODO Added");
            })
        })
    },
    Todos:(email)=>{
        return new Promise(async(resolve,reject)=>{
            let todos=await db.get().collection("User")
            .aggregate([
                {
                    $match: { email: email }
                },
                {
                    $unwind: "$todo",
                },{
                    $project: {
                    title: "$todo.title",
                    description: "$todo.description",
                    status:"$todo.status"
                    }
                },
                {
                    $match:{status:{$ne:"deleted"}}
                }
            ]).toArray()
            resolve(todos)
        })
    },
    //sort by status
    viewtodos:(status,email)=>{
        return new Promise(async(resolve,reject)=>{
            let todos=await db.get().collection("User")
            .aggregate([
                {
                    $match: { email: email }
                },
                {
                    $unwind: "$todo",
                },{
                    $project: {
                    title: "$todo.title",
                    description: "$todo.description",
                    status:"$todo.status"
                    }
                },{
                    $match:{status:status}
                }
            ]).toArray()
            resolve(todos)
        })
    }
}