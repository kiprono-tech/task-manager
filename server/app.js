const express =  require("express")
const cors =  require("cors")


const AppError =  require("./utils/appError")
const errorHandler =  require("./controllers/errorController")
const taskTouter =  require("./routes/taskRoutes")

const app =  express()

app.use(cors())
app.options("*", cors())

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.use("/api/v1/tasks", taskTouter)

app.all("*", (req, res, next) => {
    next(new AppError(`Cant find ${req.originalUrl} on this server`, 404))
}) 

app.use(errorHandler)
module.exports = app