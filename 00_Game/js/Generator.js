var Generator = function()
{
    //this.universeSize = new Vector2().copy(Settings.worldSize);
}

Generator.prototype.generate = function()
{
    var width = Settings.worldSize.x,
        height= Settings.worldSize.y;
    var world = new World();
    
    world.init( width, height );
    
    for(var i = 0; i < 100; ++i)
    {
        var rad = 1 + Math.random() * 5,
            position = new Vector2(
                rad + Math.random() * (Settings.worldSize.x - rad*2),
                rad + Math.random() * (Settings.worldSize.y - rad*2)
            ),
            distSq;
        
        //find a position
        var tries = 0,
            accepted = false;
        while(accepted == false && tries < 1000)
        {
            accepted = true;
            for(var j in world.planets)
            {
                distSq = new Vector2().subVectors(position, world.planets[j].position).lengthSqd();
                if(distSq < Math.pow(rad + world.planets[j].radius, 2) )
                {
                    accepted = false;
                    break;
                }
            }
            if(!accepted)
            {
                position.set(
                    rad + Math.random() * (Settings.worldSize.x - rad*2),
                    rad + Math.random() * (Settings.worldSize.y - rad*2)
                );
            }
            tries++;
        }
        
        if(tries >= 1000) 
        {
            console.warn("Planet generation impossible, no acceptable position found");
            continue;
        }
        
        var planet = new Planet( {position: position, radius: rad} );
        world.planets.push( planet );
    }
    
    return world;
}