import express,{Request,Response} from 'express';
import cors from 'cors';
import "dotenv/config"
import morgan from "morgan"
import mongoose from "mongoose"
import { v2 as cloudinary } from "cloudinary";
import cookieParser from "cookie-parser"
import userRoutes from "./routes/UserRoutes"
import MyHotelRoutes from "./routes/MyHotelRoutes"



const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));
app.use(morgan(":method :url :status :response-time ms"));



app.use("/api/users",userRoutes)
app.use("/api/my/hotels",MyHotelRoutes)

// Health check endpoint for load balancers 
app.get("/health", (req: Request, res: Response) => {
    res.status(200).send("OK");
  });

app.listen(process.env.PORT || 7070, ()=>{
    console.log(`Server is running on port ${process.env.PORT}`)
})

mongoose.connect(process.env.MONGO_URI as string).then(()=>{
    console.log("Connected to MongoDB")
}).catch(error=> console.error(error));


// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });