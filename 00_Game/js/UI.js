var UI = function(canvas) 
{
   AsyncLoadable.call(this);
    
    this.shipOpen = true;
    
    //placements
    this.shipMenu = {
        //cockpit
        cockpit : new Rectangle( 224 / 1920, 50 / 1080, 147 / 1920, 153 / 1080),
        //engineering
        engineering : new Rectangle( 224 / 1920, 210 / 1080, 147 / 1920, 153 / 1080),
        //science
        science : new Rectangle( 224 / 1920, 367 / 1080, 147 / 1920, 153 / 1080),
        //cargo
        cargo : new Rectangle( 224 / 1920, 524 / 1080, 147 / 1920, 153 / 1080),
        //engine
        engine: new Rectangle( 224 / 1920, 680 / 1080, 147 / 1920, 153 / 1080)
    }
    
    //imgaes
    this.backSquareImg = new Image();
    
    this.loaded = false;
}

UI.prototype = new AsyncLoadable();

UI.prototype.load = function()
{
    var self = this;
    var loader = new AsyncLoader();
    loader.onComplete = function(){
        this.loaded = true;
        this.onLoad.call(this.onLoadContext);
    };
    loader.onCompleteContext = this;
    
    loader.addImageCall('assets/menu/menu_item_bg_sm.png', this.backSquareImg);
    
    loader.runCalls();
}

UI.prototype.init = function(canvas, player, ship) 
{
}

UI.prototype.sample = function( mousePosCanvas )
{
    var relativePos = new Vector2( mousePosCanvas.x / Settings.renderWidth,
                                   mousePosCanvas.y / Settings.renderHeight );
    
    this.shipOpen = false;
    this.currentShip = null;
    return false;
    
}

UI.prototype.openShip = function( ship )
{
    this.shipOpen = true;
    this.currentShip = ship;
}

UI.prototype.resize = function(width, height) 
{
    this.playerInventory = new Rectangle(200, height - 70, 400, 70);
    
}