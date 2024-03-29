require("dotenv").config()

const express = require("express")
const { huntForPokemon, huntForSpawn, huntForModel, huntForTexture, isShiny } = require("./util")

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

app.get("/pokemodel/:branch/:name", async (req, res) => {
  const { name, branch } = req.params

  try {
    const { path } = await huntForModel(name.toLowerCase())
    res.redirect(`https://gitlab.com/cable-mc/cobblemon/-/tree/${branch}/${path}`)
  } catch (error) {
    res.sendStatus(404)
  }
})

app.get("/poketexture/:branch/:name", async (req, res) => {
  const { name, branch } = req.params

  try {
    const { path } = await huntForTexture(name.toLowerCase())
    res.redirect(`https://gitlab.com/cable-mc/cobblemon/-/tree/${branch}/${path}`)
  } catch (error) {
    res.sendStatus(404)
  }
})

app.get("/pokeimg/big/:name", async (req, res) => {
  const { name } = req.params;
  const [trueName, timestamp, mention] = name.split(".");
  const trueNameNd = trueName.replaceAll("-", "");

  const makeItShiny = isShiny(timestamp, mention);
  const aniPageUrl = "https://play.pokemonshowdown.com/sprites/ani" + (makeItShiny ? "-shiny" : "");
  const dexPageUrl = "https://play.pokemonshowdown.com/sprites/dex" + (makeItShiny ? "-shiny" : "");

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