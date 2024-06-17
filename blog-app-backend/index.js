import express from "express"
import cors from "cors"
import path from "path"

import ConnectDB from "./db/ConnectDb.js"

import authRoutes from "./routes/auth.route.js"
import blogRoutes from "./routes/blog.route.js"
import userRoutes from "./routes/user.route.js"

import dotenv from "dotenv"
dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.use("/", express.static(path.join("./public")))


ConnectDB()

app.get("/", (_, res) => {
    return res.send({
        success: true,
        title: "Backend API - Blog App",
        description: "This is a backend API of a Blog App, you can explore this blog app at : https://blog-app.vercel.app",
        author: "@PranavShilavane - https://pranavshilavane.netlify.app"
    })
})

app.use("/auth", authRoutes)
app.use("/blog", blogRoutes)
app.use("/user", userRoutes)

app.get("*", (_, res) => {
    return res.redirect("/")
})

app.listen(5000, () => {
    console.log("App : localhost:5000")
})