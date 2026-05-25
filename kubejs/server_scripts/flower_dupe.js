const FORBIDDEN_TAGS = [
    'minecraft:saplings',
    'minecraft:crops',
    'c:saplings',
    'minecraft:leaves'
]

BlockEvents.rightClicked(event => {
    const { player, hand, item, block, level } = event;

    // Run completely on the server-side to prevent inventory sync issues
    if (level.isClientSide() || hand !== 'MAIN_HAND') return;

    // Check if the player is holding Bone Meal and clicking a flower
    if (item.id === 'minecraft:bone_meal' && block.hasTag('minecraft:flowers')) {
        
        // Loop through the forbidden list. If the block matches any of them, skip the script.
        for (let forbiddenTag of FORBIDDEN_TAGS) {
            if (block.hasTag(forbiddenTag)) return;
        }

        // 1. Duplicate the flower item dropped at the block
        block.popItem(block.id);
        
        // 2. Play particles directly in the exact center of the block
        player.server.runCommandSilent(`execute in ${level.dimension} positioned ${block.x} ${block.y} ${block.z} align xyz run particle minecraft:happy_villager ~0.5 ~0.5 ~0.5 0.3 0.3 0.3 0.1 15`);
        
        // 3. Play the sound aligned to the block center
        player.server.runCommandSilent(`execute in ${level.dimension} positioned ${block.x} ${block.y} ${block.z} align xyz run playsound minecraft:item.bone_meal.use block @a ~0.5 ~0.5 ~0.5 1.0 1.0`);

        // 4. Consume 1 bone meal safely
        if (!player.isCreative()) {
            item.setCount(item.getCount() - 1);
        }
        
        // 5. Visually swing the arm
        player.swing(hand, true);
        
        // Cancel vanilla behavior so the script overrides it completely
        event.cancel();
    }
});