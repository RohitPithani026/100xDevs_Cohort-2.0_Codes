import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { SigninSchema, SignupSchema } from "../types";
import { JWT_MERCHANT_PASS } from "../config";

const prismaClient = new PrismaClient();

export const merchantRouter = Router();

merchantRouter.post("/signup", async (req, res) => {
    const parsedData = SignupSchema.safeParse(req.body);

    if (!parsedData.success) {
        return res.status(400).json({
            message: "Invalid input",
        });
    }

    try {
        await prismaClient.$transaction(async tx => {
            const merchant = await tx.merchant.create({
                data: {
                    username: parsedData.data.username,
                    password: parsedData.data.password,
                    name: parsedData.data.name
                }
            })

            await tx.merchantAccount.create({
                data: {
                    merchantId: merchant.id,
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

merchantRouter.post("/signin", async (req, res) => {
    const body = req.body;
    const parsedData = SigninSchema.safeParse(body);

    const merchant = await prismaClient.merchant.findFirst({
        where: {
            username: parsedData.data?.username,
            password: parsedData.data?.password
        }
    })
    if (!merchant) {
        return res.status(403).json({
            message: "Unable to log you in"
        })
    }
    const token = jwt.sign({
        id: merchant.id
    }, JWT_MERCHANT_PASS);

    return res.json({
        token
    })
});