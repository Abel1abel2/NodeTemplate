import type { Request, Response } from "express"
import prisma from "../lib/prisma.js"
import { hashSync, compareSync } from "bcrypt"
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "../secret.js"
import { userSchema } from "../schema/user.js"
import { ZodError } from "zod"

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body
        const user = await prisma.user.findFirst({ where: { email } })
        if (!user) {
            return res.status(400).json({ message: "user not found" })
        }
        if (!compareSync(password, user.password)) {
            return res.status(400).json({ message: "invalid password" })
        }
        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1h" })
        return res.json({ user, token })
    } catch (err) {
        return res.status(500).json({ message: "internal server error" })
    }
}

export const signUp = async (req: Request, res: Response) => {
    try {
        // Validate user input with Zod before processing
        const validatedData = userSchema.parse(req.body)

        const user = await prisma.user.findFirst({ where: { email: validatedData.email } })
        if (user) {
            return res.status(400).json({ message: "user already exist" })
        }

        const newUser = await prisma.user.create({
            data: {
                name: validatedData.name,
                email: validatedData.email,
                password: hashSync(validatedData.password, 10)
            }
        })
        return res.status(201).json({ message: "user created successfully", user: newUser })
    } catch (err) {
        if (err instanceof ZodError) {
            return res.status(400).json({
                message: "Validation failed",
                errors: err.issues
            })
        }
        return res.status(500).json({ message: "internal server error" })
    }
}

export const me = async (req: Request, res: Response) => {
    try {
        const user = req.user
        if (!user) {
            return res.status(404).json({ message: "user not found" })
        }
        return res.json({ user,message:"user found successfully"})
    } catch (err) {
        return res.status(500).json({ message: "internal server error" })
    }
}