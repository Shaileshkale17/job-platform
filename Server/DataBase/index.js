import mongoose, { mongo } from "mongoose";

const Connection = async () => {
  try {
    const connectdb = await mongoose.connect(process.env.CONNECTURL);
    console.log(`mongodb connect in server ${connectdb.connection.host}`);
  } catch (error) {
    console.log(`connection error ${error}`);
    process.exit(1);
  }
};

export default Connection;
