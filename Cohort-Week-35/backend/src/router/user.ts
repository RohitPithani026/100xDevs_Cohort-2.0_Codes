import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { SigninSchema, SignupSchema } from "../types";
import { JWT_USER_PASS } from "../config";
import jwt from "jsonwebtoken";

const prismaClient = new PrismaClient();

export const userRouter = Router();

userRouter.post("/signup", async (req, res) => {
    const parsedData = SignupSchema.safeParse(req.body);

    if (!parsedData.success) {
        return res.status(400).json({
            message: "Invalid input",
        });
    }

    try {
        await prismaClient.$transaction(async tx => {
            const user = await tx.user.create({
                data: {
                    username: parsedData.data.username,
                    password: parsedData.data.password,
                    name: parsedData.data.name
                }
            })

            await tx.userAccount.create({
                data: {
                    userId: user.id,
                } 
            })
        })

        res.json({
            message: "Signed up"
        })
    } catch (e) {
        return res.status(403).json({
            message: "Error while signing up"
        })
    }
});

userRouter.post("/signin", async (req, res) => {
    const body = req.body;
    const parsedData = SigninSchema.safeParse(body);

    const user = await prismaClient.user.findFirst({
        where: {
            username: parsedData.data?.username,
            password: parsedData.data?.password
        }
    })
    if (!user) {
        return res.status(403).json({
            message: "Unable to log you in"
        })
    }
    const token = jwt.sign({
        id: user.id
    }, JWT_USER_PASS);

    return res.json({
        token
    })
});

userRouter.post("/onramp", async (req, res) => {
    const { userId, amount } = req.body;

    await prismaClient.userAccount.update({
        where: {
            userId: userId
        },
        data: {
            balance: {
                increment: amount
            }
        }
    })

    return res.json({
        
    })
});