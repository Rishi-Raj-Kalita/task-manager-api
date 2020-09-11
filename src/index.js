const express= require('express')
require('./db/mongoose')
const User=require('./models/user')
const Task=require('./models/task')
const userRouter= require('./routers/users')
const taskRouter=require('./routers/tasks')

const app=express()
const port= process.env.Port 

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)


app.listen(port,()=>{
    console.log('Server is up on '+port)
})


//uploading playground
//uploads a file of doc or docx type with max size limit 1mb
/*
const multer =require('multer)
const upload = multer({
    dest:'images',
    limits:{
        fileSize:1000000 //(1mb)
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(doc|docx)$/)) // if file is not doc and docx type . can remember this line
        {
            return cb(new Error('Please upload doc or docx document'))
        }
        cb(undefined,true)
    }
})

app.post('/upload',upload.single('upload'),(req,res)=>{
    res.send()
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
}

*/ 