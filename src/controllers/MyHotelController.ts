import { Request, Response } from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import Hotel from "../models/Hotel";
import { HotelType } from "../shared/types";

const createMyHotel = async (req: Request, res: Response) => {
  try {
    const imagesFiles = req.files as Express.Multer.File[];
    const newHotel = req.body;

    newHotel.imageUrls = await uploadImagesToCloudinary(imagesFiles);
    newHotel.lastUpdated = new Date();
    newHotel.userId = req.userId;
    
    const hotel = new Hotel(newHotel);
    await hotel.save();

    res.status(201).json(hotel.toObject());
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};


const getMyHotels = async (req: Request, res: Response) => {
  try {
    const hotels = await Hotel.find({ userId: req.userId });
    res.status(200).json(hotels);
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch hotels" });
  }
};

const getMyHotel = async (req: Request, res: Response) => {
  try {
    const hotel = await Hotel.findOne({
      _id: req.params.id.toString(),
      userId: req.userId,
    });
    res.status(200).json(hotel);
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch hotels" });
  }
};





const updateMyHotel = async (req: Request, res: Response) => {
  try {
    const updatedHotel:HotelType = req.body;
    updatedHotel.lastUpdated = new Date();

    const hotel = await Hotel.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      updatedHotel,
      { new: true }
    );

    if (!hotel) {
       res.status(404).json({ message: "Hotel not found" });
       return
    }

    const imagesFiles = req.files as Express.Multer.File[];

    
      const newImageUrls = await uploadImagesToCloudinary(imagesFiles);
        hotel.imageUrls = [...newImageUrls, ...(updatedHotel.imageUrls || [])] // Append new image URLs
      await hotel.save();
    
    res.status(200).json(hotel);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update hotel" });
  }
};


export default { createMyHotel, getMyHotels, getMyHotel , updateMyHotel};

const uploadImagesToCloudinary = async (imageFiles: Express.Multer.File[])=> {
  const uploadPromises = imageFiles.map(async (image) => {
    const b64 = Buffer.from(image.buffer).toString("base64");
    let dataURI = "data:" + image.mimetype + ";base64," + b64;
    const res = await cloudinary.v2.uploader.upload(dataURI);
    return res.url;
  });
  return await Promise.all(uploadPromises);
};
