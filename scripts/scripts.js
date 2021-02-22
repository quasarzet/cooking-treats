// WRITES A FINAL MESSAGE WHEN EVERYTHING HAS BEEN LOADED
function finalMessage(){
    const finalText = document.createElement('p');
    const allRecipesContainer = document.querySelector('.results-container');
    allRecipesContainer.appendChild(finalText);
}


// CHECK IF ALL RECIPES WERE LOADED
const loadingSvg = document.querySelector('.loading-svg-container');
let recipesLoaded = 0;
let ready = false;
function recipeLoaded(totalRecipes){
    recipesLoaded++;
    if (recipesLoaded === displayedRecipes){
        ready = true;
        loadingSvg.hidden = true;
    }
    if(recipesLoaded === totalRecipes){
        ready = false;
        loadingSvg.hidden = true;
        finalMessage();
    }
}


//WRITES THE DETAILS: INGREDIENTS AND PREPARATION TO THE OVERLAY
function writeRecipeDetails(recipeDetails){
    const recipeTitle = document.querySelector('.recipe-title');
    const recipeImage = document.querySelector('.recipe-image');
    const eachIngredient = document.querySelector('.each-ingredient');
    const ingredientsArray = recipeDetails.sections[0].components;
    const instructionsArray = recipeDetails.instructions;
    const preparationContainer = document.querySelector('.preparation-container');
   
    
    // ITERATES OVER THE INGREDIENTS ARRAY
    ingredientsArray.forEach(element =>{
        // APPENDS THE QUANTITY FOR EACH INGREDIENT
        const newIngredientQuantity = document.createElement('span');
        if(element.measurements[0].quantity === "0"){
            newIngredientQuantity.textContent = "";
        }else{
            newIngredientQuantity.textContent = `${element.measurements[0].quantity} `;
        }
        newIngredientQuantity.className = "new-ingredient";
        eachIngredient.appendChild(newIngredientQuantity);

        // APPENDS THE UNIT FOR EACH INGREDIENT
        const newIngredientUnit = document.createElement('span');
        newIngredientUnit.textContent = `${element.measurements[0].unit.display_singular} `;
        newIngredientUnit.className = "new-ingredient";
        eachIngredient.appendChild(newIngredientUnit);

        // APPENDS THE NAME OF THE INGREDIENT
        const newIngredientName = document.createElement('span');
        newIngredientName.textContent = `${element.ingredient.name}`;
        newIngredientName.className = "new-ingredient";
        eachIngredient.appendChild(newIngredientName);

        // APENDS A BREAK LINE AT THE END OF EACH INGREDIENT
        const newLine = document.createElement('br');
        newLine.className = 'ingredients-br';
        eachIngredient.appendChild(newLine);
    })

    // ITERATES OVER THE INSTRUCTIONS ARRAY
    instructionsArray.forEach(instruction=>{
        // APENDS EACH ONE OF THE INSTRUCTIONS
        const newInstruction = document.createElement('p');
        newInstruction.textContent = instruction.display_text;
        newInstruction.className = "instruction-text";
        preparationContainer.appendChild(newInstruction);
        const newLineInstructions = document.createElement('br');
        newLineInstructions.className = 'instructions-br';
        preparationContainer.appendChild(newLineInstructions);
    })

    recipeTitle.textContent = recipeDetails.name;
    recipeImage.src = recipeDetails.thumbnail_url;
    recipeImage.alt = recipeDetails.name;
}



// // WRITES THE INFORMATION TO THE DOM
function writeRecipes(totalRecipes, extractedId,  extractedDishImage,extractedNameOfDish, extractedCookingTime, extractedDescription , extractedYield){
    // CREATES THE CONTAINER FOR EACH RECIPE AND ASSIGNS IT A CLASS
    const newRecipe = document.createElement('div');
    newRecipe.className = "new-recipe-container";
    const allRecipesContainer = document.querySelector('.results-container');
    allRecipesContainer.appendChild(newRecipe);
    const overlayContainer = document.querySelector('.overlay');
    let ingredientsContainer = document.querySelector('.each-ingredient');
    const preparationContainer = document.querySelector('.preparation-text');
    const closingButton = document.querySelector('.close-button');
    const bodyElement = document.querySelector('.body-wrapper');

    // WHEN ANY RECIPE RESULT IS CLICKED IT SHOWS THE OVERLAY WITH THE RECIPE DETAILS
    newRecipe.addEventListener('click', ()=>{
        const recipeDetailsRequest = {
            method: 'GET',
            url: 'https://tasty.p.rapidapi.com/recipes/detail',
            params: {id: extractedId},
            headers: {
              'x-rapidapi-key': '22ed3ce2f2msh965dd43e2495ebdp1b92c8jsn734b75c346c8',
              'x-rapidapi-host': 'tasty.p.rapidapi.com'
            }
          };
          axios.request(recipeDetailsRequest).then(function (recipeResponse) {
              const recipeDetails = recipeResponse.data;
              writeRecipeDetails(recipeDetails);
              
          }).catch(function (error) {
              console.error("There is something wrong with the recipe details " + error);
          });
            
            bodyElement.classList.add('body-scroll-hide');
            overlayContainer.hidden = false;
    })

    // DETECTS A CLICK AND CLOSES THE OVERLAY
    closingButton.onclick = ()=>{
        // DELETES ALL THE CONTENT IN THE INGREDIENTS CONTAINER
        // allIngredients.forEach(ingredient=>{
        //     ingredientsContainer.removeChild(ingredient);
        // });
        // ingredientsBr.forEach(breakingLineIngredients=>{
        //     ingredientsContainer.removeChild(breakingLineIngredients);
        // });
        ingredientsContainer.innerHTML = '';
        // DELETES ALL THE CONTENT IN THE PREPARATION CONTAINER
        // allPreparation.forEach(instruction=>{
        //     preparationContainer.removeChild(instruction);
        // });
        // instructionsBr.forEach(breakingLineInstructions=>{
        //     preparationContainer.removeChild(breakingLineInstructions);
        // });
        preparationContainer.innerHTML = '';
        overlayContainer.hidden = true;
        bodyElement.classList.remove('body-scroll-hide');
    }

     // CREATES AN IMAGE FOR EACH RECIPE AND ASSIGNS IT A CLASS
     if(extractedDishImage !== null){
        const recipeImage = document.createElement('img');
        recipeImage.src = `${extractedDishImage}`;
        recipeImage.className = 'new-recipe-image';
        newRecipe.appendChild(recipeImage);
        recipeImage.addEventListener('load', recipeLoaded(totalRecipes));
     }else{
        extractedDishImage.className = "new-recipe-hidden";
     }
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


// ITERATES OVER THE RESULTS EXTRACTING 20 RECIPES AT THE TIME
let displayedRecipes = 0
let recipesCount = 20;
function extractRecipes(recipes, totalRecipes){
let recipesLeft = totalRecipes - displayedRecipes;
    if (recipesLeft < 20){
        recipesCount = recipesLeft;
    }
    if(displayedRecipes<totalRecipes){
    // ITERATES OVER THE OBJECT EXTRACTING THE DATA
        for(let i=0; i<recipesCount; i++){
            const extractedId = recipes.results[i].id;
            let extractedDishImage;
            if(recipes.results[i].thumbnail_url){
                extractedDishImage =  recipes.results[i].thumbnail_url;
            }else{
                extractedDishImage = null;
            }
            const extractedNameOfDish = recipes.results[i].name;    
            let extractedCookingTime;
            if (recipes.results[i].hasOwnProperty('total_time_tier')){
                extractedCookingTime = recipes.results[i].total_time_tier.display_tier;
            }else{
                extractedCookingTime = null;
            }
            const extractedDescription = recipes.results[i].description;
            const extractedYield = recipes.results[i].yields;
            displayedRecipes = displayedRecipes + 1;
            writeRecipes(totalRecipes, extractedId, extractedDishImage, extractedNameOfDish, extractedCookingTime, extractedDescription , extractedYield);
        }
    }
}


//CHECKS IF IS THE FIRST SEARCH. IF NOT, ELIMINATES THE PREVIOUS CONTENT
function newContent(numberOfSearch){
    if(numberOfSearch < 1){
        getRecipes();
    }else{
        const allRecipesContainer = document.querySelector('.results-container');
        const newRecipe = document.querySelectorAll('.new-recipe-container');
        newRecipe.forEach(element => {
            allRecipesContainer.removeChild(element);
        });
        getRecipes();
    }
}


// REQUESTS RECIPES
function getRecipes(recipeOriginList){
    const requestedRecipe = document.querySelector('.requested-recipe');
    const recipeToSearch = requestedRecipe.value;
    const recipes = {
        method: 'GET',
        url: 'https://tasty.p.rapidapi.com/recipes/list',
        params:  {from: recipeOriginList, size: '20', tags: 'under_30_minutes', q:`'${recipeToSearch}'`},
        headers: {
          'x-rapidapi-key': '22ed3ce2f2msh965dd43e2495ebdp1b92c8jsn734b75c346c8',
          'x-rapidapi-host': 'tasty.p.rapidapi.com'
        }
    };
    console.log(recipeToSearch)
    axios.request(recipes).then(function (response) {
        const recipes = response.data;
        console.log(recipes);
        const totalRecipes = recipes.count;
        extractRecipes(recipes, totalRecipes);
        waitForMoreRecipes();
    }).catch(function (error) {
        console.error(`There's something wrong, ${error}`);
    });
}
// CHECKS IF THE SCROLL IS GETTING TO THE END OF THE RESULTS AND REQUESTS MORE
let recipeOriginList = 0;
function waitForMoreRecipes(){
    window.addEventListener('scroll', ()=> {
        if(window.innerHeight + window.scrollY >= document.body.offsetHeight - 10 && ready){
            ready = false;
            recipeOriginList = recipeOriginList + 20;
            loadingSvg.hidden = false;
            getRecipes(recipeOriginList);
        }
    });
}

// DETECTS A CLICK AND EXECUTES THE FUNCTION THAT CHECKS IF IT IS THE FIRST SEARCH
const requestButton = document.querySelector('.button-recipe');
let numberOfSearch = 0;
requestButton.addEventListener('click', ()=>{
    newContent(numberOfSearch);
    numberOfSearch++;
});
// DETECTS AN ENTER AND EXECUTES THE FUNCTION THAT CHECKS IF IT IS THE FIRST SEARCH
const inputSearch = document.querySelector('.requested-recipe');
inputSearch.addEventListener('keyup', (pressed)=>{
    if(pressed.key === "Enter"){
        newContent(numberOfSearch);
        numberOfSearch++;
    }
})





