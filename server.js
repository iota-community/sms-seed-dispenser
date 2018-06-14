require("dotenv").config()
const express = require("express")
const next = require("next")
var bodyParser = require("body-parser")
var crypto = require("crypto")

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== "production"
const app = next({ dev })
const handle = app.getRequestHandler()

// Twilio Credentials
var accountSid = process.env.TWILIO_SID
var authToken = process.env.TWILIO_AUTH_TOKEN
var from = process.env.TWILIO_FROM_NUMBER

//require the Twilio module and create a REST client
var twillio = require("twilio")(accountSid, authToken)

// Pull in a list of Seeds
var seeds = require("./seeds.json")
var tokens = []
var numbers = []

const startServer = () => {
  const server = express()
  server.use(bodyParser.json())

  server.post("/getToken", (req, res) => {
    // Reject if no number provided
    if (!req.body.hasOwnProperty("number")) {
      res.json({ error: "Provide your phone number!" })
    }
    //Regex Number
    var number = req.body.number.replace(/\s|\(|\)|\-/g, "")
    // Reject if number already exists
    if (numbers.includes(number))
      return res.json({ error: "Number already used!" })

    if (!seeds[0]) return res.json({ error: "All seeds have been given out." })

    // Create a token
    var token = crypto.randomBytes(5).toString("hex")
    // Add number to array
    numbers.push(number)
    // Add tokens to array
    tokens.push(token)
    // Send message
    twillio.messages.create(
      {
        to: number,
        from: from,
        body: `Hello! Redeem IOTA wallet here: https://${
          process.env.LIVE_URL
        }/redeem?code=${token}`
      },
      (err, message) => {
        if (err) {
          console.log(err)
          tokens = tokens.filter(item => item !== token)
          res.json({ error: "Please enter a valid number" })
        } else {
          res.json("Message sent!")
        }
      }
    )
  })

  server.post("/getSeed", (req, res) => {
    // If no token provided reject
    console.log(req.body)
    if (!req.body.hasOwnProperty("token")) {
      return res.json({ error: "Provide your token!" })
    }
    // If token doesn't exist reject
    if (!tokens.includes(req.body.token)) {
      return res.json({ error: "Verification failed" })
    }
    // Remove the first seed and return it
    var userSeed = seeds.shift()
    // Remove the token from the array
    tokens = tokens.filter(item => item !== req.body.token)
    // Return user's seed
    console.log(userSeed.seed)

    return res.json({ seed: userSeed.seed })
  })

  server.get("*", (req, res) => {
    return handle(req, res)
  })

  server.listen(port, err => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
}

// db.serialize(() => {
//   db.run('CREATE TABLE IF NOT EXISTS seeds (id INT PRIMARY KEY AUTO_INCREMENT, seed TEXT UNIQUE)')
//   for (const seed of seeds) {
//     db.run('INSERT INTO seeds (seed) VALUES ($)', seed)
//   }
//   db.run('CREATE TABLE IF NOT EXISTS tokens (id INT PRIMARY KEY AUTO_INCREMENT, number TEXT UNIQUE, code TEXT)', () => {
app.prepare().then(startServer)
//   })
// })
