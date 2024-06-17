import express from "express"
import userModel from "../model/user.model.js";

const userRoutes = express.Router()



userRoutes.route("/profile/:userName").get(async (req, res) => {
    const userName = req.params.userName;

    try {
        if (userName == undefined | userName == "")
            return res.send({ success: false }).status(404)

        const user = await userModel.findOne({ userName })

        if (user)
            return res.send({ success: true, user }).status(200)
        else
            return res.send({ success: false }).status(404)
    } catch (error) {
        return res.send({ success: false }).status(404)
    }
})



export default userRoutes