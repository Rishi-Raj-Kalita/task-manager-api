/*###################################   TASKs*/

const express= require('express')
const Task= require('../models/task')
const router=new express.Router()
const auth= require("../middleware/auth")

router.post('/tasks',auth,async(req,res)=>{
    const task= new Task({
        ...req.body,
        owner:req.user._id
    })
      
    try{
        await task.save()
        res.status(201).send(task)
    }
    catch(e)
    {
        res.status(400).send(e)
    }
})

router.get('/tasks',auth,async(req,res)=>{

    const match={}
        if(req.query.completed)//we get the query as string true or false
        {
            match.completed= req.query.completed==='true'
        }
    
    try{

        
        const tasks=await req.user.populate({
            path:'tasks',
            match,
            options:{
                limit:parseInt(req.query.limit),
                skip:parseInt(req.query.skip)
            }
        }).execPopulate()
        res.status(201).send(req.user.tasks)
    }
    catch(e)
    {
        res.status(400).send(e)
    }
})

router.get('/tasks/:id',auth,async(req,res)=>{
    const _id=req.params.id

    try{
        const task= await Task.findOne({_id, owner:req.user._id})
        if(!task)
        {
            return res.status(404).send()
        }
        res.status(201).send(task)
    }
    catch(e)
    {
        res.status(400).send(e)
    }
})

router.patch('/tasks/:id',auth,async(req,res)=>{

    const updates = Object.keys(req.body)  //takes name, email, age , password  Object.keys
    const allowedUpdates=['description','completed']
    const isValidOperation = updates.every((update)=>{
        return allowedUpdates.includes(update)
    })
    if(!isValidOperation)
    {
        return res.status(400).send({error:'Invalid field'})
    }
    try{
        const task=await Task.findOne({_id:req.params.id,owner:req.user._id})
        if(!task)
        {
            return(res.status(400).send())
        }
        updates.forEach((update)=>{
            task[update]=req.body[update]
        })
        await task.save()
        //const task= await Task.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
        if(!task)
        {
            return res.status(404).send()
        }
        res.status(200).send(task)
    }catch(e)
    {
        res.status(400).send(e)
    }
})

router.delete('/tasks/:id',auth,async(req,res)=>{
    try{
        const task= await Task.findOneAndDelete({_id:req.params.id,owner:req.user._id})
        if(!task)
        {
            return res.status(404).send()
        }
        res.status(200).send(task)
    }
    catch(e)
    {
        res.status(500).send(e)
    }

})

module.exports=router
