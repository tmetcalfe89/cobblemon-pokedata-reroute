let cachedPokemonRefs = [];
const setCachedPokemonRefs = (newValue) => cachedPokemonRefs = newValue;

let cachedSpawnRefs = [];
const setCachedSpawnRefs = (newValue) => cachedSpawnRefs = newValue;

let cachedModelRefs = [];
const setCachedModelRefs = (newValue) => cachedModelRefs = newValue;

const huntForPokemon = async (pokemonName, branchName) => {
  const currentKnownPokemon = [...cachedPokemonRefs];
  while (
    !currentKnownPokemon.some(({ name }) => name === `${pokemonName}.json`)
  ) {
    const data = await fetchDirectory(
      "common/src/main/resources/data/cobblemon/species",
      branchName,
      { page: currentKnownPokemon.length / 20 + 1, recursive: true }
    );
    if (!data?.length)
      throw new Error("Pokemon not found: " + pokemonName);
    currentKnownPokemon.push(...data);
  }
  setCachedPokemonRefs(currentKnownPokemon);
  return currentKnownPokemon.find(
    ({ name }) => name === `${pokemonName}.json`
  );
}

const huntForSpawn = async (pokemonName, branchName) => {
  const currentKnownSpawns = [...cachedSpawnRefs];
  while (
    !currentKnownSpawns.some(({ name }) => name.endsWith(`${pokemonName}.json`))
  ) {
    const data = await fetchDirectory(
      "common/src/main/resources/data/cobblemon/spawn_pool_world",
      branchName,
      { page: currentKnownSpawns.length / 20 + 1, recursive: true }
    );
    if (!data?.length)
      throw new Error("Pokemon not found: " + pokemonName);
    currentKnownSpawns.push(...data);
  }
  setCachedSpawnRefs(currentKnownSpawns);
  return currentKnownSpawns.find(
    ({ name }) => name.endsWith(`${pokemonName}.json`)
  );
}

const huntForModel = async (pokemonName, branchName) => {
  const currentKnownModels = [...cachedModelRefs];
  while (!currentKnownModels.some(({ name }) => name.endsWith(`${pokemonName}`))) {
    const data = await fetchDirectory(
      "common/src/main/resources/assets/cobblemon/bedrock/pokemon/models",
      branchName,
      { page: currentKnownModels.length / 20 + 1, recursive: true }
    )
    if (!data?.length)
      throw new Error("Pokemon not found: " + pokemonName)
    currentKnownModels.push(...data);
  }
  setCachedModelRefs(currentKnownModels);
  return currentKnownModels.find(
    ({ name }) => name.endsWith(`${pokemonName}`)
  )
}

const huntForTexture = async (pokemonName, branchName) => {
  const currentKnownModels = [...cachedModelRefs];
  while (!currentKnownModels.some(({ name }) => name.endsWith(`${pokemonName}`))) {
    const data = await fetchDirectory(
      "common/src/main/resources/assets/cobblemon/textures/pokemon",
      branchName,
      { page: currentKnownModels.length / 20 + 1, recursive: true }
    )
    if (!data?.length)
      throw new Error("Pokemon not found: " + pokemonName)
    currentKnownModels.push(...data);
  }
  setCachedModelRefs(currentKnownModels);
  return currentKnownModels.find(
    ({ name }) => name.endsWith(`${pokemonName}`)
  )
}

async function fetchDirectory(
  dirname,
  branch = "main",
  { page = 1, recursive = false, pageSize = 20 } = {}
) {
  const response = await fetch(
    `https://gitlab.com/api/v4/projects/cable-mc%2Fcobblemon/repository/tree?id=cable-mc%2Fcobblemon&page=${page}&pagination=keyset&path=${dirname.replaceAll(
      "/",
      "%2F"
    )}&per_page=${pageSize}&recursive=${recursive}&ref=${branch}`
  );
  const data = await response.json();
  return data;
}

module.exports = { huntForPokemon, huntForSpawn, huntForModel, huntForTexture }