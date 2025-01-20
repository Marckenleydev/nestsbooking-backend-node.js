import { Request, Response } from "express";
import Hotel from "../models/Hotel";
import Stripe from "stripe";
import { BookingType, HotelSearchResponse } from "../shared/types";
import { validationResult } from "express-validator";

const searchHotel = async (req: Request, res: Response) => {
    try {
        const query = constructSearchQuery(req.query);
    
        let sortOptions = {};
        switch (req.query.sortOption) {
          case "starRating":
            sortOptions = { starRating: -1 };
            break;
          case "pricePerNightAsc":
            sortOptions = { pricePerNight: 1 };
            break;
          case "pricePerNightDesc":
            sortOptions = { pricePerNight: -1 };
            break;
        }
    
        const pageSize = 5;
        const pageNumber = parseInt(
          req.query.page ? req.query.page.toString() : "1"
        );
        const skip = (pageNumber - 1) * pageSize;
    
        const hotels = await Hotel.find(query)
          .sort(sortOptions)
          .skip(skip)
          .limit(pageSize);
    
        const total = await Hotel.countDocuments(query);
    
        const response: HotelSearchResponse = {
          data: hotels,
          pagination: {
            total,
            page: pageNumber,
            pages: Math.ceil(total / pageSize),
          },
        };
    
        res.json(response);
      } catch (error) {
        console.log("error", error);
        res.status(500).json({ message: "Something went wrong" });
      }
  };

  const getHotels =async (req: Request, res: Response) => {
    try {
      const hotels = await Hotel.find().sort("-lastUpdated");
      res.json(hotels);
    } catch (error) {
      console.log("error", error);
      res.status(500).json({ message: "Error fetching hotels" });
    }
  };

  const getHotel = async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        res.status(400).json({ errors: errors.array() });
        return;
    }
    try {
      const hotel = await Hotel.findById(req.params.id.toString());
      res.status(200).json(hotel);
      return;
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to fetch hotel" });
    }
  };
  const constructSearchQuery = (queryParams: any) => {
    let constructedQuery: any = {};
  
    if (queryParams.destination) {
      constructedQuery.$or = [
        { city: new RegExp(queryParams.destination, "i") },
        { country: new RegExp(queryParams.destination, "i") },
      ];
    }
  
    if (queryParams.adultCount) {
      constructedQuery.adultCount = {
        $gte: parseInt(queryParams.adultCount),
      };
    }
  
    if (queryParams.childCount) {
      constructedQuery.childCount = {
        $gte: parseInt(queryParams.childCount),
      };
    }
  
    if (queryParams.facilities) {
      constructedQuery.facilities = {
        $all: Array.isArray(queryParams.facilities)
          ? queryParams.facilities
          : [queryParams.facilities],
      };
    }
  
    if (queryParams.types) {
      constructedQuery.type = {
        $in: Array.isArray(queryParams.types)
          ? queryParams.types
          : [queryParams.types],
      };
    }
  
    if (queryParams.stars) {
      const starRatings = Array.isArray(queryParams.stars)
        ? queryParams.stars.map((star: string) => parseInt(star))
        : parseInt(queryParams.stars);
  
      constructedQuery.starRating = { $in: starRatings };
    }
  
    if (queryParams.maxPrice) {
      constructedQuery.pricePerNight = {
        $lte: parseInt(queryParams.maxPrice).toString(),
      };
    }
  
    return constructedQuery;
  };
  

  const stripe = new Stripe(process.env.STRIPE_API_KEY as string);
 const createCheckoutSession = async(req:Request, res:Response)=>{

    try {
        const {numberOfNights} = req.body;
        const hotelId = req.params.hotelId;

        const hotel = await Hotel.findById(hotelId);
        if(!hotel){
            res.status(404).json({ message: "Hotel not found" });
            return;
        }
        const totalCost = hotel.pricePerNight * numberOfNights ;

        const paymentIntent =  stripe.paymentIntents.create({
            amount: totalCost * 100,
            currency: "GBP",
            
            metadata: { 
                hotelId,
                userId: req.userId },
            
        })

        if(!(await paymentIntent).client_secret){
            res.status(500).json({ message: "Failed to create payment intent" });
            return;
        }
        const response = {
            paymentIntentId: (await paymentIntent).id,
            clientSecret: (await paymentIntent).client_secret?.toString(),
            totalCost,

        }
        res.json(response);
        return ;
    } catch (error) {
        console.log("error", error);
        res.status(500).json({ message: "Something went wrong" });
    }

 }

 const createBooking = async(req: Request, res: Response)=>{

  try {
    const paymnetIntentId = req.body.paymentIntentId;
    const paymentIntent = await stripe.paymentIntents.retrieve(
      paymnetIntentId as string,
    )

    if(!paymentIntent){
      res.status(404).json({ message: "Payment intent not found" });
      return;
    }

    if(paymentIntent.metadata.hotelId !== req.params.hotelId ||
       paymentIntent.metadata.userId !== req.userId){
        res.status(400).json({ message: "Payment Intent missmatch" });
        return;
       }

       if(paymentIntent.status !== "succeeded"){
        res.status(400).json({ message: `Payment intent not successful. status: ${paymentIntent.status}` });
        return;
       }


       const newBooking:BookingType = {
        ...req.body,
        userId: req.userId
       }

       const hotel = await Hotel.findOneAndUpdate({_id: req.params.hotelId},
      {
        $push: {bookings: newBooking},
      })

       if(!hotel){
        res.status(404).json({ message: "Hotel not found" });
        return;
       }

       await hotel.save();
       res.status(200).send({message:"success"})
       return;


  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Something went wrong" });
  }
 }
  export default { searchHotel , getHotel, getHotels,createCheckoutSession,createBooking};
  