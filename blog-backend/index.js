import express from "express"
import cors from "cors"
import ConnectDB from "./db/ConnectDb.js"
import authRoutes from "./routes/auth.route.js"
import blogRoutes from "./routes/blog.route.js"
import userRoutes from "./routes/user.route.js"

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


ConnectDB()

app.get("/", (req, res) => {
    return res.send({ success: true, message: "api" })
})


app.use("/auth", authRoutes)
app.use("/blog", blogRoutes)
app.use("/user", userRoutes)


app.listen(5000, () => {
    console.log("App : localhost:5000")
})
