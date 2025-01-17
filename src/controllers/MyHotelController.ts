

import {Request,Response}  from "express"
import multer from "multer";
import  cloudinary  from 'cloudinary';
import Hotel from "../models/Hotel";

const createMyHotel = async(req: Request, res: Response) => {



    try {
        const imagesFiles = req.files as Express.Multer.File[];
        const newHotel = req.body;

        const uploadPromises = imagesFiles.map(async(image)=>{
            const b64 = Buffer.from(image.buffer).toString("base64");
            let dataURI = "data:" + image.mimetype + ";base64," + b64;
            const res = await cloudinary.v2.uploader.upload(dataURI);
            return res.url;
        })

        const imageUrls = await Promise.all(uploadPromises);
        newHotel.imageUrls = imageUrls;
        newHotel.lastUpdated = new Date();
        newHotel.userId = req.userId;
        const hotel = new Hotel(newHotel);
        await hotel.save();
        res.status(201).json(hotel.toObject());
        return;

    } catch (error) {
        console.error(error);
    res.status(500).json({ message: "something went wrong" });
    }

};

const getMyHotel = async(req: Request, res: Response)=>{

 

    try {
        const hotels = await Hotel.find({userId: req.userId})
        res.status(200).json(hotels);
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch hotels" });
    }

}

export default {createMyHotel,getMyHotel}