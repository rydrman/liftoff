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
            cockpit : new Rectangle( 945 / 1920, 75 / 1080, 147 / 1920, 153 / 1080),
            engineering : new Rectangle( 1105 / 1920, 75 / 1080, 147 / 1920, 153 / 1080),
            science : new Rectangle( 1265 / 1920, 75 / 1080, 147 / 1920, 153 / 1080),
            cargo : new Rectangle( 1425 / 1920, 75 / 1080, 147 / 1920, 153 / 1080),
            engine: new Rectangle( 1585 / 1920, 75 / 1080, 147 / 1920, 153 / 1080)
        },
        recipesArea: new Rectangle( 935 / 1920, 250 / 1080, 800 / 1920, 350 / 1080),
        recipeBlock: new Rectangle(0, 0, 75 / 1920, 75 / 1080 ),
        recipeBuffer: new Vector2(5 / 1920, 5 / 1080),
        
        detailArea: new Rectangle( 935 / 1920, 625 / 1080, 800 / 1920, 150 / 1080),
        detailIcon: new Rectangle( 935 / 1920, 625 / 1080, 150 / 1920, 150 / 1080),
        detailTitle: new Vector2( 1100 / 1920, 650 / 1080 ),
        detailFontSize: 20 / 1920,
        detailRequire: new Vector2( 1100 / 1920, 660 / 1080 ),
        
        buildButton: new Rectangle( 1575 / 1920, 675 / 1080, 145 / 1920, 60 / 1080)
    };
    
    //imgaes
    this.backAddonImg = new Image();
    
    this.craftBackImg = new Image();
    
    this.shipIcons = {
        cockpit : new Image(),
        engineering : new Image(),
        science : new Image(),
        cargo : new Image(),
        engine: new Image()
    }
    
    //menu varables
    this.craftSelection = null;
    this.recipeSelection = null;
    
    this.items = [];
    
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
    
    //loader.addImageCall('assets/menu/menu_item_bg_sm.png', this.backSquareImg);
    loader.addImageCall('assets/menu/menu_item_bg_lg.png', this.backAddonImg);
    
    loader.addImageCall('assets/menu/menu_window.png', this.craftBackImg);
    
    loader.addImageCall('assets/menu/uiCockpit.png', this.shipIcons.cockpit);
    loader.addImageCall('assets/menu/uiEngineering.png', this.shipIcons.engineering);
    loader.addImageCall('assets/menu/uiScience.png', this.shipIcons.science);
    loader.addImageCall('assets/menu/uiCargo.png', this.shipIcons.cargo);
    loader.addImageCall('assets/menu/uiEngine.png', this.shipIcons.engine);
    
    loader.addJSONCall('json/items.json', function(data){
        for(var i in data)
        {
            self.items[ data[i].name ] = data[i];
            self.items[ data[i].name ].image = new Image();
            self.items[ data[i].name ].image.src = data[i].img;
        }
    });
    
    loader.runCalls();
}

UI.prototype.init = function(crafting) 
{
    this.crafting = crafting;
}

UI.prototype.sample = function( mousePosCanvas, player )
{
    var relativePos = new Vector2( mousePosCanvas.x / Settings.renderWidth,
                                   mousePosCanvas.y / Settings.renderHeight );
    
    if(this.craftOpen)
    {
        //check top buttons
        for(var i in this.craftingMenu.topRow)
        {
            if(this.craftingMenu.topRow[i].contains(relativePos))
            {
                this.craftSelection = i;
                console.log("UI craft selection: " + i);
                this.recipeSelection = null;
                return true;
            }
        }
        
        //check recipes
        var recipes = this.getCraftingOptions();
        
        var curY = this.craftingMenu.recipesArea.y,
            curX = this.craftingMenu.recipesArea.x;
        for(var i in recipes)
        {
            var rect = new Rectangle(
                curX, curY,
                this.craftingMenu.recipeBlock.w,
                this.craftingMenu.recipeBlock.h
            );
            
            if(rect.contains(relativePos))
            {
                console.log("select recipe: ", recipes[i]);
                this.recipeSelection = recipes[i];
            }

            curX += (this.craftingMenu.recipeBlock.w + this.craftingMenu.recipeBuffer.x);
            if(curX + this.craftingMenu.recipeBlock.w + this.craftingMenu.recipeBuffer.x > 
               this.craftingMenu.recipesArea.x + this.craftingMenu.recipesArea.w)
            {
                curX = this.craftingMenu.recipesArea.x;
                curY += (this.craftingMenu.recipeBlock.h + this.craftingMenu.recipeBuffer.y);
            }
        }
        
        //check build button
        if(this.craftingMenu.buildButton.contains( relativePos ))
        {
            if(null != this.recipeSelection && this.recipeSelection.craftable)
                this.crafting.craft( player, this.recipeSelection, this.items )
        }
        
        //check background
        if(this.craftingMenu.background.contains(relativePos))
            return true;
    }
    
    this.shipOpen = false;
    this.craftOpen = false;
    this.currentShip = null;
    return false;
    
}

UI.prototype.getCraftingOptions = function()
{
    if(this.craftSelection == null || ! this.crafting) return [];
    
    return this.crafting.getAvailable( this.craftSelection );
}

UI.prototype.openShip = function( ship )
{
    this.shipOpen = true;
    this.openCrafting();
    this.currentShip = ship;
}

UI.prototype.openCrafting = function()
{
    this.craftOpen = true;
}

UI.prototype.resize = function(width, height) 
{
    this.playerInventory = new Rectangle(200, height - 70, 400, 70);
    
}