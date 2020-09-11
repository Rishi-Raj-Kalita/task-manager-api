require('../src/db/mongoose')
const User =require('../src/models/user')

User.findByIdAndUpdate('5f523f686abe9e591860cdd9',{age:20}).then((user)=>{
    console.log(user)
    return User.countDocuments({age:20})
}).then((result)=>{
    console.log(result)
}).catch((e)=>{
    console.log(e)
})