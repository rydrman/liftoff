var Generator = function()
{
}

Generator.prototype.generate = function()
{
    var width = Settings.worldSize,
        height= Settings.worldSize;
    var world = new World();
    
    world.init( width, height );
    
    return world;
}