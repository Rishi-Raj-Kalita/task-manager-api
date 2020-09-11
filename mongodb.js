//CRUD create read update and delete
const {MongoClient,ObjectID}= require('mongodb')

const connectURL= 'mongodb://127.0.0.1:27017'
const databaseName='task-manager'

MongoClient.connect(connectURL,{useNewUrlParser:true},(error,client)=>{
    if(error)
    {
        return console.log('unable to connect')
    }

    //console.log('connected to server')
    const db = client.db(databaseName)


    db.collection('users').deleteMany({
        age:20
    }).then((result)=>{
        console.log(result)
    }).catch((error)=>{
        console.log(error)
    })
  
  


    /*db.collection('tasks').updateMany({
        completed:true
    },{
        $set:{
            completed:false
        }
    }).then((result)=>{
        console.log(result)
    }).catch((error)=>{
        console.log(error)
    })*/
  
  
  
    /* db.collection('users').updateOne({
       _id: new ObjectID("5f4fe60a551de06a3c17b0f5")
   },{
       $set:{
           name:'tony'
       }
   }).then((result)=>{
       console.log(result)
   }).catch((error)=>{
       console.log(error)
   })*/

   
   /* db.collection('users').findOne({_id: new ObjectID("5f4fe88ab093ce5654f2a86f")},(error,user)=>{
        if(error)
        {
            return console.log('Unable to fetch')
        }
        console.log(user)
       
    })

    db.collection('users').find({age:20}).toArray((error,users)=>{
        if(error)
        {
            return(console.log('Unable to fetch'))
        }
        console.log(users)
    })


     /*db.collection('users').insertOne({
        name:'Rishi',
        age:20
    },(error,result)=>{
        if(error)
        {
        return(console.log(''))
        }
        console.log(result.ops)  
    
    })*/

    /*db.collection('users').insertMany([
        {
            name:'rishi',
            age:19
        },
        {
            nmae:'raj',
            age:20
        }
        ],(error,result)=>{
            if(error)
            {
                return(console.log('unable to insert document'))
            }
            console.log(result.ops)
        })

        /*db.collection('tasks').insertMany([
            {
                description:'homeework',
                completed:true
            },
            {
                description:'workout',
                completed:true
            },
            {
                description:'bath',
                completed:false
            }
        ],(error,result)=>{
            if(error)
            {
                return(console.log('uable to insert task'))
            }
            console.log(result.ops)
        })*/
        
    
    
    })
