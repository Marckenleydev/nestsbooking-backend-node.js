NestBooking Backend Documentation

Table of Contents
Introduction
Features
Technologies Used

API Documentation

Authentication
Hotel Management
Room Management
Booking Management
Setup and Installation
Database Design

Folder Structure

Contributing

License

Introduction

NestBooking is a hotel booking application that provides users with the ability to browse hotels, book rooms, and manage their reservations.
The backend of NestBooking is built using Node.js and MongoDB, following RESTful architecture to ensure scalability and performance.

Features

User authentication and authorization (JWT-based).
Hotel and room management for administrators.
Room search with pagination.
Booking creation and management.
Role-based access control (Admin and User).

Technologies Used

Node.js: Runtime environment.
Express.js: Framework for building APIs.
MongoDB: NoSQL database for data storage.
Mongoose: ODM for MongoDB.
JWT: Token-based authentication.
TypeScript: Strongly-typed programming.



API Documentation
Authentication

Endpoints:

POST /auth/register: Register a new user.
POST /auth/login: Authenticate user and return a JWT.
GET /auth/profile: Retrieve the authenticated user's profile.
Hotel Management

Endpoints:

POST /hotels: Add a new hotel (Admin only).
GET /hotels: Retrieve a paginated list of hotels.
GET /hotels/:id: Get details of a specific hotel.
PUT /hotels/:id: Update hotel details (Admin only).
DELETE /hotels/:id: Delete a hotel (Admin only).

Room Management

Endpoints:

POST /rooms: Add a new room to a hotel (Admin only).
GET /rooms: Retrieve a list of rooms for a hotel.
GET /rooms/:id: Get details of a specific room.
PUT /rooms/:id: Update room details (Admin only).
DELETE /rooms/:id: Delete a room (Admin only).

Booking Management

Endpoints:

POST /bookings: Create a new booking.
GET /bookings: Retrieve a user's bookings.
GET /bookings/:id: Get details of a specific booking.
DELETE /bookings/:id: Cancel a booking.



