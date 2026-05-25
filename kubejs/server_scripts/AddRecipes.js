ServerEvents.recipes(event => {
  
  event.shapeless(
  Item.of('biomeswevegone:white_dacite', 4),
  [
    '2x minecraft:andesite',
    '2x minecraft:quartz'     
  ]
)
event.custom({
  type: recipeType['deploying'],
    results: [
        {id: "minecraft:echo_shard"}

    ], 
    ingredients: [
        {tag: "c:gems/amethyst"}, 
        {item: "minecraft:sculk"}
    ]
})
  let energisingRecipesMap = new Map();
  mapType(event,recipeType['energising'],energisingRecipesMap);
  let chargingRecipesMap = new Map();
  mapType(event,recipeType['charging'],chargingRecipesMap);


  event.forEachRecipe({ type: recipeType['charging'] }, recipe => {
    chargingToEnergising(event, recipe, energisingRecipesMap);
  });

    event.forEachRecipe({ type: recipeType['energising'] }, recipe => {
    energisingToCharging(event, recipe, chargingRecipesMap);
  });
  

});