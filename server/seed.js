require("dotenv").config();
const mongoose = require("mongoose");
const Task = require("./models/Task");
const log = require("signale");

const isAuthRequired = process.env.MONGO_USER && process.env.MONGO_PASS;

const authPart = isAuthRequired
  ? `${process.env.MONGO_USER}:${process.env.MONGO_PASS}@`
  : "";

// const MONGO_URI = `mongodb://${authPart}${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}${isAuthRequired ? `?authSource=${process.env.MONGO_AUTH_DB}` : ""}`;

const MONGO_URI = "mongodb+srv://vincentkiprono38:8k8HKEpz5T5jPceQ@cluster0.mdodp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
const tasks = [
  {
    title: "Create DB Schema",
    description: "Create a mongodb schema for the tasks manager.",
    status: "TODO",
    dueDate: "10/02/2025",
    priority: "HIGH",
  },
  {
    title: "Create Controllers and routes",
    description: "Create api routes and task controller",
    status: "IN_PROGRESS",
    dueDate: "09/02/2025",
    priority: "MEDIUM",
  },
  {
    title: "Create UI Data table Mock up",
    description: "Design data table and dialog ui",
    status: "DONE",
    dueDate: "08/02/2025",
    priority: "LOW",
  },
  {
    title: "Consume task api",
    description: "integrate frontend and backend to ensure smooth functionality",
    status: "DONE",
    dueDate: "09/02/2025",
    priority: "HIGH",
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    log.info("Connected to DB ...");

    await Task.deleteMany();
    log.info("Clear records");

    await Task.insertMany(tasks);
    log.info("Seeding db");

    await mongoose.connection.close();
    log.info("Clossing connection");
  } catch (error) {
    log.error("Error seeding db: ", error);
  }
};


seedDB()