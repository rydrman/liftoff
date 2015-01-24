var Generator = function()
{
    //this.universeSize = new Vector2().copy(Settings.worldSize);
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
                x: Math.random() * Settings.worldSize.xx,
                y: Settings.worldSize.y - 10
            },
            radius: Math.random() * 10
        };
        var planet = new Planet( options );
        world.planets.push( planet );
    }
    
    return world;
}