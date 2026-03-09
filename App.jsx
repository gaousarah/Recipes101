import { useState, useMemo, useRef, useEffect } from "react";

const CATEGORIES = ["All", "Breakfast", "Lunch", "Dinner", "Dessert", "Snack", "Drink"];
const PREP_FILTERS = ["Any time", "Under 15 min", "Under 30 min", "Under 1 hour", "1+ hour"];

const C = {
  bg: "#0d1b2a",
  surface: "#111f30",
  card: "#13243a",
  cardEdge: "#1a3050",
  accent: "#7eb8d4",
  accentSoft: "#4a8bad",
  mist: "#b8d4e8",
  moon: "#deeef8",
  dim: "#3a5570",
  dimmer: "#243a52",
  text: "#cce4f4",
  textSoft: "#7eaac8",
  textDim: "#3d6080",
  star: "#a8c8e8",
  pink: "#e8a0b0",
  pinkDeep: "#c9607a",
  orange: "#f0a878",
  orangeSoft: "#d4845a",
};

const SAMPLE_RECIPES = [
  {
    id: 1, name: "Lemon Ricotta Pancakes", category: "Breakfast", prepTime: 20, servings: 4, photo: null, favorite: true,
    ingredients: [{ qty: "1 cup", name: "ricotta cheese" }, { qty: "2", name: "eggs" }, { qty: "1 tbsp", name: "lemon zest" }, { qty: "2 tbsp", name: "lemon juice" }, { qty: "½ cup", name: "all-purpose flour" }, { qty: "1 tsp", name: "baking powder" }, { qty: "2 tbsp", name: "sugar" }, { qty: "pinch", name: "salt" }],
    instructions: "1. Whisk ricotta, eggs, lemon zest and juice together.\n2. Stir in flour, baking powder, sugar, and salt until just combined.\n3. Heat a buttered skillet over medium heat.\n4. Drop ¼ cup batter per pancake and cook 2–3 min per side until golden.\n5. Serve with maple syrup and fresh berries.",
    notes: "For extra fluffiness, separate the eggs and fold in beaten whites at the end. Don't overmix!",
  },
  {
    id: 2, name: "Roasted Tomato Pasta", category: "Dinner", prepTime: 45, servings: 2, photo: null, favorite: false,
    ingredients: [{ qty: "400g", name: "cherry tomatoes" }, { qty: "200g", name: "pasta (rigatoni)" }, { qty: "4 cloves", name: "garlic" }, { qty: "3 tbsp", name: "olive oil" }, { qty: "½ cup", name: "fresh basil" }, { qty: "50g", name: "parmesan" }, { qty: "to taste", name: "salt & pepper" }],
    instructions: "1. Preheat oven to 200°C.\n2. Toss tomatoes and garlic in olive oil, season well. Roast 25 min.\n3. Cook pasta in salted water until al dente.\n4. Crush roasted tomatoes into a sauce, toss with pasta.\n5. Add basil, finish with parmesan.",
    notes: "Add a pinch of chilli flakes when roasting for a kick.",
  },
  {
    id: 3, name: "Miso Glazed Salmon", category: "Dinner", prepTime: 25, servings: 2, photo: null, favorite: true,
    ingredients: [{ qty: "2 fillets", name: "salmon" }, { qty: "2 tbsp", name: "white miso paste" }, { qty: "1 tbsp", name: "mirin" }, { qty: "1 tbsp", name: "soy sauce" }, { qty: "1 tsp", name: "sesame oil" }, { qty: "1 tsp", name: "honey" }],
    instructions: "1. Mix miso, mirin, soy, sesame oil and honey into a glaze.\n2. Coat salmon fillets and marinate 15 min.\n3. Broil on high for 8–10 min until caramelised.\n4. Serve with steamed rice and cucumber.",
    notes: "Don't marinate longer than 30 min — the miso can make fish mushy.",
  },
  {
    id: 4, name: "Brown Butter Cookies", category: "Dessert", prepTime: 30, servings: 24, photo: null, favorite: true,
    ingredients: [{ qty: "225g", name: "unsalted butter" }, { qty: "200g", name: "brown sugar" }, { qty: "100g", name: "white sugar" }, { qty: "2", name: "eggs" }, { qty: "1 tsp", name: "vanilla extract" }, { qty: "280g", name: "all-purpose flour" }, { qty: "1 tsp", name: "baking soda" }, { qty: "1 tsp", name: "sea salt" }, { qty: "300g", name: "chocolate chips" }],
    instructions: "1. Brown butter until nutty and golden. Cool 10 min.\n2. Whisk butter with both sugars. Add eggs and vanilla.\n3. Fold in flour, baking soda, salt, then chocolate chips.\n4. Chill dough 30 min. Roll into balls.\n5. Bake at 175°C for 11–13 min.",
    notes: "Sprinkle flaky sea salt on top before baking. Overnight chilled dough = even better.",
  },
  {
    id: 5, name: "Avocado Toast", category: "Breakfast", prepTime: 10, servings: 1, photo: null, favorite: false,
    ingredients: [{ qty: "2 slices", name: "sourdough bread" }, { qty: "1 large", name: "ripe avocado" }, { qty: "1", name: "lemon, juiced" }, { qty: "pinch", name: "chilli flakes" }, { qty: "to taste", name: "flaky salt" }],
    instructions: "1. Toast sourdough until golden.\n2. Mash avocado with lemon juice and salt.\n3. Spread on toast, top with chilli flakes.",
    notes: "Add a poached egg on top for extra protein.",
  },
];

const emptyRecipe = () => ({
  id: Date.now(), name: "", category: "Dinner", prepTime: 30, servings: 2,
  photo: null, ingredients: [{ qty: "", name: "" }], instructions: "", notes: "", favorite: false,
});

const catEmoji = { Breakfast: "🌅", Lunch: "☀️", Dinner: "🌙", Dessert: "✨", Snack: "🌿", Drink: "💧" };

function Stars() {
  const stars = useMemo(() => Array.from({ length: 55 }, (_, i) => ({
    id: i, x: Math.random() * 100, y: Math.random() * 100,
    size: Math.random() * 1.8 + 0.5, opacity: Math.random() * 0.5 + 0.1, delay: Math.random() * 4,
  })), []);
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
      {stars.map(s => (
        <div key={s.id} style={{
          position: "absolute", left: `${s.x}%`, top: `${s.y}%`,
          width: s.size, height: s.size, borderRadius: "50%",
          background: C.star, opacity: s.opacity,
          animation: `twinkle ${3 + s.delay}s ease-in-out infinite alternate`,
          animationDelay: `${s.delay}s`,
        }} />
      ))}
    </div>
  );
}

function FilterPanel({ open, search, setSearch, category, setCategory, prepFilter, setPrepFilter, onClose }) {
  return (
    <>
      {open && <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 40 }} />}
      <div style={{
        position: "fixed", top: 62, left: 16, zIndex: 50, width: 300,
        background: "linear-gradient(160deg, #0e1f32 0%, #0b1826 100%)",
        border: `1px solid ${C.dim}`, borderRadius: 20,
        padding: open ? "22px" : "0 22px", maxHeight: open ? 520 : 0,
        overflow: "hidden", opacity: open ? 1 : 0,
        transform: open ? "translateY(0) scale(1)" : "translateY(-10px) scale(0.97)",
        transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
        boxShadow: open ? `0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px ${C.dimmer}` : "none",
        backdropFilter: "blur(20px)", pointerEvents: open ? "all" : "none",
      }}>
        <div style={{ marginBottom: 18 }}>
          <label style={labelSm}>Search</label>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", opacity: 0.5, fontSize: 14 }}>🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="name or ingredient…"
              style={{ width: "100%", padding: "9px 12px 9px 34px", borderRadius: 12, border: `1px solid ${C.dim}`, background: C.dimmer, color: C.text, fontFamily: "'DM Sans', sans-serif", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
          </div>
        </div>
        <div style={{ marginBottom: 18 }}>
          <label style={labelSm}>Category</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setCategory(c)} style={{ padding: "5px 12px", borderRadius: 20, border: `1px solid ${category === c ? C.pink : C.dim}`, background: category === c ? C.pinkDeep : "transparent", color: category === c ? C.moon : C.textSoft, cursor: "pointer", fontSize: 12, fontFamily: "'DM Sans', sans-serif", fontWeight: 600, transition: "all 0.15s" }}>
                {c === "All" ? "All" : `${catEmoji[c]} ${c}`}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label style={labelSm}>Prep Time</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {PREP_FILTERS.map(p => (
              <button key={p} onClick={() => setPrepFilter(p)} style={{ padding: "5px 12px", borderRadius: 20, border: `1px solid ${prepFilter === p ? C.orange : C.dim}`, background: prepFilter === p ? C.orangeSoft : "transparent", color: prepFilter === p ? C.moon : C.textSoft, cursor: "pointer", fontSize: 12, fontFamily: "'DM Sans', sans-serif", fontWeight: 600, transition: "all 0.15s" }}>
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function PhotoUpload({ photo, onChange }) {
  const ref = useRef();
  const handle = e => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => onChange(ev.target.result);
    reader.readAsDataURL(file);
  };
  return (
    <div onClick={() => ref.current.click()} style={{ width: "100%", height: 150, borderRadius: 16, background: photo ? `url(${photo}) center/cover` : C.dimmer, border: `2px dashed ${C.dim}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", marginBottom: 16, position: "relative" }}>
      {!photo && <div style={{ textAlign: "center", color: C.textSoft }}><div style={{ fontSize: 26 }}>📷</div><div style={{ fontSize: 12, fontFamily: "'DM Sans', sans-serif" }}>Add photo</div></div>}
      {photo && <button onClick={e => { e.stopPropagation(); onChange(null); }} style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.6)", color: "#fff", border: "none", borderRadius: "50%", width: 26, height: 26, cursor: "pointer", fontSize: 13 }}>✕</button>}
      <input ref={ref} type="file" accept="image/*" style={{ display: "none" }} onChange={handle} />
    </div>
  );
}

function RecipeDetail({ recipe, onClose, onEdit, onDelete }) {
  const [scale, setScale] = useState(1);
  const scaleQty = qty => {
    const num = parseFloat(qty);
    if (isNaN(num)) return qty;
    return qty.replace(/[\d.]+/, Math.round(num * scale * 100) / 100);
  };
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 80, background: "rgba(5,12,22,0.88)", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: "linear-gradient(170deg, #0f2035 0%, #091525 100%)", border: `1px solid ${C.cardEdge}`, borderRadius: 28, maxWidth: 560, width: "100%", maxHeight: "88vh", overflowY: "auto", padding: "30px", position: "relative", boxShadow: `0 40px 80px rgba(0,0,0,0.7), inset 0 1px 0 rgba(126,184,212,0.15)` }}>
        <button onClick={onClose} style={{ position: "absolute", top: 18, right: 18, background: C.dimmer, border: `1px solid ${C.dim}`, color: C.textSoft, borderRadius: "50%", width: 34, height: 34, cursor: "pointer", fontSize: 14 }}>✕</button>
        {recipe.photo && <div style={{ width: "100%", height: 200, borderRadius: 18, background: `url(${recipe.photo}) center/cover`, marginBottom: 22 }} />}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(201,96,122,0.15)", border: `1px solid ${C.pinkDeep}`, borderRadius: 20, padding: "4px 12px", marginBottom: 12, fontSize: 12, color: C.pink, fontFamily: "'DM Sans', sans-serif", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>
          {catEmoji[recipe.category]} {recipe.category}
        </div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", color: C.moon, fontSize: 26, margin: "0 0 8px", lineHeight: 1.2 }}>{recipe.name} {recipe.favorite && "⭐"}</h2>
        <div style={{ display: "flex", gap: 18, fontSize: 13, marginBottom: 22, fontFamily: "'DM Sans', sans-serif" }}>
          <span style={{ color: C.orange, fontWeight: 600 }}>⏱ {recipe.prepTime} min</span>
          <span style={{ color: C.textSoft }}>🍴 {recipe.servings} servings</span>
          <span style={{ color: C.textSoft }}>📝 {recipe.ingredients.length} ingredients</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22, background: C.dimmer, borderRadius: 14, padding: "12px 16px", border: `1px solid ${C.dim}` }}>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: C.textSoft }}>Scale:</span>
          {[0.5, 1, 1.5, 2, 3].map(s => (
            <button key={s} onClick={() => setScale(s)} style={{ padding: "4px 12px", borderRadius: 20, border: `1px solid ${scale === s ? C.accent : C.dim}`, background: scale === s ? C.accentSoft : "transparent", color: scale === s ? C.moon : C.textSoft, cursor: "pointer", fontSize: 13, fontFamily: "'DM Sans', sans-serif", fontWeight: 700 }}>×{s}</button>
          ))}
        </div>
        <h4 style={{ fontFamily: "'Playfair Display', serif", color: C.pink, fontSize: 17, margin: "0 0 12px" }}>Ingredients</h4>
        <ul style={{ listStyle: "none", padding: 0, margin: "0 0 22px" }}>
          {recipe.ingredients.map((ing, i) => (
            <li key={i} style={{ display: "flex", gap: 14, padding: "9px 0", borderBottom: `1px solid ${C.dimmer}`, fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: C.text }}>
              <span style={{ color: C.orange, fontWeight: 700, minWidth: 90 }}>{scaleQty(ing.qty)}</span>
              <span>{ing.name}</span>
            </li>
          ))}
        </ul>
        <h4 style={{ fontFamily: "'Playfair Display', serif", color: C.pink, fontSize: 17, margin: "0 0 12px" }}>Instructions</h4>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: C.text, lineHeight: 1.85, whiteSpace: "pre-line", marginBottom: 22 }}>{recipe.instructions}</div>
        {recipe.notes && (
          <div style={{ background: "rgba(240,168,120,0.08)", borderRadius: 14, border: `1px solid rgba(240,168,120,0.25)`, padding: "14px 16px", marginBottom: 26 }}>
            <div style={{ fontFamily: "'Playfair Display', serif", color: C.orange, fontSize: 14, marginBottom: 6 }}>📌 Notes</div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13.5, color: C.textSoft, lineHeight: 1.7 }}>{recipe.notes}</div>
          </div>
        )}
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => onEdit(recipe)} style={{ flex: 1, padding: 11, borderRadius: 14, background: C.accentSoft, color: C.moon, border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 14 }}>✏️ Edit</button>
          <button onClick={() => window.print()} style={{ flex: 1, padding: 11, borderRadius: 14, background: C.dimmer, color: C.textSoft, border: `1px solid ${C.dim}`, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 14 }}>🖨️ Print</button>
          <button onClick={() => onDelete(recipe.id)} style={{ padding: "11px 16px", borderRadius: 14, background: "rgba(180,60,60,0.15)", color: "#e88", border: "1px solid rgba(180,60,60,0.3)", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 14 }}>🗑️</button>
        </div>
      </div>
    </div>
  );
}

function RecipeForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || emptyRecipe());
  const set = (f, v) => setForm(p => ({ ...p, [f]: v }));
  const setIng = (i, f, v) => { const arr = [...form.ingredients]; arr[i] = { ...arr[i], [f]: v }; set("ingredients", arr); };
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 80, background: "rgba(5,12,22,0.88)", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: "linear-gradient(170deg, #0f2035 0%, #091525 100%)", border: `1px solid ${C.cardEdge}`, borderRadius: 28, maxWidth: 540, width: "100%", maxHeight: "88vh", overflowY: "auto", padding: "28px", boxShadow: `0 40px 80px rgba(0,0,0,0.7)` }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", color: C.moon, marginTop: 0, marginBottom: 20 }}>{initial?.name ? "Edit Recipe" : "New Recipe ✨"}</h2>
        <PhotoUpload photo={form.photo} onChange={v => set("photo", v)} />
        <label style={labelSm}>Recipe Name</label>
        <input value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Lemon Ricotta Pancakes" style={fi} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 14 }}>
          <div><label style={labelSm}>Category</label><select value={form.category} onChange={e => set("category", e.target.value)} style={fi}>{CATEGORIES.filter(c => c !== "All").map(c => <option key={c} style={{ background: "#0f2035" }}>{c}</option>)}</select></div>
          <div><label style={labelSm}>Prep (min)</label><input type="number" value={form.prepTime} onChange={e => set("prepTime", parseInt(e.target.value) || 0)} style={fi} /></div>
          <div><label style={labelSm}>Servings</label><input type="number" value={form.servings} onChange={e => set("servings", parseInt(e.target.value) || 1)} style={fi} /></div>
        </div>
        <label style={labelSm}>Ingredients</label>
        {form.ingredients.map((ing, i) => (
          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <input value={ing.qty} onChange={e => setIng(i, "qty", e.target.value)} placeholder="Qty" style={{ ...fi, width: "30%", marginBottom: 0 }} />
            <input value={ing.name} onChange={e => setIng(i, "name", e.target.value)} placeholder="Ingredient" style={{ ...fi, flex: 1, marginBottom: 0 }} />
            <button onClick={() => set("ingredients", form.ingredients.filter((_, idx) => idx !== i))} style={{ background: "rgba(180,60,60,0.15)", border: "1px solid rgba(180,60,60,0.3)", color: "#e88", borderRadius: 10, padding: "0 12px", cursor: "pointer" }}>✕</button>
          </div>
        ))}
        <button onClick={() => set("ingredients", [...form.ingredients, { qty: "", name: "" }])} style={{ background: "transparent", border: `1px dashed ${C.dim}`, color: C.textSoft, borderRadius: 12, padding: "8px 16px", cursor: "pointer", fontSize: 13, marginBottom: 14, fontFamily: "'DM Sans', sans-serif" }}>+ Add Ingredient</button>
        <label style={labelSm}>Instructions</label>
        <textarea value={form.instructions} onChange={e => set("instructions", e.target.value)} placeholder="Step by step…" rows={5} style={{ ...fi, resize: "vertical", lineHeight: 1.7 }} />
        <label style={labelSm}>Notes</label>
        <textarea value={form.notes} onChange={e => set("notes", e.target.value)} placeholder="Tips, variations…" rows={3} style={{ ...fi, resize: "vertical" }} />
        <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", marginBottom: 20, fontFamily: "'DM Sans', sans-serif", color: C.textSoft, fontSize: 14 }}>
          <input type="checkbox" checked={form.favorite} onChange={e => set("favorite", e.target.checked)} /> ⭐ Mark as favourite
        </label>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => onSave(form)} style={{ flex: 1, padding: 12, borderRadius: 14, background: C.accentSoft, color: C.moon, border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 14 }}>Save Recipe</button>
          <button onClick={onCancel} style={{ padding: "12px 20px", borderRadius: 14, background: C.dimmer, color: C.textSoft, border: `1px solid ${C.dim}`, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 14 }}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

const labelSm = { display: "block", fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700, color: C.pink, letterSpacing: "0.09em", textTransform: "uppercase", marginBottom: 5 };
const fi = { width: "100%", padding: "10px 13px", borderRadius: 12, border: `1px solid ${C.dim}`, background: C.dimmer, color: C.text, fontFamily: "'DM Sans', sans-serif", fontSize: 14, marginBottom: 14, boxSizing: "border-box", outline: "none" };

function Carousel({ recipes, onView }) {
  const [idx, setIdx] = useState(0);
  const [offset, setOffset] = useState(0);
  const isDraggingRef = useRef(false);
  const startX = useRef(null);
  const lastX = useRef(null);
  const lastT = useRef(null);
  const vel = useRef(0);
  const rafId = useRef(null);
  const offsetRef = useRef(0);

  useEffect(() => { setIdx(0); setOffset(0); offsetRef.current = 0; }, [recipes.length]);

  const total = recipes.length;

  const cancelRaf = () => { if (rafId.current) { cancelAnimationFrame(rafId.current); rafId.current = null; } };

  const animateTo = (target, onDone) => {
    cancelRaf();
    const step = () => {
      const diff = target - offsetRef.current;
      if (Math.abs(diff) < 2) {
        offsetRef.current = target;
        setOffset(target);
        onDone?.();
        return;
      }
      offsetRef.current += diff * 0.72;
      setOffset(offsetRef.current);
      rafId.current = requestAnimationFrame(step);
    };
    rafId.current = requestAnimationFrame(step);
  };

  const snapTo = (dir) => {
    if (total === 0) return;
    const targetOffset = dir === "next" ? -260 : 260;
    animateTo(targetOffset, () => {
      setIdx(i => dir === "next" ? (i + 1) % total : (i - 1 + total) % total);
      offsetRef.current = 0;
      setOffset(0);
    });
  };

  const onDown = (e) => {
    cancelRaf();
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    startX.current = x; lastX.current = x; lastT.current = performance.now();
    vel.current = 0;
    isDraggingRef.current = true;
  };

  const onMove = (e) => {
    if (!isDraggingRef.current || startX.current === null) return;
    e.preventDefault?.();
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const now = performance.now();
    const dt = Math.max(now - lastT.current, 1);
    vel.current = (x - lastX.current) / dt * 16;
    lastX.current = x; lastT.current = now;
    const raw = x - startX.current;
    offsetRef.current = raw;
    setOffset(raw);
  };

  const onUp = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    const x = offsetRef.current;
    const v = vel.current;
    if (x < -50 || v < -2.5) snapTo("next");
    else if (x > 50 || v > 2.5) snapTo("prev");
    else animateTo(0);
    startX.current = null;
  };

  useEffect(() => () => cancelRaf(), []);

  if (total === 0) return (
    <div style={{ textAlign: "center", padding: "80px 20px", color: C.textSoft }}>
      <div style={{ fontSize: 52, marginBottom: 14 }}>🌙</div>
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: C.mist, marginBottom: 8 }}>No recipes found</div>
      <div style={{ fontSize: 14 }}>Adjust filters or add a new recipe</div>
    </div>
  );

  const recipe = recipes[idx];
  const prepLabel = recipe.prepTime < 60 ? `${recipe.prepTime} min` : `${Math.floor(recipe.prepTime / 60)}h${recipe.prepTime % 60 ? ` ${recipe.prepTime % 60}m` : ""}`;
  const peek = Math.min(2, total - 1);
  const clamp = Math.sign(offset) * Math.min(Math.abs(offset), 160);
  const rot = clamp * 0.03;
  const isDragged = isDraggingRef.current && Math.abs(offset) > 8;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", userSelect: "none" }}>
      <div
        style={{ position: "relative", width: "100%", maxWidth: 370, height: 490, marginBottom: 26, touchAction: "none" }}
        onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}
        onTouchStart={onDown} onTouchMove={onMove} onTouchEnd={onUp}
      >
        {[...Array(peek)].map((_, pi) => (
          <div key={pi} style={{
            position: "absolute",
            left: `${(pi + 1) * 10}px`, right: `${(pi + 1) * 10}px`,
            top: `${(pi + 1) * 9}px`, bottom: `-${(pi + 1) * 9}px`,
            background: pi === 0 ? C.card : C.surface,
            borderRadius: 28, border: `1px solid ${C.cardEdge}`,
            opacity: 0.45 - pi * 0.15, zIndex: peek - pi,
          }} />
        ))}

        <div
          onClick={() => { if (!isDragged) onView(recipe); }}
          style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(160deg, #162d47 0%, #0c1e31 100%)",
            borderRadius: 28, border: `1px solid ${C.cardEdge}`,
            boxShadow: `0 20px 60px rgba(0,0,0,0.55), inset 0 1px 0 rgba(126,184,212,0.12)`,
            cursor: isDragged ? "grabbing" : "pointer",
            zIndex: 10, display: "flex", flexDirection: "column", overflow: "hidden",
            transform: `translateX(${clamp}px) rotate(${rot}deg)`,
            willChange: "transform",
          }}
        >
          <div style={{ height: 210, flexShrink: 0, position: "relative", overflow: "hidden", background: recipe.photo ? `url(${recipe.photo}) center/cover` : `linear-gradient(135deg, #1a3a58 0%, #0e2a42 50%, #122438 100%)` }}>
            {!recipe.photo && <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 80, opacity: 0.14 }}>{catEmoji[recipe.category]}</div>}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 60%, rgba(12,30,49,0.8) 100%)" }} />
            <div style={{ position: "absolute", top: 16, left: 16, background: "rgba(201,96,122,0.18)", backdropFilter: "blur(8px)", border: `1px solid ${C.pinkDeep}`, borderRadius: 20, padding: "5px 13px", fontSize: 11, color: C.pink, fontFamily: "'DM Sans', sans-serif", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase" }}>
              {catEmoji[recipe.category]} {recipe.category}
            </div>
            {recipe.favorite && <div style={{ position: "absolute", top: 14, right: 16, fontSize: 20, filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))" }}>⭐</div>}
          </div>

          <div style={{ padding: "20px 24px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", color: C.moon, fontSize: 22, margin: "0 0 8px", lineHeight: 1.25 }}>{recipe.name}</h2>
              <p style={{ fontFamily: "'DM Sans', sans-serif", color: C.textSoft, fontSize: 13, margin: 0, lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                {recipe.ingredients.slice(0, 5).map(i => i.name).join(", ")}{recipe.ingredients.length > 5 ? "…" : ""}
              </p>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 18 }}>
              <div style={{ display: "flex", gap: 14 }}>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: C.orange, fontWeight: 600 }}>⏱ {prepLabel}</span>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: C.textSoft }}>🍴 {recipe.servings}</span>
              </div>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: C.pink, fontWeight: 700 }}>tap to open →</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
        <button onClick={() => snapTo("prev")} style={{ width: 46, height: 46, borderRadius: "50%", background: C.card, border: `1px solid ${C.cardEdge}`, color: C.mist, cursor: "pointer", fontSize: 18 }}>←</button>
        <span style={{ fontFamily: "'DM Sans', sans-serif", color: C.textSoft, fontSize: 14, minWidth: 60, textAlign: "center" }}>{idx + 1} / {total}</span>
        <button onClick={() => snapTo("next")} style={{ width: 46, height: 46, borderRadius: "50%", background: C.card, border: `1px solid ${C.cardEdge}`, color: C.mist, cursor: "pointer", fontSize: 18 }}>→</button>
      </div>

      <div style={{ display: "flex", gap: 6, marginTop: 14 }}>
        {recipes.slice(0, Math.min(total, 9)).map((_, i) => (
          <div key={i} onClick={() => { cancelRaf(); setIdx(i); offsetRef.current = 0; setOffset(0); }} style={{ width: i === idx ? 22 : 6, height: 6, borderRadius: 3, background: i === idx ? C.accent : C.dim, transition: "all 0.3s ease", cursor: "pointer" }} />
        ))}
        {total > 9 && <div style={{ color: C.textDim, fontSize: 11, alignSelf: "center" }}>+{total - 9}</div>}
      </div>
    </div>
  );
}

export default function App() {
  const [recipes, setRecipes] = useState(SAMPLE_RECIPES);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [prepFilter, setPrepFilter] = useState("Any time");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [viewing, setViewing] = useState(null);
  const [editing, setEditing] = useState(null);
  const [adding, setAdding] = useState(false);

  const prepMax = { "Any time": Infinity, "Under 15 min": 15, "Under 30 min": 30, "Under 1 hour": 60, "1+ hour": Infinity };
  const prepMin = { "1+ hour": 60 };

  const filtered = useMemo(() => recipes.filter(r => {
    const s = search.toLowerCase();
    return (!s || r.name.toLowerCase().includes(s) || r.ingredients.some(i => i.name.toLowerCase().includes(s)))
      && (category === "All" || r.category === category)
      && r.prepTime <= prepMax[prepFilter] && r.prepTime >= (prepMin[prepFilter] || 0);
  }), [recipes, search, category, prepFilter]);

  const activeFilters = (search ? 1 : 0) + (category !== "All" ? 1 : 0) + (prepFilter !== "Any time" ? 1 : 0);

  const surpriseMe = () => { if (filtered.length) setViewing(filtered[Math.floor(Math.random() * filtered.length)]); };

  const saveRecipe = rec => {
    setRecipes(rs => rs.find(r => r.id === rec.id) ? rs.map(r => r.id === rec.id ? rec : r) : [...rs, rec]);
    setAdding(false); setEditing(null); setViewing(rec);
  };
  const deleteRecipe = id => { setRecipes(rs => rs.filter(r => r.id !== id)); setViewing(null); };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${C.bg}; }
        @keyframes twinkle { from { opacity: 0.08; } to { opacity: 0.55; } }
        @media print { .no-print { display: none !important; } }
      `}</style>

      <Stars />

      <div style={{ minHeight: "100vh", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div className="no-print" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px" }}>
          <button onClick={() => setFiltersOpen(o => !o)} style={{ display: "flex", alignItems: "center", gap: 8, background: filtersOpen ? C.accentSoft : C.card, border: `1px solid ${filtersOpen ? C.accent : C.cardEdge}`, color: filtersOpen ? C.moon : C.textSoft, borderRadius: 14, padding: "9px 16px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 14, transition: "all 0.2s" }}>
            ⚙️ Filters
            {activeFilters > 0 && <span style={{ background: C.pink, color: "#1a0a10", borderRadius: "50%", width: 18, height: 18, fontSize: 11, fontWeight: 700, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>{activeFilters}</span>}
          </button>

          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "'Playfair Display', serif", color: C.moon, fontSize: 20, fontWeight: 700 }}>My Recipes</div>
            <div style={{ fontSize: 11, color: C.textDim, fontFamily: "'DM Sans', sans-serif", marginTop: 2 }}>{recipes.length} saved</div>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={surpriseMe} title="Surprise me!" style={{ background: C.card, border: `1px solid ${C.cardEdge}`, color: C.textSoft, borderRadius: 12, padding: "9px 12px", cursor: "pointer", fontSize: 16 }}>🎲</button>
            <button onClick={() => setAdding(true)} style={{ background: C.accentSoft, border: "none", color: C.moon, borderRadius: 12, padding: "9px 14px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 14 }}>+ Add</button>
          </div>
        </div>

        <FilterPanel open={filtersOpen} search={search} setSearch={setSearch} category={category} setCategory={setCategory} prepFilter={prepFilter} setPrepFilter={setPrepFilter} onClose={() => setFiltersOpen(false)} />

        <div style={{ padding: "8px 20px 48px", display: "flex", justifyContent: "center" }}>
          <div style={{ width: "100%", maxWidth: 460 }}>
            <Carousel recipes={filtered} onView={setViewing} />
          </div>
        </div>
      </div>

      {viewing && !editing && <RecipeDetail recipe={viewing} onClose={() => setViewing(null)} onEdit={r => { setEditing(r); setViewing(null); }} onDelete={deleteRecipe} />}
      {(adding || editing) && <RecipeForm initial={editing} onSave={saveRecipe} onCancel={() => { setAdding(false); setEditing(null); }} />}
    </>
  );
}
