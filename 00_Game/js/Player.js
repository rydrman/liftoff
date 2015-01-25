var Player = function() {
    this.position = new Vector2();
    this.rotation = 0;
    this.speed = 1.2; // units per second - 1 unit = 50px;
    this.force = new Vector2();
    
    this.goal = new Vector2();
    
    this.inShip = false;
    this.ship = null;
    
    this.planet == null;
    
    // Variables
    this.oxygen = 100;
    this.comfort = 100;
    
    // Equipment
    
    
    // Inventory
    this.inventory = {}; // "name" : {quantity, image}
    this.inventorySize = 4;
    
    this.image = new Image();
    
    var self = this;
    var loader = new AsyncLoader();
    loader.onComplete = EMPTY_FUNCTION;
    
    loader.addImageCall("assets/sprites/playerPose.png", this.image, function(){self.imageDone()});
    loader.runCalls();
    
    this.renderScale = 0.25;
    
    this.bounds = new Rectangle();
}
                        
Player.prototype.imageDone = function()
{
    if(engine.renderer)
    {
        this.bounds.x = engine.renderer.pixelToWorld( -this.image.width * 0.5 );
        this.bounds.y = engine.renderer.pixelToWorld( -this.image.height * 0.5 );
        this.bounds.w = engine.renderer.pixelToWorld( this.image.width );
        this.bounds.h = engine.renderer.pixelToWorld( this.image.height );
    }
}

Player.prototype.init = function(timer) {
    // start variable ticks
    this.timer = timer;
    this.timer.startSubTick("comfortTick");
    this.timer.startSubTick("oxygenTick");
    
    if(this.image.complete)
    {
        this.bounds.x = engine.renderer.pixelToWorld( -this.image.width * 0.5 );
        this.bounds.y = engine.renderer.pixelToWorld( -this.image.height * 0.5 );
        this.bounds.w = engine.renderer.pixelToWorld( this.image.width );
        this.bounds.h = engine.renderer.pixelToWorld( this.image.height );
    }
}

Player.prototype.isInBounds = function( worldPos )
{
    
    //get offset
    var offset = new Vector2().subVectors( this.position, worldPos );
    
    //convert to local space
    var rot = offset.toRotation();
    rot -= this.rotation;// - Math.PI * 0.5;
    offset.fromRotation( rot, offset.length() / this.renderScale );
    
    if(this.bounds && this.bounds.contains( offset ))
    {
        return true;
    }    
    return false;
}

Player.prototype.updateMovement = function(timer) 
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
        if (offset.length() < 0.1) 
        {
            this.position.copy(this.goal);
        } 
        else 
        {
            offset.normalize();
            offset.add(this.force);
            offset.multiplyScalar(this.speed * timer.deltaTimeS);
            this.position.add( offset );
            this.rotation = (this.landing) ? offset.toRotation() : offset.toRotation();
        }
    } 
    else if (this.force.length() > 0) 
    {
        this.position.add(this.force);
        this.goal.copy(this.position);
    }
    this.force.set(0, 0);
    
    //position on planet
    if(null != this.planet)
    {
        //this.position.copy(this.planet.position);
        var offset = this.position.clone().sub(this.planet.position);
        this.planetPosition = offset.toRotation();
        this.rotation = this.planetPosition - Math.PI;
    }
    else
    {
        //this.position.copy(this.planet.position);
        var offset = this.goal.clone().sub(this.position);
        this.rotation = offset.toRotation();
    }
}

Player.prototype.update = function( timer ) {
    this.updateMovement(timer);
    
    // tick variables
    this.timer.endSubTick("oxygenTick");
    if (this.timer.subTicks["oxygenTick"].deltaS > 1) 
    {
        if(this.planet == null || !this.planet.atmosphere)
        {
            // TODO - if damage is below 10%, oxygen leaks
            var rate = (this.inShip) ? ((this.ship.fuel == 0) ? -2 : 1) : -1;
            this.oxygen = this.oxygen + rate;
            // TODO - if Oxygen 0 -game ends - here or in update?
            this.timer.startSubTick("oxygenTick");
        }
    }
    this.timer.endSubTick("comfortTick");
    if (this.timer.subTicks["comfortTick"].deltaS > 3) {
        this.comfort = (this.inShip) ? Math.max(this.comfort - 1, 0) : Math.min(this.comfort + 1, 100);
        this.timer.startSubTick("comfortTick");
    }
}

Player.prototype.toggleShipStatus = function(ship) {
    this.inShip = !this.inShip;
    this.ship = (this.inShip) ? ship : null;
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
        this.inventory[index].quantity ++;
        return true;
    } else if (Object.keys(this.inventory).length < this.inventorySize) {
        this.inventory[objToAdd.name] = objToAdd;
        return true;
    } else {
        // Error message to user that inventory is full
        return false;
    }
}

Player.prototype.getInventoryByIndex = function(index) {
    var ind = 0;
    for (var i in this.inventory) {
        if (index == ind) {
            return this.inventory[i];
       }
        ind ++;
    }
    return null;
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