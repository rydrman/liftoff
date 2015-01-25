var Player = function() {
    this.position = new Vector2();
    this.rotation = 0;
    this.speed = 1.2; // units per second - 1 unit = 50px;
    this.force = new Vector2();
    
    this.goal = new Vector2();
    
    this.inShip = true;
    
    // Variables
    this.oxygen = 100;
    this.comfort = 100;
    
    // Equipment
    
    
    // Inventory
    this.inventory = {}; // "name" : quantity
    this.inventorySize = 5;
}

Player.prototype.init = function(timer) {
    // start variable ticks
    this.timer = timer;
    this.timer.startSubTick("comfortTick");
    this.timer.startSubTick("oxygenTick");
}

Player.prototype.updateMovement = function(timer) {
    if( !this.position.compare( this.goal ) ) {
        var offset = this.goal.clone().sub( this.position);
        if (offset.length() < 0.05) {
            this.position.copy(this.goal);
        } else {
            offset.normalize();
            offset.add(this.force);
            offset.multiplyScalar(this.speed * timer.deltaTimeS);
            this.position.add( offset );
            this.rotation = (this.landing) ? offset.toRotation() + Math.PI : offset.toRotation();
        }
    } else if (this.force.length() > 0) {
        this.position.add(this.force);
        this.goal.copy(this.position);
    }
}

Player.prototype.update = function( timer ) {
    this.updateMovement(timer);
    
    // tick variables
    this.timer.endSubTick("oxygenTick");
    if (this.timer.subTicks["oxygenTick"].deltaS > 1) {
        this.oxygen = (this.inShip) ? Math.min(this.oxygen + 1, 100) : Math.max(this.oxygen - 1, 0);
        this.timer.startSubTick("oxygenTick");
    }
    this.timer.endSubTick("comfortTick");
    if (this.timer.subTicks["comfortTick"].deltaS > 3) {
        this.comfort = (this.inShip) ? Math.max(this.comfort - 1, 0) : Math.min(this.oxygen + 1, 100);
        this.timer.startSubTick("comfortTick");
    }
}

Player.prototype.toggleShipStatus = function(ship) {
    this.inShip = !this.inShip;
    this.goal.copy(ship.position)
    this.position.copy(ship.position);
    this.timer.startSubTick("oxygenTick");
    this.timer.startSubTick("comfortTick");
}

Player.prototype.addToInventory = function(objToAdd) {
    var index = -1;
    
    for (i in this.inventory) {
        if (i == objToAdd.name) {
            index = i;
        }
    }
    
    if (index !== -1) {
        this.inventory[index] ++;
        return true;
    } else if (Object.keys(this.inventory).length < this.inventorySize) {
        this.inventory[objToAdd.name] = 1;
        return true;
    } else {
        // Error message to user that inventory is full
        return false;
    }
}

Player.prototype.wrapValues = function( bounds )
{
    //position
    this.position.x = wrap( this.position.x, bounds.x, bounds.x + bounds.w );
    this.position.y = wrap( this.position.y, bounds.y, bounds.y + bounds.h );
    
    //goal
    this.goal.x = wrap( this.goal.x, bounds.x, bounds.x + bounds.w );
    this.goal.y = wrap( this.goal.y, bounds.y, bounds.y + bounds.h );
}