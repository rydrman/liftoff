var UI = function(canvas) {

}

UI.prototype.init = function(canvas, player, ship) {
    this.canvas = canvas
    for (var i=0; i < player.inventory.length; i++) {
        
    }
}

UI.prototype.resize = function(width, height) {
    this.playerInventory = new Rectangle(200, height - 70, 400, 70);
    
}

UI.prototype.sample = function(worldPos) {
    if (this.playerInventory.contains(worldPos)) {
        return { name: "Inventory" }
    }
    
    return null;
}