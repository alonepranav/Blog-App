import express from "express"
import blogModel from "../model/blog.model.js";

const blogRoutes = express.Router()



blogRoutes.route("/get-blog").get(async (_, res) => {
    try {
        const blog = await blogModel.find({}).limit(50);

        return res.send({ success: true, blog }).status(200)
    } catch (error) {
        return res.send({ success: false }).status(404)
    }
})



blogRoutes.route("/get-blogs/:userName").get(async (req, res) => {
    try {
        const userName = req.params.userName;

        if (userName == undefined || userName == "")
            return res.send({ success: false }).status(404)

        const blog = await blogModel.find({ "user.userName": userName })

        return res.send({ success: true, blog }).status(200)
    } catch (error) {
        return res.send({ success: false }).status(404)
    }
})



blogRoutes.route("/add-blog").post(async (req, res) => {
    try {
        const { title, content, image, time, user } = req.body;

        if (
            title == undefined || title == "" |
            content == undefined || content == "" |
            image == undefined || image == "" |
            time == undefined || time == "" |
            user.name == undefined || user.name == "" |
            user.userName == undefined || user.userName == "" |
            user.image == undefined || user.image == ""
        )
            return res.send({ success: false }).status(404)

        await blogModel.create({ title, content, image, time, user })

        return res.send({ success: true, message: "Blog added" }).status(200)
    } catch (error) {
        return res.send({ success: false }).status(404)
    }
})



blogRoutes.route("/delete-blog/:id").delete(async (req, res) => {
    const id = req.params.id;

    try {
        if (id == undefined || id == "")
            return res.send({ success: false }).status(404)

        await blogModel.deleteOne({ _id: id })

        return res.send({ success: true, message: "Blog deleted" }).status(200)
    } catch (error) {
        return res.send({ success: false }).status(404)
    }
})



export default blogRoutes