import express,{Request,Response} from 'express';
import cors from 'cors';
import "dotenv/config"
import morgan from "morgan"
import mongoose from "mongoose"
import cookieParser from "cookie-parser"
import userRoutes from "./routes/UserRoutes"



const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));
app.use(morgan(":method :url :status :response-time ms"));


app.get("/test",async(req:Request, res:Response)=>{
    res.json({message:"Hello World"})
})
app.use("/api/users",userRoutes)
app.get("/health", (req: Request, res: Response) => {
    res.status(200).send("OK");
  });

app.listen(process.env.PORT || 7070, ()=>{
    console.log(`Server is running on port ${process.env.PORT}`)
})

mongoose.connect(process.env.MONGO_URI as string).then(()=>{
    console.log("Connected to MongoDB")
}).catch(error=> console.error(error));