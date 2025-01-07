const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sequelize = require('./Database/db');

//creating a server

const app = express();

// creating a port

const port = 4000;

//creating a middleware
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.get(`/`,(req,res)=>{
res.send("Welcome to the Page")
})

app.get(`/notice`,(req,res)=>{
res.send("This is notice")
})

//running on port
app.listen(port, ()=> {
console.log(`server runnninig on .............port ${port}`)
})