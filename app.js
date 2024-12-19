const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");
const dotenv = require("dotenv");
const { PrismaClient } = require("@prisma/client");

dotenv.config();

const prisma = new PrismaClient();

const authRoutes = require("./routes/authRoutes");
const weatherRoutes = require("./routes/weatherRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

// Routes
app.use("/auth", authRoutes);
app.use("/calendar", weatherRoutes);
app.use("/tasks", taskRoutes);

app.get("/", (req, res) => res.redirect("/auth/login"));

// Démarrage du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Serveur démarré sur http://localhost:${PORT}`)
);
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Serveur en cours d'exécution sur http://192.168.138.1:${PORT}`);
});
//ipconfig
