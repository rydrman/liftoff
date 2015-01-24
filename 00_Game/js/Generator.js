var Generator = function()
{
    this.universeSize = new Vector2( 100, 100 );
}

Generator.prototype.generate = function()
{
    var width = Settings.worldSize,
        height= Settings.worldSize;
    var world = new World();
    
    world.init( width, height );
    
    for(var i = 0; i < 10; ++i)
    {
        var options = {
            position: {
                x: Math.random() * this.universeSize.x,
                y: Math.random() * this.universeSize.y
            },
            radius: Math.random() * 10
        };
        var planet = new Planet( options );
        world.planets.push( planet );
    }
    
    return world;
}