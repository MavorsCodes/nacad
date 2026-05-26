ServerEvents.recipes(event => {
  let energisingRecipesMap = new Map();
  mapType(event,global.recipeTypes['energising'],energisingRecipesMap);
  let chargingRecipesMap = new Map();
  mapType(event,global.recipeTypes['charging'],chargingRecipesMap);


  event.forEachRecipe({ type: global.recipeTypes['charging'] }, recipe => {
    chargingToEnergising(event, recipe, energisingRecipesMap);
  });

    event.forEachRecipe({ type: global.recipeTypes['energising'] }, recipe => {
    energisingToCharging(event, recipe, chargingRecipesMap);
  });
  

});
