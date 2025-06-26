const recipes = {
  chocolate: {
    title: "Chocolate Cake",
    image: "https://media.istockphoto.com/id/501125914/photo/chocolate-cake-isolated-on-white.jpg?s=612x612&w=0&k=20&c=ng_Qb5EM4iZcmyqpwYwzwU_DVblybUY1WCmGBM0-rjU=",
    ingredients: ["1 cup flour", "1/2 cup cocoa powder", "1 cup sugar", "2 eggs", "1/2 cup milk"],
    steps: [
      "Preheat your oven to 350°F (175°C).",
      "Mix all dry ingredients together.",
      "Add eggs, milk, oil, and vanilla.",
      "Stir until smooth batter forms.",
      "Pour into a greased cake pan.",
      "Bake for 30–35 minutes.",
      "Let it cool before serving."
    ],
    time: 45,
    serves: 6
  },
  pasta: {
    title: "Pasta Alfredo",
    image: "https://img.freepik.com/free-photo/plate-fettuccine-alfredo-with-fresh-parsley_9975-124881.jpg",
    ingredients: ["Pasta", "Butter", "Garlic", "Cream", "Parmesan Cheese"],
    steps: [
      "Boil pasta until al dente.",
      "Heat butter and garlic in a pan.",
      "Add cream and stir gently.",
      "Add grated parmesan and mix.",
      "Combine sauce with pasta.",
      "Serve warm with herbs."
    ],
    time: 25,
    serves: 2
  },
  pizza: {
    title: "Veggie Pizza",
    image: "https://media.istockphoto.com/id/842082336/photo/homemade-veggie-pizza-with-mushrooms-peppers.jpg?s=612x612&w=0&k=20&c=op1vZnGjlB_c3w6Z-ohPo0wn4QveujVKZu4vTZCOWnc=",
    ingredients: ["Pizza base", "Tomato sauce", "Cheese", "Bell peppers", "Onions", "Olives"],
    steps: [
      "Spread sauce over base.",
      "Sprinkle cheese.",
      "Add toppings.",
      "Bake at 200°C for 15 mins.",
      "Slice and serve."
    ],
    time: 20,
    serves: 4
  },
  smoothie: {
    title: "Fruit Smoothie",
    image: "https://media.istockphoto.com/id/537522498/photo/freshly-blended-fruit-smoothies-of-various-colors-and-tastes.jpg?s=612x612&w=0&k=20&c=p-BeboePGQOBWVTCYETfCQzhMiOVyf2MVnSkV6aIUyQ=",
    ingredients: ["Banana", "Strawberries", "Yogurt", "Honey"],
    steps: [
      "Peel and chop fruits.",
      "Add yogurt and honey.",
      "Blend until smooth.",
      "Pour into glass and serve."
    ],
    time: 10,
    serves: 2
  }
};

let currentRecipe;
let stepIndex = 0;
let timerInterval;

const foodContainer = document.getElementById("foodContainer");
const recipeDetails = document.getElementById("recipeDetails");

window.onload = () => {
  foodContainer.style.display = "flex";
  for (let key in recipes) {
    const food = recipes[key];
    const div = document.createElement("div");
    div.className = "food-card";
    div.innerHTML = `
      <img src="${food.image}" alt="${food.title}" />
      <h3>${food.title}</h3>
      <div class='prep-info'>Prep Time: ${food.time} mins<br>Serves: ${food.serves}</div>
    `;
    div.onclick = () => showRecipe(key);
    foodContainer.appendChild(div);
  }
};

function showRecipe(key) {
  currentRecipe = recipes[key];
  document.getElementById("recipeTitle").textContent = currentRecipe.title;
  document.getElementById("recipeImage").src = currentRecipe.image;
  document.getElementById("prepTime").textContent = currentRecipe.time;
  document.getElementById("servings").textContent = currentRecipe.serves;
  document.getElementById("ingredientsList").innerHTML = "";
  document.getElementById("stepsList").innerHTML = "";
  document.getElementById("ingredientsList").classList.add("hidden");
  document.getElementById("stepsList").classList.add("hidden");
  document.getElementById("timerDisplay").classList.add("hidden");
  document.getElementById("timerLine").classList.add("hidden");
  foodContainer.style.display = "none";
  recipeDetails.style.display = "flex";
  stepIndex = 0;
}

function toggleIngredients() {
  const list = document.getElementById("ingredientsList");
  if (list.classList.contains("hidden")) {
    list.innerHTML = `<ul>${currentRecipe.ingredients.map(i => `<li>${i}</li>`).join("")}</ul>`;
    list.classList.remove("hidden");
  } else {
    list.classList.add("hidden");
  }
}

function toggleSteps() {
  const stepsList = document.getElementById("stepsList");
  if (stepsList.classList.contains("hidden")) {
    stepsList.innerHTML = currentRecipe.steps.map((s, i) =>
      `<div class="step-item" id="step${i}">${i + 1}. ${s}</div>`
    ).join("");
    stepsList.classList.remove("hidden");
  } else {
    stepsList.classList.add("hidden");
  }
}

function startCooking() {
  document.getElementById("timerDisplay").classList.remove("hidden");
  document.getElementById("timerLine").classList.remove("hidden");

  const timeText = document.getElementById("timeText");
  const progress = document.getElementById("timerLine");
  let total = currentRecipe.time * 60;
  let remaining = total;
  let stepDuration = total / currentRecipe.steps.length;

  clearInterval(timerInterval);
  stepIndex = 0;

  timerInterval = setInterval(() => {
    if (remaining <= 0 || stepIndex >= currentRecipe.steps.length) {
      clearInterval(timerInterval);
      timeText.textContent = "0m 0s - Completed!";
      return;
    }

    timeText.textContent = `${Math.floor(remaining / 60)}m ${remaining % 60}s`;
    progress.value = ((total - remaining) / total) * 100;

    for (let i = 0; i < currentRecipe.steps.length; i++) {
      const stepEl = document.getElementById(`step${i}`);
      if (stepEl) stepEl.classList.remove("active");
    }

    let activeStep = Math.floor((total - remaining) / stepDuration);
    const activeStepEl = document.getElementById(`step${activeStep}`);
    if (activeStepEl) activeStepEl.classList.add("active");

    remaining--;
  }, 1000);
}

function goBack() {
  recipeDetails.style.display = "none";
  foodContainer.style.display = "flex";
}

function printRecipe() {
  if (!currentRecipe) {
    alert("Please select a recipe first!");
    return;
  }

  const { title, image, time, serves, ingredients, steps } = currentRecipe;
  const printWindow = window.open('', '', 'width=800,height=600');

  printWindow.document.write(`
    <html>
    <head>
      <title>Print Recipe - ${title}</title>
    </head>
    <body>
      <h2>${title}</h2>
      <img src="${image}" alt="${title}" style="width:100%;max-height:250px;object-fit:cover;border-radius:10px;">
      <p><strong>Time:</strong> ${time} mins<br><strong>Servings:</strong> ${serves}</p>
      <h3>Ingredients</h3>
      <ul>${ingredients.map(i => `<li>${i}</li>`).join("")}</ul>
      <h3>Steps</h3>
      <ol>${steps.map(s => `<li>${s}</li>`).join("")}</ol>
      <script>
        setTimeout(() => {
          window.print();
          window.close();
        }, 300);
      <\/script>
    </body>
    </html>
  `);

  printWindow.document.close();
}
