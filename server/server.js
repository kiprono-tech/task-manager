require("dotenv").config({path: "./.env"})

const mongoose =  require("mongoose")
const log =  require("signale")
const app =  require("./app")


const port       = process.env.PORT || 3001
const MONGO_HOST = process.env.MONGO_HOST
const MONGO_PORT = process.env.MONGO_PORT
const MONGO_USER = process.env.MONGO_USER
const MONGO_PASS = process.env.MONGO_PASS
const MONGO_DB   = process.env.MONGO_DB
const AUTH_DB    = process.env.MONGO_AUTH_DB

// const MONGO_URI = `mongodb://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}?authSource=${AUTH_DB}`
const MONGO_URI = "mongodb+srv://vincentkiprono38:8k8HKEpz5T5jPceQ@cluster0.mdodp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
const initiateDBConnection = async () => {
    try {
        await mongoose.connect(MONGO_URI)
        log.info("Connected to the database successfully ")
    } catch (error) {
        log.error("Error connecting to the database",error)
    }
}

const server =  app.listen(port, () => {
    initiateDBConnection()
    log.info(`App is running on port ${port}`)
})

process.on("unhandledRejection", (err) => {
    log.error("Unhandled rejection shutting down....")
    log.error(err.name, err.message)
    server.close(() => {
        process.exit(1)
    })
})