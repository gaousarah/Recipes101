import { useMemo, useState } from "react";

const initialRecipes = [
  {
    id: 1,
    name: "Pancakes",
    category: "Petit-déjeuner",
    time: "20 min",
    ingredients: ["2 œufs", "150 g de farine", "250 ml de lait"],
    instructions: "Mélange tout, puis fais cuire dans une poêle chaude."
  },
  {
    id: 2,
    name: "Pâtes tomate",
    category: "Déjeuner",
    time: "25 min",
    ingredients: ["200 g de pâtes", "Sauce tomate", "Parmesan"],
    instructions: "Fais cuire les pâtes puis mélange avec la sauce."
  },
  {
    id: 3,
    name: "Cookies",
    category: "Dessert",
    time: "30 min",
    ingredients: ["Farine", "Sucre", "Beurre", "Chocolat"],
    instructions: "Mélange, forme des boules et cuis au four."
  }
];

export default function App() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  const filteredRecipes = useMemo(() => {
    return initialRecipes.filter((recipe) =>
      recipe.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Recipes101</h1>
        <p style={styles.subtitle}>Mon carnet de recettes</p>

        <input
          type="text"
          placeholder="Rechercher une recette..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.input}
        />

        <div style={styles.grid}>
          {filteredRecipes.map((recipe) => (
            <button
              key={recipe.id}
              onClick={() => setSelected(recipe)}
              style={styles.card}
            >
              <div style={styles.cardCategory}>{recipe.category}</div>
              <div style={styles.cardTitle}>{recipe.name}</div>
              <div style={styles.cardTime}>{recipe.time}</div>
            </button>
          ))}
        </div>

        {selected && (
          <div style={styles.detailBox}>
            <h2 style={styles.detailTitle}>{selected.name}</h2>
            <p style={styles.detailMeta}>
              {selected.category} · {selected.time}
            </p>

            <h3 style={styles.sectionTitle}>Ingrédients</h3>
            <ul>
              {selected.ingredients.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            <h3 style={styles.sectionTitle}>Préparation</h3>
            <p>{selected.instructions}</p>

            <button onClick={() => setSelected(null)} style={styles.closeButton}>
              Fermer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#0f172a",
    color: "#f8fafc",
    fontFamily: "Arial, sans-serif",
    padding: "24px"
  },
  container: {
    maxWidth: "800px",
    margin: "0 auto"
  },
  title: {
    fontSize: "36px",
    marginBottom: "8px"
  },
  subtitle: {
    color: "#cbd5e1",
    marginBottom: "20px"
  },
  input: {
    width: "100%",
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid #334155",
    marginBottom: "20px",
    fontSize: "16px"
  },
  grid: {
    display: "grid",
    gap: "16px"
  },
  card: {
    textAlign: "left",
    background: "#1e293b",
    border: "1px solid #334155",
    borderRadius: "16px",
    padding: "18px",
    color: "#fff",
    cursor: "pointer"
  },
  cardCategory: {
    fontSize: "12px",
    opacity: 0.8,
    marginBottom: "6px"
  },
  cardTitle: {
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "6px"
  },
  cardTime: {
    fontSize: "14px",
    color: "#cbd5e1"
  },
  detailBox: {
    marginTop: "24px",
    background: "#1e293b",
    border: "1px solid #334155",
    borderRadius: "16px",
    padding: "20px"
  },
  detailTitle: {
    marginTop: 0
  },
  detailMeta: {
    color: "#cbd5e1"
  },
  sectionTitle: {
    marginBottom: "8px",
    marginTop: "20px"
  },
  closeButton: {
    marginTop: "20px",
    padding: "12px 16px",
    borderRadius: "10px",
    border: "none",
    background: "#38bdf8",
    color: "#0f172a",
    fontWeight: "bold",
    cursor: "pointer"
  }
