require("dotenv").config()

const express = require("express")
const { huntForPokemon } = require("./util")

const { PORT = 3000 } = process.env

const app = express()

app.get("/pokedata/:branch/:name", async (req, res) => {
  const { name, branch } = req.params

  try {
    const { path } = await huntForPokemon(name.toLowerCase());
    res.redirect(`https://gitlab.com/cable-mc/cobblemon/-/blob/${branch}/${path}`)
  } catch (error) {
    res.sendStatus(404)
  }
})

app.get("/pokeimg/big/:name", async (req, res) => {
  const { name } = req.params

  const response = await fetch(`https://play.pokemonshowdown.com/sprites/ani/${name}.gif`)
  if (response.ok) {
    res.redirect(`https://play.pokemonshowdown.com/sprites/ani/${name}.gif`)
  } else {
    res.redirect(`https://play.pokemonshowdown.com/sprites/dex/${name}.png`)
  }
})

app.listen(PORT, () => {
  console.info("API server listening!")
})