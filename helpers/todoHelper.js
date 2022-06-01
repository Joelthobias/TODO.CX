const async = require('hbs/lib/async');
var db=require('../config/connection')
var todoHelper=require('./todoHelper')
module.exports={

    addUser:(data)=>{
        return new Promise(async(resolve,reject)=>{
            db.get().collection("User").insertOne(data).then((response)=>{
                
                resolve(true)
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
               resolve(true)
           }else{
                resolve(false)
                console.log("user not found");
           }
           
        })
    },
    addTodo:(data,user)=>{
        return new Promise((resolve,reject)=>{
            data.fav=false
            data.completed=false
            
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
                    deleted:"$todo.deleted",
                    fav:"$todo.fav",
                    completed:"$todo.completed",
                    Date:"$todo.Date"
                    }
                },
                {
                    $match:{deleted:{$ne:"true"}}
                },{ $sort : { Date : 1 } }
            ]).toArray()
            resolve(todos)
        })
    },
    //sort by status
    viewtodos:(status,email)=>{
        return new Promise(async(resolve,reject)=>{
            if(status=="fav"){
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
                        deleted:"$todo.deleted",
                        fav:"$todo.fav",
                        completed:"$todo.completed",
                        Date:"$todo.Date"
                        }
                    },{
                        $match:{fav:true}
                    }
                ]).toArray()
                resolve(todos)
            } else if (status == "completed") {

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
                        deleted:"$todo.deleted",
                        fav:"$todo.fav",
                        completed:"$todo.completed",
                        }
                    },{
                        $match:{completed:true}
                    }
                ]).toArray()
                resolve(todos)
            }else{
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
                        deleted:"$todo.deleted",
                        fav:"$todo.fav",
                        completed:"$todo.completed"
                        }
                    },{
                        $match:{deleted:true}
                    }
                ]).toArray()
                resolve(todos)
            }
        })
    },

    getTodo:(email,date)=>{
        return new Promise(async(resolve,reject)=>{
            let st=await db.get().collection("User").aggregate([
                {
                    $match: { email: email }
                },
                {
                    $unwind: "$todo",
                },{
                    $project: {
                    title: "$todo.title",
                    description: "$todo.description",
                    deleted:"$todo.deleted",
                    fav:"$todo.fav",
                    completed:"$todo.completed",
                    Date:"$todo.Date"
                    }
                },{
                    $match:{Date:date}
                }
                ]).toArray()
                resolve(st)
        })
    },
    //change status
    changeStatus:(status,date,email)=>{
        return new Promise(async(resolve,reject)=>{
            if(status==="fav"){
                console.log("update fav");
                let st=await module.exports.getTodo(email,date)
                let stss=st[0].fav
                console.log(stss);
                let sts
                if(stss===true){
                     sts=false
                }else{
                     sts=true
                }
                let todos=await db.get().collection("User").findOneAndUpdate(
                    { email: email, "todo.Date": date},
                    { $set: { "todo.$.fav" :sts} }
                    ).then((response)=>{
                        // console.log(response);
                        resolve(true)
                    })
                                       
            }else if(status=="completed"){
                console.log("update completed");
                let st=await module.exports.getTodo(email,date)
                let stss=st[0].completed
                console.log(stss);
                let sts
                if(stss===true){
                     sts=false
                }else{
                     sts=true
                }
                let todos=await db.get().collection("User").updateOne(
                    { email: email, "todo.Date": date},
                    { $set: { "todo.$.completed" : sts } }
                    ).then((response)=>{
                        resolve(true)
                        console.log(response);
                    })
            }else{
                let st=await module.exports.getTodo(email,date)
                let stss=st[0].deleted
                console.log(stss);
                let sts
                if(stss===true){
                     sts=false
                }else{
                     sts=true
                }
                let todos=await db.get().collection("User").updateOne(
                    { email: email, "todo.Date": date},
                    { $set: { "todo.$.deleted" : sts } }
                    ).then((response)=>{
                        resolve(true)
                        console.log(response);
                    })
            }
        })
    }
}
