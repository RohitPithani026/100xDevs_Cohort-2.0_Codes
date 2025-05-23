import express from "express";
import { prismaClient } from "./db";

export const app = express();
app.use(express.json());

app.post("/sum", async(req, res) => {
    const a = req.body.a;
    const b = req.body.b;

    if (a > 1000000 || b > 1000000) {
        return res.status(422).json({
            message: "Sorry we dont support big numbers"
        })
    }

    const result = a + b;

    const request = await prismaClient.Request.create({
        data: {
            a: a,
            b: b,
            answer: result,
            type: "Sum"
        }
    })

    console.log(request);

    res.json({ answer: result, id: request.id });
})

app.post("/multiply", async(req, res) => {
    const a = req.body.a;
    const b = req.body.b;

    const result = a * b;

    await prismaClient.Request.create({
        data: {
            a: a,
            b: b,
            answer: result,
            type: "Multiply"
        }
    })

    res.json({ answer: result });
})