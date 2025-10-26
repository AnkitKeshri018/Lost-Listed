import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import userRouter from "./routes/user.routes.js"
import lostitemRouter from "./routes/lostitem.routes.js"
import founditemRoter from "./routes/founditem.routes.js"

const app = express()

app.use(
    cors({
        origin:process.env.CORS_ORIGIN,
        credentials:true
    })
)

app.use(express.json({limit:"16kb"}))

app.use(express.urlencoded({
    extended:true,
    limit:"16kb"
}))

app.use(express.static("public"))

app.use(cookieParser())


app.use("/user", userRouter);
app.use("/lost-item", lostitemRouter);
app.use("/found-item", founditemRoter);





export {app}