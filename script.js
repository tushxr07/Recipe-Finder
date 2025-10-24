async function searchRecipes() {
    const ingredientInput = document.getElementById("ingredientInput").value;
    if (!ingredientInput) {
        alert("Please enter ingredients!");
        return;
    }

    const recipesContainer = document.getElementById("recipes");
    recipesContainer.innerHTML = '<div class="loading">Searching for delicious recipes...</div>';

    try {
        await trySpoonacularAPI(ingredientInput);
    } catch (error) {
        console.log("Direct API failed, trying alternative approach:", error);
        try {
            await tryWithCorsProxy(ingredientInput);
        } catch (proxyError) {
            console.log("CORS proxy failed, showing demo data:", proxyError);
            showDemoRecipes(ingredientInput);
        }
    }
}

async function trySpoonacularAPI(ingredients) {
    const apiKey = "953e670b3fbb4e45889d37b077a642c5";  
    const apiUrl = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&number=5&apiKey=${apiKey}`;

    const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    displayRecipes(data);
}

async function tryWithCorsProxy(ingredients) {
    const apiKey = "953e670b3fbb4e45889d37b077a642c5";  
    const apiUrl = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&number=5&apiKey=${apiKey}`;
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(apiUrl)}`;

    const response = await fetch(proxyUrl);
    const data = await response.json();
    const recipes = JSON.parse(data.contents);
    displayRecipes(recipes);
}

function showDemoRecipes(ingredients) {
    const recipesContainer = document.getElementById("recipes");
    
    const demoRecipes = [
        {
            id: 1,
            title: `Delicious ${ingredients.split(',')[0].trim()} Recipe`,
            image: "https://images.unsplash.com/photo-1556909114-4f6e4edc8291?w=400&h=300&fit=crop",
            sourceUrl: "#"
        },
        {
            id: 2,
            title: `Classic ${ingredients.includes('tomato') ? 'Tomato' : 'Homestyle'} Dish`,
            image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
            sourceUrl: "#"
        },
        {
            id: 3,
            title: `Fresh ${ingredients.includes('herb') || ingredients.includes('basil') ? 'Herb' : 'Garden'} Salad`,
            image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop",
            sourceUrl: "#"
        }
    ];

    recipesContainer.innerHTML = `
        <div style="background: linear-gradient(135deg, #fff3cd, #ffeaa7); border: 2px solid #ffc107; border-radius: 15px; padding: 20px; margin-bottom: 30px; text-align: center;">
            <h3 style="color: #856404; margin-bottom: 10px;">⚠️ API Connection Issue</h3>
            <p style="color: #856404; margin-bottom: 15px;">
                Unable to fetch live recipes due to CORS restrictions or API limitations. 
                This commonly happens when running from a browser due to security policies.
            </p>
            <details style="color: #856404; text-align: left; margin-top: 15px;">
                <summary style="cursor: pointer; font-weight: bold;">🛠️ How to fix this:</summary>
                <ul style="margin: 10px 0; padding-left: 20px;">
                    <li><strong>For development:</strong> Use a local server (e.g., Python's <code>http.server</code> or Node's <code>live-server</code>)</li>
                    <li><strong>For production:</strong> Move API calls to your backend server</li>
                    <li><strong>Alternative:</strong> Use a CORS proxy service</li>
                    <li><strong>Check API key:</strong> Ensure your Spoonacular API key is valid and has remaining quota</li>
                </ul>
            </details>
            <p style="color: #856404; margin-top: 15px;"><strong>Showing demo recipes below:</strong></p>
        </div>
    `;

    demoRecipes.forEach((recipe, index) => {
        const recipeDiv = document.createElement("div");
        recipeDiv.classList.add("recipe");
        recipeDiv.style.animationDelay = `${index * 0.1}s`;

        recipeDiv.innerHTML = `
            <h3>${recipe.title}</h3>
            <img src="${recipe.image}" alt="${recipe.title}">
            <a href="#" onclick="alert('This is a demo recipe. Connect to a real API for actual recipes!')">View Recipe (Demo)</a>
        `;

        recipesContainer.appendChild(recipeDiv);
    });
}

function displayRecipes(recipes) {
    const recipesContainer = document.getElementById("recipes");
    recipesContainer.innerHTML = "";

    if (recipes.length === 0) {
        recipesContainer.innerHTML = '<div class="no-recipes">No recipes found. Try different ingredients!</div>';
        return;
    }

    recipes.forEach((recipe, index) => {
        const recipeDiv = document.createElement("div");
        recipeDiv.classList.add("recipe");
        recipeDiv.style.animationDelay = `${index * 0.1}s`;

        recipeDiv.innerHTML = `
          <h3>${recipe.title}</h3>
          <img src="${recipe.image}" alt="${recipe.title}">
          <a href="https://spoonacular.com/recipes/${recipe.title.replace(/ /g, "-")}-${recipe.id}" target="_blank">View Recipe</a>
      `;

        recipesContainer.appendChild(recipeDiv);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('ingredientInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchRecipes();
        }
    });

});
