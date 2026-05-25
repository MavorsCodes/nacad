//NACAD package

/*
MIT License

Copyright (c) 2026 MavorsCodes

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

const RecipeTypes = {
  'charging': 'createaddition:charging',
  'energising': 'create_new_age:energising',
  'deploying': 'create:deploying'
};

// Helper Normalize JSON 
function normalize(jsonArrayString) {
  if (!jsonArrayString) return "[]"; // Guard against empty inputs
  try {
    return JSON.stringify(JSON.parse(jsonArrayString));
  } catch (e) {
    console.error("NACAD: Failed to normalize input: " + jsonArrayString);
    return "[]";
  }
}

/**
 * Populates a Map object with all inputs and outputs of a specific recipe type.
 * * @param {object} event - The recipe event passed down from the server.
 * @param {string} sourceType - The string identifier of the recipe type we want to map.
 * @param {Map} inputMap - The empty Map variable to store the data into.
 * @returns {void}
 */
function mapType(event,sourceType,inputMap){
  event.forEachRecipe({ type: sourceType }, recipe => {

      let inputString = normalize(recipe.json.get('ingredients').toString());
      
      if (!inputMap.has(inputString)) {
        inputMap.set(inputString, true);
      }
      
    });
}

/**
 * Evaluates whether a recipe can be safely converted without creating an input conflict.
 * * @param {object} recipe - The recipe being evaluated.
 * @param {Map} inputMap - A map of the target recipe type generated via mapType().
 * @returns {boolean} True if the recipe does NOT overlap in inputs with any recipe in the target map.
 */
function canConvert(recipe,inputMap){
let inputString = normalize(recipe.json.get('ingredients').toString());
  if (inputMap.has(inputString)) {
    return false; 
  }
  
  return true;
}

/**
 * Converts a 'createaddition:charging' recipe into a 'create_new_age:energising' recipe.
 * * @param {object} event - The recipe event passed down from the server.
 * @param {object} recipe - The full recipe object being evaluated.
 * @param {Map} inputMap - A map of the target recipe type generated via mapType().
 * @param {boolean} [doConversionCheck=true] - If true, verifies no crafting conflict exists before registering.
 * @returns {void}
 */
function chargingToEnergising (event, recipe,inputMap,doConversionCheck){
  if (doConversionCheck === undefined) {
    doConversionCheck = true;
  }

  if (doConversionCheck && !canConvert(recipe, inputMap)) {
    console.log(`[chargingToEnergising] Skipping conflicting recipe translation for: ${recipe.getId()}`);
    return;
  }

  let recipeJson = recipe.json;
  let energy = recipeJson.get('energy').getAsInt();
  let inputs = recipeJson.get('ingredients'); 
  let outputs = recipeJson.get('results');

  event.custom({
    type: recipeType['energising'],
    energy_needed: energy,
    ingredients: inputs,
    results: outputs
  });
}

/**
 * Converts a 'create_new_age:energising' recipe into a 'createaddition:charging' recipe.
 * * @param {object} event - The recipe event passed down from the server.
 * @param {object} recipe - The full recipe object being evaluated.
 * @param {Map} inputMap - A map of the target recipe type generated via mapType().
 * @param {boolean} [doConversionCheck=true] - If true, verifies no crafting conflict exists before registering.
 * @returns {void}
 */
function energisingToCharging(event, recipe, inputMap, doConversionCheck) {
  if (doConversionCheck === undefined) {
    doConversionCheck = true;
  }
  if (doConversionCheck && !canConvert(recipe, inputMap)) {
    console.log(`[energisingToCharging] Skipping conflicting recipe translation for: ${recipe.getId()}`);
    return;
  }

  let recipeJson = recipe.json;
  event.custom({
    type: recipeType['charging'],
    energy: recipeJson.get('energy_needed').getAsInt(),
    ingredients: recipeJson.get('ingredients'),
    max_charge_rate: 360,
    results: recipeJson.get('results')
  });
}

/*
MIT License

Copyright (c) 2026 MavorsCodes

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/