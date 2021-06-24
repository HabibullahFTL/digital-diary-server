const express = require('express')


const app = express()


app.get('/',(req,res)=>{
    res.send("Hello api")
})

app.listen(4000,()=>console.log("Listening port 4000"))