import  bcrypt  from 'bcryptjs';
import { Request, Response } from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";


const registerUser = async (req: Request, res: Response) => {
  try {
    let user = await User.findOne({
      email: req.body.email,
    });

    if (user) {
     res.status(400).json({ message: "User already exists" });
     return ;
    }
    user = new User(req.body);
    await user.save();

    setAuthToken(res, user.id);

    res.status(201).json({message:"User registered successfully"});
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "something went wrong" });
  }
};
const authUser = async(req: Request, res: Response)=>{
    try {
        const {email,password} = req.body;
        const user = await User.findOne({email:email})
        if(!user){
            res.status(404).json({ message: "User not found" });
            return
        }

        const isPasswordMatch =await bcrypt.compare(password, user.password) 
        if(!isPasswordMatch){
            res.status(400).json({ message: "Invalid credentials" });
            return
        }

       setAuthToken(res, user.id);
       res.status(200).json({userId:user._id})


    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "something went wrong" });
        return;
    }

}

 const logOut = async(req: Request, res: Response)=>{
  res.cookie("auth_token", "",{
    expires: new Date(0),
  // Set it to 0 to expire the cookie immediately
  })
  res.send();
}


export default { registerUser ,authUser,logOut};

const setAuthToken = (res: Response, userId: string) => {
    const token = jwt.sign(
      { userId },
      process.env.JWT_SECRET_KEY as string,
      { expiresIn: "1d" }
    );
  
    res.cookie("auth_token", token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      maxAge: 86400000, // 1 day in milliseconds
    });
  
    return token;
  };