import express from "express"
import cors from "cors"
import { Queue } from "bullmq"
import { prisma } from "./utils/db";
import { authorization } from "./middlewares/authorization";
import loginRouter from "./routes/login";




const app = express();

app.use(express.json())
app.use(cors())

const queue = new Queue("BotQueue")

app.use(loginRouter)

app.post('/create-bot',authorization, async (req:any,res:any)=>{
    const { meetLink  } = req.body
    const userId = req.user.uid
    if(!meetLink || meetLink == ''){
        return res.status(400).json({message:"Invalid Meet Link"});
    }
    else{
        const job = await queue.add("create-bot",{userId,meetLink})
        if(job){
            
            return res.status(200).json(
                {
                    message:"Successfully added to the Queue.Undergoing Bot creation process...",
                    job:job
                })
        }
        else{
            return res.status(500).json({message:"Error Creating the Bot.Please Try again"})
        }
    }
})

app.get("/getAll" ,authorization, async (req:any,res:any)=>{
    const userId = req.user.uid

    const response = await prisma.videos.findMany({
        where:{
            userId: userId
        },select:{
            videoId:true,
            thumbnailUrl:true,
            created_at:true
        }
    })
    if(response && response.length == 0){
        return res.status(200).json({
            message: "No Videos "
        })
    }else if(response && response.length>0){
         return res.status(200).json({
            data: response
         })
    }
    else if(!response){
        return res.status(500).json({
            message:"Error occured"
        })
    }
})


app.post("/getVideo",async (req:any,res:any)=>{
    const { videoId } = req.body
    console.log(videoId)
    if(videoId){
        const data = await prisma.videos.findUnique({
            where:{
                videoId:videoId
            }
        })
        if(data){
            return res.status(200).json({
                data:data
            })
        }else{
            return res.status(404).json({
                message:"Cannot find information"
            })
        }
    }
    else{
        return res.status(400).json({
            message:"Bad Request No query params"
        })
    }
})


app.listen(3000,()=>{
    console.log("Starting the server...")
})
