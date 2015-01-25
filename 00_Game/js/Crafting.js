var Crafting = function() {
    AsyncLoadable.call(this);
    
    this.recipes;
}

Crafting.prototype = new AsyncLoadable();

Crafting.prototype.load = function() {
    var loader = new AsyncLoader(),
        self = this;
    
    loader.onComplete = this.onLoad;
    loader.onCompleteContext = this.onLoadContext;
    
    loader.addJSONCall( 'json/recipes.json', function(data){
        self.recipes = data;
    });
}

Crafting.prototype.update = function(player, ship) {
    // Check player (and ship if applicable) inventories against craftable recipes
    
    // Construct aggregate inventory
    var inventory = this.constructInventory(player, ship);
    
    // Now check against recipes
    
    // TODO - check against ship crafting abilities
    var craftable = true,
        visible = false;
    if (ship.hasPiece(recipe.requiredPiece)) {
        visible = true;
        for (var r in this.recipes) {
            for (var ing in this.recipes[r].ingredients) {
                if (inventory.hasOwnProperty(ing)) {
                    // check quantity
                    if (inventory[ing] <= this.recipes[r].ingredients[ing])
                        craftable = false
                } else {
                    craftable = false; // we don't have any of the item
                }
            }
        }
    } else {
        craftable = false;
    }
    this.recipes[r].craftable = craftable;
    this.recipes[r].visible = visible;
}

Crafting.prototype.constructInventory = function(player, ship) {
    var inventory = player.inventory;
    
    if (ship !== undefined) {
        for (var i in ship.inventory) {
            if (inventory.hasOwnProperty(i))
                inventory[i] += ship.inventory[i];
            else
                inventory[i] = ship.inventory[i];
        }
    }
    return inventory;
}

Crafting.prototype.craft = function(player, ship, recipe, items) { // generator.items
    var inventory = this.constructInventory(player, ship);
    for (var i in recipe.ingredients) {
        var cost = recipe.ingredients[i];
        // Remove from player inventory then ship inventory if not enough
        cost = this.removeFromInventory(cost, i, player);
        
        if (cost > 0)
            cost = this.removeFromInventory(cost, i, ship);
        
        if (cost > 0) {
            console.log( "ERROR - CRAFTING DID NOT HAVE ENOUGH INGREDIENTS");
        }
    }
    // TODO After all ingredients have been removed, add to an inventory
    // TODO - check that there is inventory space BEFORE making the object?
    console.log("Crafted: " + recipe.result);
    var newItem;
    for (var i=0; i < items.length; i++) {
        if (items[i].name == recipe.result) {
            newItem = items[i];
            break;
        }
    }
    if (!player.addToInventory(newItem))
        ship.addToInventory(newItem);
}
 
Crafting.prototype.removeFromInventory = function(cost, resource, entity) {
    if (entity.inventory.hasOwnProperty[resource]) {
        if (entity.inventory[resource] > cost) {
            entity.inventory[resource] -= cost;
        } else if (entity.inventory[resource] <= cost) {
            cost -= entity.inventory[resource];
            delete entity.inventory[resource];
        }
    }
    return cost;
}