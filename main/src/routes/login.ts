import { Router } from "express"
import { prisma } from "../utils/db"

const router = Router()

router.post("/login", async (req:any, res:any) => {
    const { userId, name, email } = req.body;

    if (!userId || !name || !email) {
        return res.status(400).json({
            message: "Failed Login"
        });
    }

    try {
        const response = await prisma.user.upsert({
            where: {
                userId: userId, // Ensure this field exists in your schema
                email: email // Prisma does not allow multiple unique fields in `where`
            },
            update: {
                name: name,
            },
            create: {
                userId: userId,
                name: name,
                email: email
            }
        });

        if (response) {
            return res.status(200).json({  // ✅ FIXED: Corrected response structure
                message: "Login Successful"
            });
        } else {
            return res.status(400).json({
                message: "Error creating user"
            });
        }
    } catch (error) {
        console.error("Database error:", error);
        return res.status(500).json({ message: "Internal Server Error", error });
    }
});

export default router;
