require("dotenv").config()

const mongoose = require("mongoose")
const express = require("express")
const  {TargetURLModel}  = require("./models.js")

mongoose.connect("mongodb+srv://sunath44:QenMdBCRZVMo5Uxj@cluster0.tc7v1.mongodb.net/?retryWrites=true&w=majority")


const uuid = require("uuid")
const parser = require('body-parser')
const cors = require("cors")

const app = express()

app.use(parser({extended:true}))


app.use(express.static("/dist"))
app.use(cors({
    allowedHeaders:"*",
    methods:"*",
    origin:"*",
    credentials:"*"
}))



app.get("/",(req,res) => {
    res.status(201).send(req.connection.remoteAddress)
})

app.post("/create-new-one",async (req,res) => {
    console.log(req.body)
    console.log(req.data)
    const {username,url} = req.body

    let urlPath = uuid.v1()
    let notFound = true
    while (notFound){
        urlPath = urlPath.slice(0,6)
        const model = await TargetURLModel.findOne({urlPath})
        if(!model){
            notFound = false
        }
    }
    

    
        const model = TargetURLModel({
            username,
            url,
            urlPath:urlPath
        })
    
    
        await model.save().then(e => {
            res.status(201).send({'url':'https://short-u.onrender.com/'+urlPath})
        }).catch(e =>{
            res.status(400).send({'error':"sdjs"})
        })

    
    
    
})



app.get("/users",async (req,res) => {

    const query = req.query
    console.log(query)

    if(!query || !query.username){
        const users = await TargetURLModel.find().sort({updatedAt:-1})
        res.status(200).send(users)
        return
    }

    const {username}  = query

    const models = await TargetURLModel.find({username:{$regex:'.*'+username+'.*'}})
    res.status(200).send(models)
    
})


app.use(async (req,res,next) => {
    const path = req.path
    if(path === '/favicon.ico'){
        return next()
    }
    let id = path.split("/")[1]
    const user = await TargetURLModel.findOne({urlPath:id})
    if(user){
        user.ip = req.ip
        user.visited = true
        user.save().then(e => {
            return res.status(200).redirect(user.url)
        }).catch(e => {

        })

        
        
    }else{
        res.status(200).send('not found')    
    }
    
    
})

app.listen(8000,async () => {

    console.log("App started")
})