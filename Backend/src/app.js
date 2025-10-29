import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import userRouter from "./routes/user.routes.js"
import lostitemRouter from "./routes/lostitem.routes.js"
import founditemRoter from "./routes/founditem.routes.js"
import productRouter from "./routes/product.routes.js"

const app = express()

app.use(cookieParser());
app.use(express.json({ limit: "16kb" }));
app.use(
  cors({
    origin: "http://localhost:5173", // must exactly match your frontend URL
    credentials: true, // allow sending cookies
  })
);



app.use(express.urlencoded({
    extended:true,
    limit:"16kb"
}))

app.use(express.static("public"))





app.use("/api/v1/user", userRouter);
app.use("/api/v1/lost-item", lostitemRouter);
app.use("/api/v1/found-item", founditemRoter);
app.use("/api/v1/products",productRouter)





export {app}