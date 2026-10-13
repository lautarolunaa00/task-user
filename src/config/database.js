import mongoose from "mongoose";

export const dbConnect = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/web24");
    console.log("Base de datos online");
  } catch (error) {
    console.log(error);
  }
};
