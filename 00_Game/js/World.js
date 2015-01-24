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
    return {
        position: worldPos
    };
}
