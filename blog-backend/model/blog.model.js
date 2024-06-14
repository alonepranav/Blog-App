import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
    time: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    user: {
        type: {
            name: {
                type: String,
                required: true
            },
            userName: {
                type: String,
                required: true
            },
            image: {
                type: String,
                required: true
            },
        },
        required: true
    },
})

export default mongoose.models.Blog || mongoose.model("Blog", blogSchema)