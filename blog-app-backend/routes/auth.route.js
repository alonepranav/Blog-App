import express from "express"
import userModel from "../model/user.model.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const authRoutes = express.Router()



authRoutes.route("/signin").post(async (req, res) => {
    try {
        const { firstName, lastName, email, password, image, about, userName } = req.body;

        if (
            firstName == undefined || firstName == "" |
            lastName == undefined || lastName == "" |
            email == undefined || email == "" |
            password == undefined || password == "" |
            image == undefined || image == "" |
            about == undefined || about == "" |
            userName == undefined || userName == ""
        )
            return res.send({ success: false }).status(404)

        bcrypt.genSalt(10, function (_, salt) {
            bcrypt.hash(password, salt, async function (_, hash) {
                await userModel.create({ firstName, lastName, email, password: hash, image, about, userName })
            });
        });

        return res.send({ success: true, message: "User Created" }).status(200)
    } catch (error) {
        return res.send({ success: false }).status(404)
    }
})



authRoutes.route("/login").post(async (req, res) => {
    try {
        const { email, password } = req.body;

        if (
            email == undefined || email == "" |
            password == undefined || password == ""
        )
            return res.send({ success: false }).status(404)

        const user = await userModel.findOne({ email });

        if (user) {
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (passwordMatch) {
                const token = jwt.sign(
                    { email: email },
                    process.env.JWT_SECRET,
                    { expiresIn: "3d" }
                );

                const u = await userModel.findOne({ email })

                return res.send({
                    success: true,
                    data: { auth: { token, email }, user: u },
                    message: "User login successfully"
                }).status(200);
            } else
                return res.send({ success: false });
        }
        else
            return res.send({ success: false, message: "No user found" }).status(404)
    } catch (error) {
        return res.send({ success: false }).status(404)
    }
})



authRoutes.route("/validate-token").post(async (req, res) => {
    try {
        const { token, email } = req.body;

        if (
            token == undefined || token == "" |
            email == undefined || email == ""
        ) return res.send({ success: false }).status(404)

        const a = jwt.verify(token, process.env.JWT_SECRET);

        if (a.email === email) {
            const user = await userModel.findOne({ email })

            return res.send({ success: true, user, message: "Token Verified" }).status(200)
        }
        else
            return res.send({ success: false, message: "Invalid Token" }).status(404)
    }
    catch (err) {
        return res.send({ success: false, message: "Invalid Token" }).status(404)
    }
})



authRoutes.route("/validate-cred").post(async (req, res) => {
    try {
        const { userName, email } = req.body;

        if (
            userName == undefined || userName == "" |
            email == undefined || email == ""
        )
            return res.send({ success: false }).status(404)

        const user = await userModel.find({
            $or: [
                { userName },
                { email },
            ]
        })

        if (user.length == 0)
            return res.send({ success: true }).status(200)
        else
            return res.send({ success: false }).status(404)
    }
    catch (err) {
        return res.send({ success: false }).status(404)
    }
})



export default authRoutes