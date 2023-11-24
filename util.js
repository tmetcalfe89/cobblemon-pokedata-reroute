let cachedPokemonRefs = [];
const setCachedPokemonRefs = (newValue) => cachedPokemonRefs = newValue;

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

module.exports = { huntForPokemon }