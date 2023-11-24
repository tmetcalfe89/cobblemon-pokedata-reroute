require("dotenv").config()

const express = require("express")
const { huntForPokemon } = require("./util")

const { PORT } = process.env

const app = express()

app.get("/pokedata/:name", async (req, res) => {
  const { name } = req.params

  const { path } = await huntForPokemon(name);
  res.redirect(`https://gitlab.com/cable-mc/cobblemon/-/blob/1.4.0/${path}`)
})

app.listen(PORT, () => {
  console.info("API server listening!")
})