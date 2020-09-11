const express= require('express')
const multer=require('multer')
const User= require('../models/user')
const auth=require('../middleware/auth')
const {sendWelcomeEmail,sendCancellationEmail}= require('../emails/account')
const router= new express.Router()

router.post('/users',async (req,res)=>{
    const user= new User(req.body)
 
    try{
        await user.save()
        sendWelcomeEmail(user.email,user.name)
        const token =await user.generateAuthToken()
        res.status(201).send({user,token})
    }
    catch(e){
        res.status(400).send(e)
        
    }
 })

 router.post('/users/login',async(req,res)=>{
     try{
         const user= await User.findByCredentials(req.body.email,req.body.password)
         const token =await user.generateAuthToken() //user beacuse auth token is created for indiv user

         res.send({user,token})
     }
     catch(e)
     {
         res.status(400).send(e)
     }
 })
 
router.post('/users/logout',auth,async(req,res)=>{
    try{
        req.user.tokens=req.user.tokens.filter((token)=>{
            return(token.token!==req.token)
        })
        await req.user.save()
        res.send()
    }
    catch(e)
    {
        res.status(400).send()
    }
})

router.post('users/logoutAll',auth,async(req,res)=>{
    try{
        req.user.tokens=[]
        await req.user.save()
        res.send()
    }catch(e)
    {
        res.status(500).send()
    }
})

 router.get('/users/me',auth,async (req,res)=>{
        
    res.send(req.user)
    
 })
 
 
 
 router.patch('/users/me',auth,async(req,res)=>{
 
     const updates = Object.keys(req.body)  //takes name, email, age , password  Object.keys
     const allowedUpdates=['name','email','password','age']
     const isValidOperation = updates.every((update)=>{
         return allowedUpdates.includes(update)
     })
 
     if(!isValidOperation)
     {
         return res.status(400).send({error:'Invalid Operation'})
 
     }
     try{
        // to activate middleware otherwise we wont be able to hash the passwords given during update
        //const user =await User.findById(req.params.id)
        updates.forEach((update)=>{
            req.user[update]=req.body[update]
        })
         await req.user.save()


        // const user= await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
         res.send(req.user)
     }
     catch(e){
         res.status(400).send(e)
 
     }
 
 })
 
 router.delete('/users/me',auth,async(req,res)=>{
     try{
        /* const user= await User.findByIdAndDelete(req.user._id)
         if(!user)
         {
             return res.status(404).send()
         }*/
         await req.user.remove()
         res.status(200).send(req.user)
         sendCancellationEmail(req.user.email,req.user.name)
     }
     catch(e)
     {
         res.status(500).send()
     }
 
 })

const upload= multer({
    //dest:'avatars',
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb)
    {
        if(!file.originalname.match(/\.(png|jpg|jpeg)/))
        {
            return cb(new Error('Upload an image file'))
        }
        cb(undefined,true)
    }

})
                                              //this(avatar) should match with the key value witten in foem type
router.post('/users/me/avatar',auth,upload.single('avatar'),async(req,res)=>{
    req.user.avatar=req.file.buffer //only accessible when we dont save file to avatars dest
    await req.user.save()
    res.send()
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})

router.delete('/users/me/avatar',auth,async(req,res)=>{
    req.user.avatar=undefined
    await req.user.save()
    res.send()
})


 module.exports= router