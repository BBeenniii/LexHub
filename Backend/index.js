const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const User = require("./models/User");
const Message = require("./models/Message");
const router = express.Router();
require("dotenv").config();
const axios = require("axios");
const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const app = express();
const PORT = 3001;

// MongoDB kapcsolat
mongoose.connect("mongodb://localhost:27017/LexHub")
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.error("MongoDB connection error:", err));

// Middleware
app.use(cors()); // Hozzáadjuk a CORS middleware-t
app.use(express.json());

// CORS beállítások
app.use(
    cors({
      origin: "http://localhost:5173", // Az engedélyezett kliens URL-je
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Engedélyezett HTTP metódusok
      allowedHeaders: ["Content-Type", "Authorization"], // Engedélyezett HTTP fejléc mezők
    })
);

app.options("*", (req, res) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:5173");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.sendStatus(200);
});
  

// Regisztráció
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  // Ellenőrizzük, hogy az email létezik-e már
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "Email already exists" });
  }

  // Jelszó hashelése és felhasználó létrehozása
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    user_id: uuidv4(),
    name,
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    console.log("User saved to database:", newUser);
  } catch (err) {
    console.error("Error saving user:", err);
  }  
  res.status(201).json({ message: "User registered successfully" });
});

// Bejelentkezés
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Felhasználó keresése
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  // Jelszó ellenőrzése
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  // JWT token generálása
  const token = jwt.sign({ user_id: user.user_id }, "your_secret_key", {
    expiresIn: "1h",
  });

  res.status(200).json({ token, user_id: user.user_id, name: user.name });
});

// Üzenetek küldése
app.post("/messages", async (req, res) => {
  const { sender_id, receiver_id, content } = req.body;

  const newMessage = new Message({ sender_id, receiver_id, content });
  await newMessage.save();

  res.status(201).json({ message: "Message sent successfully" });
});

// Üzenetek lekérdezése két user között
app.get("/messages/:sender_id/:receiver_id", async (req, res) => {
    const { sender_id, receiver_id } = req.params;
  
    try {
      const messages = await Message.find({
        $or: [
          { sender_id, receiver_id },
          { sender_id: receiver_id, receiver_id: sender_id },
        ],
      }).sort({ timestamp: 1 });
  
      res.status(200).json(messages);
    } catch (err) {
      console.error("Error fetching messages:", err);
      res.status(500).json({ message: "Error fetching messages" });
    }
  });  

// /users végpont
// Végpont a felhasználók listázásához
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, "name _id");
    res.status(200).json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Error fetching users" });
  }
});

module.exports = router;

// /users get
app.get("/users", async (req, res) => {
    try {
      // Csak a szükséges adatokat kérjük le (pl. név és ID)
      const users = await User.find({}, "name user_id");
      res.status(200).json(users);
    } catch (err) {
      console.error("Error fetching users:", err);
      res.status(500).json({ message: "Error fetching users" });
    }
  });
  

// AI Chat endpoint
const lawyer_types = [
  "Büntetőjogász",
  "Védőügyvéd",
  "Polgári jogász",
  "Ingatlanjogász",
  "Munkajogász",
  "Családjogi ügyvéd",
  "Kártérítési ügyvéd",
  "Közigazgatási jogász",
  "Alkotmányjogász",
  "Nemzetközi jogász",
  "Kereskedelmi jogász",
  "Adójogász",
  "Versenyjogász",
  "Szellemi tulajdonjogász",
  "Közbeszerzési jogász",
  "Egészségügyi jogász",
  "Környezetvédelmi jogász",
  "Emberi jogi jogász",
  "Sportjogász",
  "IT- és adatvédelmi jogász",
  "Mediátor (jogi végzettséggel)",
  "Választottbíró",
  "Bankjogász",
  "Társasági jogász",
  "Fogyasztóvédelmi jogász",
  "Csődjogász",
  "Végrehajtási jogász",
  "Peres ügyvéd",
  "Közlekedési jogász",
  "Követeléskezelési ügyvéd",
  "Kártérítési és biztosítási jogász",
  "Szerzői jogi ügyvéd",
  "Orvosi műhibaperekkel foglalkozó ügyvéd",
  "Öröklési jogász",
  "Egyesületi és alapítványi jogász",
  "Oktatási jogász"
]
app.post("/aiChat", async (req, res) => {
  try {
      const userMessage = req.body.text; // user message

      if (!userMessage) {
          return res.status(400).json({ error: "Hiányzó bemenet!" });
      }

      // ChatGPT API call
      const response = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: `Az API-dat használom, 
            te egy jogi eset meghatározó algoritmusban szerepelsz 1 kifejezéssel válaszolhatsz, határozd meg a leírt
            jogi probléma alapján, hogy milyen jogis képviselőre/segítségre van szükség (Válassz ezek közül a leírásra legjobban illőt és csak ennyit
            válaszolj: ${lawyer_types}): ${userMessage} | Amennyiben ebből nem állapítható meg, vagy megadott szöveg nem jogi esettel kapcsolatos
            ezt írd vissza: 'Nem beazonosítható!'` }],
          max_tokens: 150,
      });

      const aiResponse = response.choices[0].message.content || "Nincs válasz.";
      res.json({ result: aiResponse });
      console.log("API válasz:", aiResponse);

  } catch (error) {
      console.error("Hiba történt:", error);
      res.status(500).json({ error: "Hiba történt az AI hívás során." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

