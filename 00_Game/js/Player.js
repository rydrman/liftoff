var Player = function() {
    this.position = new Vector2();
    this.rotation = 0;
    this.speed = 1.2; // units per second - 1 unit = 50px;
    this.force = new Vector2();
    
    this.goal = new Vector2();
    
    this.inShip = false;
    this.ship = null;
    
    // Variables
    this.oxygen = 90;
    this.comfort = 100;
    
    // Equipment
    
    
    // Inventory
    this.inventory = {}; // "name" : quantity
}

Player.prototype.init = function() 
{
}

Player.prototype.update = function( timer ) 
{
    if(this.inShip)
    {
        this.position.copy( this.ship.position )
        this.force.set( 0, 0 );
        return;
    }
    if( !this.position.compare( this.goal ) ) 
    {
        var offset = this.goal.clone().sub( this.position);
        if (offset.length() < 0.05) 
        {
            this.position.copy(this.goal);
        } 
        else 
        {
            offset.normalize();
            offset.add(this.force);
            offset.multiplyScalar(this.speed * timer.deltaTimeS);
            this.position.add( offset );
            this.rotation = offset.toRotation();
        }
    } 
    else if (this.force.length() > 0) 
    {
        this.position.add(this.force);
        this.goal.copy(this.position);
    }
    this.force.set(0, 0);
}

Player.prototype.toggleShipStatus = function(ship) {
    this.inShip = !this.inShip;
    this.ship = ship ? ship : null;
    this.goal.copy(ship.position)
    this.position.copy(ship.position);
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
    } else if (Object.keys(this.inventory).length < 5) {
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