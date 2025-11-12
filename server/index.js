import express from 'express'
import dotenv from 'dotenv'
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from './utils/dbConnect.js';
import cropRouter from './routes/crop.route.js';


dotenv.config();
connectDB();

const PORT=process.env.PORT || 5000
const app=express();
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));


app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/crop",cropRouter)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
