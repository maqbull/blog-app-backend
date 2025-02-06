# Blog App Backend

## Overview

This repository contains the backend for a blog application built with [NestJS](https://nestjs.com/). It provides user authentication via Google login and supports CRUD (Create, Read, Update, Delete) operations for blog posts.

## Features

- **Google Authentication**: Users can sign in using their Google accounts.
- **CRUD Operations**: Manage blog posts with full CRUD functionality.
- **RESTful API**: Communicate with the backend using standard HTTP methods.

## Prerequisites

- [Node.js](https://nodejs.org/)
- [NestJS](https://nestjs.com/)
- [MongoDB](https://www.mongodb.com/)

## Setup

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/maqbull/blog-app-backend.git
   cd blog-app-backend
npm install


GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
JWT_SECRET=your_jwt_secret


npm run start:dev


Endpoints
POST /auth/google: Authenticate users via Google login.
GET /posts: Retrieve all blog posts.
GET /posts/:id: Retrieve a single blog post by ID.
POST /posts: Create a new blog post.
PUT /posts/:id: Update an existing blog post by ID.
DELETE /posts/:id: Delete a blog post by ID.
Contributing
Feel free to fork the repository, submit issues, and send pull requests.

License
This project is licensed under the MIT License.
