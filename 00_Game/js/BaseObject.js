var BaseObject = function( item ) 
{
    this.name = item.name;
    this.image = new Image();
    
    var self = this;
    
    var loader = new AsyncLoader()
    loader.addImageCall( item.img, this.image );
    loader.runCalls();
    
    //to know where it is
    //and how to draw it
    this.planet = null;
    this.planetPosition = 0;
    this.position = new Vector2();
    this.rotation = 0;
    
    
}
BaseObject.prototype.init = function() 
{
    
}