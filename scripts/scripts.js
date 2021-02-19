
// // WRITES THE INFORMATION TO THE DOM
function writeRecipes(extractedDishImage,extractedNameOfDish, extractedCookingTime, extractedDescription , extractedYield){
    // CREATES THE CONTAINER FOR EACH RECIPE AND ASSIGNS IT A CLASS
    const newRecipe = document.createElement('div');
    newRecipe.className = "new-recipe-container";
    const allRecipesContainer = document.querySelector('.results-container');
    allRecipesContainer.appendChild(newRecipe);

     // CREATES AN IMAGE FOR EACH RECIPE AND ASSIGNS IT A CLASS
     const recipeImage = document.createElement('img');
     recipeImage.src = `${extractedDishImage}`;
     recipeImage.className = 'new-recipe-image';
     newRecipe.appendChild(recipeImage);

     // CREATES A SUB-CONTAINER FOR THE TEXT OF EACH RECIPE AND ASSIGNS IT A CLASS
    const newRecipeText = document.createElement('div');
    newRecipeText.className = "new-recipe-text-container";
    newRecipe.appendChild(newRecipeText);

    // CREATES A PARAGRAPH FOR THE TITLE EACH RECIPE AND ASSIGNS IT A CLASS
    const recipeTitle = document.createElement('p');
    recipeTitle.textContent = `${extractedNameOfDish}`;
    recipeTitle.className = 'new-recipe-title';
    newRecipeText.appendChild(recipeTitle);

    // CREATES A PARAGRAPH FOR THE COOKING TIME OF EACH RECIPE AND ASSIGNS IT A CLASS
    const cookingTimeTitle = document.createElement('p');
    cookingTimeTitle.textContent = `${extractedCookingTime}`;
    newRecipeText.appendChild(cookingTimeTitle);
    // CHECKS IF THE COMING VALUE IS NULL AND ASSIGNS IT A CLASS THAT HIDES IT
    if(extractedCookingTime !== null){
        cookingTimeTitle.className = 'new-recipe-text';
    }else{
        cookingTimeTitle.className = 'new-recipe-hidden';
    }

    // CREATES A PARAGRAPH FOR THE DESCRIPTION OF EACH RECIPE AND ASSIGNS IT A CLASS
    const recipeDescription = document.createElement('p');
    recipeDescription.textContent = `${extractedDescription}`;
    newRecipeText.appendChild(recipeDescription);
    if(extractedDescription !== null){
        recipeDescription.className = 'new-recipe-text';
    }else{
        recipeDescription.className = 'new-recipe-hidden';
    }
   
    // CREATES A PARAGRAPH FOR THE AMOUNT THE RECIPE YIELDS AND ASSIGNS IT A CLASS
    const yieldText = document.createElement('p');
    yieldText.textContent = `${extractedYield}`;
    yieldText.className = 'new-recipe-text';   
    newRecipeText.appendChild(yieldText);
}


// ITERATES OVER THE FIRST TEN RECIPES ARRAY AND EXTRACTS THE INFORMATION
function extractRecipes(recipes){
    // FINDS THE OBJECTS LENGTH
    const recipesLength = Object.values(recipes.results).length;
    // ITERATES OVER THE OBJECT EXTRACTING THE DATA
    for(let i=0; i<recipesLength; i++){
        const extractedDishImage =  recipes.results[i].thumbnail_url;
        const extractedNameOfDish = recipes.results[i].name;    
        let extractedCookingTime;
        if (recipes.results[i].hasOwnProperty('total_time_tier')){
            extractedCookingTime = recipes.results[i].total_time_tier.display_tier;
        }else{
            extractedCookingTime = null;
        }
        const extractedDescription = recipes.results[i].description;
        const extractedYield = recipes.results[i].yields;
        writeRecipes(extractedDishImage, extractedNameOfDish, extractedCookingTime, extractedDescription , extractedYield);
    }
}

// REQUESTS RECIPES
function getRecipes(){
    const requestedRecipe = document.querySelector('.requested-recipe');
    const recipeToSearch = requestedRecipe.value;
    const recipes = {
        method: 'GET',
        url: 'https://tasty.p.rapidapi.com/recipes/list',
        params:  {from: '0', size: '10', tags: 'under_30_minutes', q:`'${recipeToSearch}'`},
        headers: {
          'x-rapidapi-key': '1e078aca86msh12c47f16c5a4e14p1f3185jsnc87189a97787',
          'x-rapidapi-host': 'tasty.p.rapidapi.com'
        }
    };
    console.log(recipeToSearch)
    axios.request(recipes).then(function (response) {
        const recipes = response.data;
        console.log(recipes);
        extractRecipes(recipes);
    }).catch(function (error) {
        console.error(`There's something wrong, ${error}`);
    });
}

// DETECTS A CLICK AND EXECUTES THE FUNCTION THAT GETS RECIPES
const requestButton = document.querySelector('.button-recipe');
requestButton.addEventListener('click', getRecipes);
