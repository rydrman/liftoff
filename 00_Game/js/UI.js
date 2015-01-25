var UI = function(canvas) 
{
   AsyncLoadable.call(this);
    
    this.shipOpen = true;
    this.craftOpen = true;
    
    //placements
    this.shipMenu = {
        //cockpit
        cockpit : new Rectangle( 50 / 1920, 50 / 1080, 147 / 1920, 153 / 1080),
        //engineering
        engineering : new Rectangle( 50 / 1920, 210 / 1080, 147 / 1920, 153 / 1080),
        //science
        science : new Rectangle( 50 / 1920, 367 / 1080, 147 / 1920, 153 / 1080),
        //cargo
        cargo : new Rectangle( 50 / 1920, 524 / 1080, 147 / 1920, 153 / 1080),
        //engine
        engine: new Rectangle( 50 / 1920, 680 / 1080, 147 / 1920, 153 / 1080)
    }
    
    this.addonMenu = {
        //cockpit
        cockpit : new Rectangle( 246 / 1920, 50 / 1080, 330 / 1920, 150 / 1080),
        //engineering
        engineering : new Rectangle( 246 / 1920, 210 / 1080, 330 / 1920, 150 / 1080),
        //science
        science : new Rectangle( 246 / 1920, 367 / 1080, 330 / 1920, 150 / 1080),
        //cargo
        cargo : new Rectangle( 246 / 1920, 524 / 1080, 330 / 1920, 150 / 1080),
        //engine
        engine: new Rectangle( 246 / 1920, 680 / 1080, 330 / 1920, 150 / 1080)
    }
    
    this.craftingMenu = {
        background: new Rectangle( 835 / 1920, 50 / 1080, 1035 / 1920, 791 / 1080),
        topRow: {
            cockpit : new Rectangle( 795 / 1920, 75 / 1080, 147 / 1920, 153 / 1080),
            engineering : new Rectangle( 955 / 1920, 75 / 1080, 147 / 1920, 153 / 1080),
            science : new Rectangle( 1115 / 1920, 75 / 1080, 147 / 1920, 153 / 1080),
            cargo : new Rectangle( 1275 / 1920, 75 / 1080, 147 / 1920, 153 / 1080),
            engine: new Rectangle( 1435 / 1920, 75 / 1080, 147 / 1920, 153 / 1080)
        }
    };
    
    //imgaes
    this.backSquareImg = new Image();
    this.backAddonImg = new Image();
    this.craftBackImg = new Image();
    
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
    loader.addImageCall('assets/menu/menu_item_bg_lg.png', this.backAddonImg);
    loader.addImageCall('assets/menu/menu_window.png', this.craftBackImg);
    
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
    this.craftOpen = false;
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