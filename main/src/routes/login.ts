import { Router } from "express"
import { prisma } from "../utils/db"

 const router = Router()

router.post("/login",async(req:any,res:any)=>{
    const { userId , name , email  } = req.body
    if(userId && name && email){
        const response = await prisma.user.upsert({
            where:{
                userId:userId,
                email:email
            },
            update:{
                name:name,
            },
            create:{
                userId:userId,
                name:name,
                email:email
            }
        })
        if(response){
            return res.json(200).json({
                message:"Login Successfull"
            })
        }else{
            return res.status(400).json({
                message:"Error creating user"
            })
        }
    }else{
        return res.status(400).json({
            message:"Failed Login"
        })
    }
})

export default router

