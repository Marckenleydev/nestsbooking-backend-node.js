import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export type UserType = {
    _id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true }
})

//export const hashPassword =async(password:string)=>{
 //   if(password){
  //      password = await bcrypt.hash(password,10)
 //   }
//}

// Hash password before saving the document
userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10); // Properly await the hash
    }
    next();
});

const User = mongoose.model<UserType>("User", userSchema)
export default User;