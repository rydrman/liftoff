var World = function()
{
    this.width;
    this.height;
    
    this.planets = [];
}

World.prototype.init = function( width, height ) 
{
    this.width = width;
    this.height = height;
    
    this.bounds = new Rectangle(0, 0, width, height);
}

World.prototype.sample = function( worldPos )
{
    //TODO parse other options
    for (var i=0; i < this.planets.length; i++) {
        // general distance check
        if (worldPos.clone().sub(this.planets[i].position).length() < this.planets[i].radius + 1)
            for (var j=0; j < this.planets[i].items.length; j++) {
                var item = this.planets[i].items[j];
                if (worldPos.clone().sub(this.planets[i].position.clone().add(item.position)).length() < (item.image.width/2)/(50*2.5)) { // TODO: Fix pixel ratio - don't hardcode
                    return {
                        index: j,
                        planetIndex: i,
                        objectData: item
                    }
                }
            }
    }
    
    return null; // debug
    
    return {
        position: worldPos
    };
}
