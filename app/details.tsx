import { Stack, router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";

import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Details() {
  const { id } = useLocalSearchParams();

  const [pokemon, setPokemon] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const colorByType: Record<string, string> = {
    normal: "#A8A77A",
    fire: "#EE8130",
    water: "#6390F0",
    electric: "#F7D02C",
    grass: "#7AC74C",
    ice: "#96D9D6",
    fighting: "#C22E28",
    poison: "#A33EA1",
    ground: "#E2BF65",
    flying: "#A98FF3",
    psychic: "#F95587",
    bug: "#A6B91A",
    rock: "#B6A136",
    ghost: "#735797",
    dragon: "#6F35FC",
    dark: "#705746",
    steel: "#B7B7CE",
    fairy: "#D685AD",
  };

  useEffect(() => {
    fetchPokemonDetails(id);
  }, [id]);

  const fetchPokemonDetails = async (id: any) => {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      const data = await response.json();
      setPokemon(data);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !pokemon) {
    return <Text style={{ padding: 20 }}>Loading...</Text>;
  }

  function handleLeftClick() {
    const newId = Number(id) - 1;

    if (newId <= 0) {
      alert("This is the First pokemon");
      return;
    }

    router.replace(`/details?id=${newId}`);
  }

  function handleRightClick() {
    const newId = Number(id) + 1;

    if (newId >= 152) {
      alert("This is the Last pokemon");
      return;
    }

    router.replace(`/details?id=${newId}`);
  }

  return (
    <>
      <Stack.Screen options={{ title: pokemon.name }} />
      <ScrollView
        contentContainerStyle={{
          padding: 20,
          gap: 20,
          backgroundColor: colorByType[pokemon.types[0].type.name] + "50",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Left Arrow */}
          <TouchableOpacity style={styles.arrowBtn} onPress={handleLeftClick}>
            <Text style={styles.arrowText}>←</Text>
          </TouchableOpacity>

          {/* Name */}
          <Text style={styles.title}>
            {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)} #
            {pokemon.id}
          </Text>

          {/* Right Arrow */}
          <TouchableOpacity style={styles.arrowBtn} onPress={handleRightClick}>
            <Text style={styles.arrowText}>→</Text>
          </TouchableOpacity>
        </View>

        {/* Images */}
        <View style={styles.imageRow}>
          <Image
            source={{
              uri: pokemon.sprites.other["official-artwork"].front_default,
            }}
            style={styles.mainImage}
          />
        </View>

        {/* Types */}
        <View style={styles.typeRow}>
          {pokemon.types.map((t: any) => (
            <View
              key={t.type.name}
              style={[
                styles.typeChip,
                { backgroundColor: colorByType[t.type.name] },
              ]}
            >
              <Text style={styles.typeText}>
                {t.type.name.charAt(0).toUpperCase() + t.type.name.slice(1)}
              </Text>
            </View>
          ))}
        </View>

        {/* Stats */}
        <View style={{ backgroundColor: "lightgray", padding: 20 }}>
          <Text style={styles.sectionTitle}>Stats</Text>
          {pokemon.stats.map((s: any) => (
            <Text key={s.stat.name} style={styles.statText}>
              {s.stat.name.toUpperCase()}: {s.base_stat}
            </Text>
          ))}
        </View>

        {/* Images (normal + shiny) */}
        <View style={{ backgroundColor: "lightgray", padding: 20 }}>
          <Text style={styles.sectionTitle}>Sprites (Normal & Shiny)</Text>
          <View style={styles.spriteRow}>
            <Image
              source={{ uri: pokemon.sprites.front_default }}
              style={styles.sprite}
            />
            <Image
              source={{ uri: pokemon.sprites.front_shiny }}
              style={styles.sprite}
            />
          </View>
        </View>

        {/* Abilities */}
        <View style={{ backgroundColor: "lightgray", padding: 20 }}>
          <Text style={styles.sectionTitle}>Abilities</Text>
          {pokemon.abilities.map((a: any) => (
            <Text key={a.ability.name} style={styles.statText}>
              {a.ability.name}
            </Text>
          ))}
        </View>

        {/* Height & Weight */}
        <View
          style={{
            backgroundColor: "lightgray",
            padding: 20,
            borderRadius: 20,
          }}
        >
          <Text style={styles.sectionTitle}>Info</Text>
          <Text style={styles.statText}>Height: {pokemon.height / 10} m</Text>
          <Text style={styles.statText}>Weight: {pokemon.weight / 10} kg</Text>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  arrowBtn: {
    backgroundColor: "white",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    elevation: 3, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
  },
  arrowText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    textAlign: "center",
  },
  imageRow: {
    alignItems: "center",
  },
  mainImage: {
    width: 250,
    height: 250,
  },
  typeRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  typeChip: {
    backgroundColor: "#ddd",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  typeText: {
    fontSize: 18,
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  statText: {
    fontSize: 18,
    marginBottom: 4,
  },
  spriteRow: {
    flexDirection: "row",
    gap: 20,
    justifyContent: "center",
  },
  sprite: {
    width: 120,
    height: 120,
  },
});
