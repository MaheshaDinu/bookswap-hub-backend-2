import express from 'express';
import bookRoutes from "./routes/book.routes";
import userRoutes from "./routes/user.routes";
import exchangeRequestRoutes from "./routes/exchangeRequest.routes";
import authRoutes from "./routes/auth.routes";
import {authenticateToken} from "./middleware/auth.middleware";
import uploadRoutes from "./routes/upload.routes";

const app = express();

//middleware

app.use(express.json());

//routes
app.use("/api/books",authenticateToken, bookRoutes);
app.use("/api/users", userRoutes);
app.use("/api/exchange-requests", authenticateToken,exchangeRequestRoutes);
app.use("/api/auth", authRoutes)
app.use("/api/upload", uploadRoutes)

export default app;