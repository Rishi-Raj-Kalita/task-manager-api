const mongoose= require('mongoose')
const validator=require('validator')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const Task=require('./task')

const userSchema= new mongoose.Schema({ 
    name:{
    type:String,
    trim:true,
    required: true
},
email:{
    type:String,
    required:true,
    unique:true,
    trim:true,
    validate(value){
        if(!validator.isEmail(value))
        {
            throw new Error('Email is invalid')
        }
    }

},
password:{
    type:String,
    required:true,
    trim:true,
    minlength:7,
    validate(value)
    {
        if(value.toLowerCase().includes('password'))
        {
            throw  new Error('The password field can not contain "password"')
        }

    }
},
age:{
    type:Number,
    default:0,
    validate(value)
    {
        if(value<0)
        {
            throw new Error('Age needs to be a positive number')
        }
    }
    
},
avatar:{
    type:Buffer
},
tokens:[{
    token:{
    type:String,
    required:true}
}]

},

{
    timestamps:true
})

//setting up reltnship b/w user and tasks
userSchema.virtual('tasks',{
    ref:'Task',
    localField:'_id',//id of the user
    foreignField:'owner'//owner in the task model
})

userSchema.methods.toJSON= function(){

    const user=this
    const userObject =user.toObject()

    delete userObject.password
    delete userObject.tokens
     
    return userObject
}

//methods is used to define a function on an instance like user
userSchema.methods.generateAuthToken= async function(){
    const user= this
    const token=jwt.sign({_id :user._id.toString()},'imrishiraj')
    //console.log(token)

    user.tokens=user.tokens.concat({token})
    await user.save()
    return token
}

//loging in user 
//statics is used to define a method in a model
userSchema.statics.findByCredentials= async(email,password)=>{
    const user=await User.findOne({email})
    if(!user)
    {
        throw new Error ('Unable to find user')
    }
    const isMatch= await bcrypt.compare(password,user.password)

    if(!isMatch)
    {
        throw new Error ('unable to login')
    }
    return user
}

//we have to use normal function
userSchema.pre('save',async function(next){
    const user=this //we use this to get the fields of user
    if(user.isModified('password'))
    {
        user.password= await bcrypt.hash(user.password,8)
    }

    next()
})

//deletes task when a user is removed

userSchema.pre('remove',async function(next){
    const user=this
    await Task.deleteMany({owner:user._id})
    next()

})


const User=mongoose.model('User',userSchema)

module.exports=User