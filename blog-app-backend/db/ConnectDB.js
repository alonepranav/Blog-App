import mongoose from 'mongoose'

const ConnectDB = async () => {

    try {
        await mongoose.connect("mongodb://localhost:27017/blog");

        if (mongoose.connection) console.log('connected');
        else throw new Error("Error in connection")

    } catch (err) {
        console.log(err);
    }
}

export default ConnectDB