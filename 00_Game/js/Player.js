var Player = function() {
    this.position = new Vector2();
    this.speed = 2; // units per second - 1 unit = 50px;
    this.force = new Vector2();
    
    this.goal = new Vector2();
    
    this.inShip = true;
    
    // Variables
    this.oxygen = 90;
    this.comfort = 100;
    
    // Equipment
    
    
    // Inventory
    this.inventory = [null, null, null, null, null];
}

Player.prototype.init = function() {
    
}

Player.prototype.update = function( timer ) {
    if( !this.position.compare( this.goal ) ) {
        var offset = this.goal.clone().sub( this.position);
        if (offset.length() < 0.05) {
            this.position.copy(this.goal);
        } else {
            offset.normalize();
            offset.add(this.force);
            offset.multiplyScalar(this.speed * timer.deltaTimeS);
            this.position.add( offset );
        }
    } else if (this.force.length() > 0) {
        this.position.add(this.force);
        this.goal.copy(this.position);
    }
}

Player.prototype.toggleShipStatus = function(ship) {
    this.inShip = !this.inShip;
    this.goal.copy(ship.position)
    this.position.copy(ship.position);
}

Player.prototype.addToInventory = function(objToAdd) {
    for (i=0; i < this.inventory.length; i++) {
        if (this.inventory[i] == null) {
            // Add object to inventory
            // TODO
        } else {
            // Error message to user that inventory is full
        }
    }
}