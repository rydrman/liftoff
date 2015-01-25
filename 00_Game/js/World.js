var World = function()
{
    this.width;
    this.height;
    
    this.ships = [];
    
    this.items = [];
    
    this.planets = [];
}

World.prototype.init = function( width, height ) 
{
    this.width = width;
    this.height = height;
    
    this.bounds = new Rectangle(0, 0, width, height);
}

World.prototype.getInitialPlanet = function()
{
    return this.planets[0];
}

World.prototype.update = function( timer )
{
    var s;
    for(var i in this.ships)
    {
        s = this.ships[i];
        // Check collisions between ship and planets
        if (!s.landed) 
        {
            s.update(timer);
            
            s.force = this.getGravity( s.position );
            
            var p;
            //collide ship with planets
            for (var j in this.planets) 
            {
                p = this.planets[j];
                var distance = p.position.clone().sub(s.position).length();
                if (distance < p.radius + 0.5) 
                { // TODO: Change to fit ship size
                    s.landed = true;
                    if (s.landing) {
                        console.log("Successful Landing!");
                    } 
                    else 
                    {
                        console.log("CRASH");
                        s.takeDamage(40); // TODO - MAKE NOT HARDCODE
                    }
                } 
            }
        }
    }
}

World.prototype.getGravity = function( position )
{
    var p, dist, force = new Vector2();
    for(var i in this.planets)
    {
        p = this.planets[i];
        var distanceSq = p.position.clone().sub(position).lengthSqd();
        if (distanceSq < Math.pow(10 + p.radius, 2)) 
        {
            // add gravity force to the movement
            var gravity = p.position.clone().sub(position).normalize().multiplyScalar(0.1); // FIXME this in an arbitrary number
            //map gravity scale based on distance
            var gravityScale =  map( distanceSq, Math.pow(p.radius, 2), Math.pow(p.radius + 10, 2), 1, 0);
            gravityScale = clamp(gravityScale, 0, 1);
            gravity.multiplyScalar( gravityScale );

            force.add(gravity);
        }
    }
    return force;
}

World.prototype.getClosestPlanet = function( position )
{
    var minDistSq = Number.MAX_VALUE,
        planet,
        p, distSq;
    for(var i in this.planets)
    {
        p = this.planets[i];
        var distSq = p.position.clone().sub(position).lengthSqd();
        if (distSq < minDistSq) 
        {
            minDistSq = distSq;
            planet = p;
        }
    }
    
    return {
        planet: planet,
        distance: Math.sqrt( minDistSq )
    };
}

World.prototype.sample = function( worldPos )
{
    //check ship
    for(var i in this.ships)
    {
        if(this.ships[i].isInBounds( worldPos ) )
           return this.ships[i];
    }
    
    
    //TODO parse other options
    for (var i=0; i < this.planets.length; i++) 
    {
        // general distance check
        if (worldPos.clone().sub(this.planets[i].position).length() < this.planets[i].radius + 1)
        {
            //clicked planet
            for (var j=0; j < this.planets[i].items.length; j++) 
            {
                var item = this.planets[i].items[j];
                if (worldPos.clone().sub(this.planets[i].position.clone().add(item.position)).length() < (item.image.width/2)/(50*2.5)) { // TODO: Fix pixel ratio - don't hardcode
                    //clicked item return
                    return {
                        index: j,
                        planetIndex: i,
                        objectData: item
                    }
                }
            }
            //no object, return planet
            return this.planets[i];
        }
    }
    
    return null; // debug
    
    return {
        position: worldPos
    };
}
