const sgMail= require('@sendgrid/mail')

//const sendgridAPIKey='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'

console.log(process.env.SENDGRID)
sgMail.setApiKey(process.env.SENDGRID)

const sendWelcomeEmail= (email,name)=>{
    sgMail.send({
        to:email,
        from:'rishirajkalita13@gmail.com',
        subject:'Hello Nigga',
        text:`Welcome to website ${name}.Let me know about your reviews`
    })
}

const sendCancellationEmail= (email,name)=>{
    sgMail.send({
        to:email,
        from:'rishirajkalita13@gmail.com',
        subject:'Bye bye Nigga',
        text:`Bye bye  ${name}.Why did you leave us so early`
    })
}


module.exports={
    sendWelcomeEmail,
    sendCancellationEmail
}