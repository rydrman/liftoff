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
    
    this.playerShipStats = {
        damage: new Rectangle( 1670 / 1920, 843 / 1080, 92 / 1920, 92 / 1080),
        oxygen: new Rectangle( 1800 / 1920, 843 / 1080, 92 / 1920, 92 / 1080),
        fuel: new Rectangle( 1670 / 1920, 956 / 1080, 92 / 1920, 92 / 1080),
        comfort: new Rectangle( 1800 / 1920, 956 / 1080, 92 / 1920, 92 / 1080),
    }
    
    //imgaes
    this.backSquareImg = new Image();
    this.backAddonImg = new Image();
    this.craftBackImg = new Image();
    
    this.statDamageEmptyImg = new Image();
    this.statDamageFullImg = new Image();
    this.statComfortEmptyImg = new Image();
    this.statComfortFullImg = new Image();
    this.statFuelEmptyImg = new Image();
    this.statFuelFullImg = new Image();
    this.statHealthEmptyImg = new Image();
    this.statHealthFullImg = new Image();
    
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
    
    // Player stats
    loader.addImageCall('assets/icons/armour.png', this.statDamageEmptyImg);
    loader.addImageCall('assets/icons/armour_full.png', this.statDamageFullImg);
    loader.addImageCall('assets/icons/comfort.png', this.statComfortEmptyImg);
    loader.addImageCall('assets/icons/comfort_full.png', this.statComfortFullImg);
    loader.addImageCall('assets/icons/fuel.png', this.statFuelEmptyImg);
    loader.addImageCall('assets/icons/fuel_full.png', this.statFuelFullImg);
    loader.addImageCall('assets/icons/health.png', this.statHealthEmptyImg);
    loader.addImageCall('assets/icons/health_full.png', this.statHealthFullImg);
    
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