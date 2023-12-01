require("dotenv").config()

const express = require("express")
const { huntForPokemon, huntForSpawn } = require("./util")

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

app.get("/pokespawn/:branch/:name", async (req, res) => {
  const { name, branch } = req.params

  try {
    const { path } = await huntForSpawn(name.toLowerCase());
    res.redirect(`https://gitlab.com/cable-mc/cobblemon/-/blob/${branch}/${path}`)
  } catch (error) {
    res.sendStatus(404)
  }
})

app.get("/pokeimg/big/:name", async (req, res) => {
  const { name } = req.params
  const trueName = name.split(".")[0]
  const trueNameNd = trueName.replaceAll("-", "")

  const aniPageUrl = "https://play.pokemonshowdown.com/sprites/ani"
  const dexPageUrl = "https://play.pokemonshowdown.com/sprites/dex"

  const aniPage = await fetch(aniPageUrl).then(e => e.text())
  const dexPage = await fetch(dexPageUrl).then(e => e.text())

  if (aniPage.includes(`href="${trueName}.gif"`)) {
    res.redirect(`${aniPageUrl}/${trueName}.gif`)
  } else if (aniPage.includes(`href="${trueNameNd}.gif"`)) {
    res.redirect(`${aniPageUrl}/${trueNameNd}.gif`)
  } else if (dexPage.includes(`href="${trueName.png}"`)) {
    res.redirect(`${dexPageUrl}/${trueName}.png`)
  } else {
    res.redirect(`${dexPageUrl}/${trueNameNd}.png`)
  }
})

app.listen(PORT, () => {
  console.info("API server listening!")
})