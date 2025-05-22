import { Router } from "express";
import { SignupSchema } from "../types";

export const userRouter = Router();

userRouter.post("/signup", (req, res) => {
    const body = req.body;
    const parsedData = SignupSchema.safeParse(body);
    

});

userRouter.post("/signin", (req, res) => {
    
});