var Renderer = function()
{
    AsyncLoadable.call(this);
    
    this.zoom = 1.0; // TODO - a "Goal" type system like player
    this.viewport = new Rectangle();
    
    this.initialized = false;
    this.canvas;
    this.ctx;
    
    this.pixelRatio = 50;
    this.pixelRatioInv = 1 / this.pixelRatio;
}

Renderer.prototype = new AsyncLoadable();

Renderer.prototype.init = function( canvas )
{
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
    this.initialized = true;
}

Renderer.prototype.render = function( world, player, ship, ui, timer )
{
    this.ctx.clearRect( 0, 0, this.canvas.width, this.canvas.height );
    
    //calculate world viewport first
    var center = player.position.clone();
    //var centerPixel = this.worldToPixel2( center );
    var viewportSize = this.pixelToWorld2( new Vector2( this.canvas.width, this.canvas.height ) );
    this.viewport.x = center.x - viewportSize.x * 0.5;
    this.viewport.y = center.y - viewportSize.y * 0.5;
    this.viewport.w = viewportSize.x;
    this.viewport.h = viewportSize.y;
    
    if(Settings.debug)
    {
        //debug lines
        var x = 0,
            y = 0;
        this.ctx.strokeStyle = "#000";
        this.ctx.lineWidth = 1;
        var step = this.worldToPixel( 1 );
        var offsetPixel = this.worldToPixel2( center );
        offsetPixel = new Vector2( offsetPixel.x % step, offsetPixel.y % step );
        offsetPixel.negate();
        this.ctx.beginPath();
        while( x < this.canvas.width + step )
        {
            this.ctx.moveTo( x + offsetPixel.x, 0 );
            this.ctx.lineTo( x + offsetPixel.x, this.canvas.height );
            x += step;
        }
        while( y < this.canvas.height + step )
        {
            this.ctx.moveTo( 0, y + offsetPixel.y );
            this.ctx.lineTo( this.canvas.width, y + offsetPixel.y );
            y += step;
        }
        this.ctx.stroke();
        
        //draw thicker edge lines
        this.ctx.lineWidth = 5;
        var origin = this.project( this.wrapWorldCoords(new Vector2( 0, 0 )) );
        this.ctx.beginPath();
        this.ctx.moveTo( 0, origin.y );
        this.ctx.lineTo( this.canvas.width, origin.y );
        this.ctx.moveTo( origin.x, 0 );
        this.ctx.lineTo( origin.x, this.canvas.height );
        this.ctx.stroke();
        
        this.ctx.fillStyle = "#FFF";
        this.ctx.fillText(timer.framerate.toFixed(2), 10, 10);
        
        //player / ship goal
        var goal = (player.inShip) ? this.project(player.ship.goal) : this.project( player.goal );
        this.ctx.fillStyle = "#F00";
        this.ctx.beginPath();
        this.ctx.arc(goal.x, goal.y, 10, 0, Math.PI * 2, false);
        this.ctx.fill();
        
        //debug player position
        this.ctx.fillStyle = "#FFF";
        var pos = player.position.clone();
        this.ctx.fillText("x: " + pos.x.toFixed(2) + ", y: " + pos.y.toFixed(2), 10, 30);
        
        // Player Position
        if (!player.inShip) {
            this.ctx.fillStyle = "#0F0";
            var playerPos = this.project(player.position);
            this.ctx.beginPath();
            this.ctx.arc(playerPos.x, playerPos.y, 10, 0, Math.PI * 2, false);
            this.ctx.fill();
        }
        
    }
    
    //draw planets
    this.ctx.fillStyle = "#F00";
    var p, pos, rad;
    for(var i in world.planets)
    {
        p = world.planets[i];
        
        if( this.viewport.distanceTo( p.position ) > p.radius + 5 )
            continue;
        
        pos = this.project( this.wrapWorldCoords( p.position ) );
        rad = this.worldToPixel( p.radius );
        
        this.ctx.save();
        this.ctx.translate( pos.x, pos.y );
        //draw shell
        this.ctx.fillStyle = p.color;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, rad, 0, Math.PI * 2, false );
        this.ctx.fill();
        //draw items
        for(var i in p.items)
        {
            if(!p.items[i].image.complete) continue;
            
            this.ctx.save();
            this.ctx.rotate( p.items[i].planetPosition );
            this.ctx.translate(0, rad)
            this.ctx.rotate( Math.PI )
            this.ctx.scale( player.ship.renderScale, player.ship.renderScale );
            try{
                this.ctx.drawImage( p.items[i].image, -p.items[i].image.width * 0.5, -p.items[i].image.height * 0.75);
            }
            catch(err)
            {
                console.warn("image does not exist: " + p.items[i].image.src);
                p.items[i].image = missingImg;
            }
            this.ctx.restore();
        }
        this.ctx.restore()
    }
    
    //drawShips, not player ship
    for(var i in world.ships)
    {
        //TODO
        if(world.ships[i] === player.ship) continue;
        
        this.renderShip( world.ships[i] );
    }
    
    //ui and player ship
    var shipDrawn = this.renderUI( ui, player.ship );

    if(!shipDrawn && player.ship)
    {
        this.renderShip( player.ship );
    }
}

Renderer.prototype.renderUI = function( ui, ship )
{    
    //draw inventory 
    
    //draw crafting
    if( ui.craftOpen )
    {
        //draw background square
        this.ctx.drawImage(ui.craftBackImg, 
                           ui.craftingMenu.background.x * this.canvas.width,
                           ui.craftingMenu.background.y * this.canvas.height,
                           ui.craftingMenu.background.w * this.canvas.width,
                           ui.craftingMenu.background.h * this.canvas.height
                          );
        for(var i in ship.parts)
        {
            //draw top row of menu items
            this.ctx.drawImage(ui.backSquareImg, 
                               ui.craftingMenu.topRow[i].x * this.canvas.width,
                               ui.craftingMenu.topRow[i].y * this.canvas.height,
                               ui.craftingMenu.topRow[i].w * this.canvas.width,
                               ui.craftingMenu.topRow[i].h * this.canvas.height
                              );
        }
    }
    
    //draw ship menu
    if( !ui.shipOpen ) 
        return false;
    
    for(var i in ship.parts)
    {
        //draw background square
        this.ctx.drawImage(ui.backSquareImg, 
                           ui.shipMenu[i].x * this.canvas.width,
                           ui.shipMenu[i].y * this.canvas.height,
                           ui.shipMenu[i].w * this.canvas.width,
                           ui.shipMenu[i].h * this.canvas.height
                          );
        
        //draw ship part
        if(null != ship.parts[i])
        {
            var center = ui.shipMenu[i].center;
            //var scale = (ui.shipMenu[i].w * this.canvas.width) / ship.parts[i].image.width;
            this.ctx.save();
            this.ctx.translate( center.x * this.canvas.width, center.y * this.canvas.height );
            this.ctx.scale( ship.renderScale, ship.renderScale );
            if( i == 'cockpit' )
                this.ctx.translate( 0, -ship.parts[i].image.height * 0.25);
            this.ctx.drawImage(ship.parts[i].image,
                               -ship.parts[i].image.width * 0.5,
                               -ship.parts[i].image.height * 0.5);
            this.ctx.restore();
        }
        
        //draw addon slots background
        this.ctx.drawImage(ui.backAddonImg, 
                           ui.addonMenu[i].x * this.canvas.width,
                           ui.addonMenu[i].y * this.canvas.height,
                           ui.addonMenu[i].w * this.canvas.width,
                           ui.addonMenu[i].h * this.canvas.height
                          );
    }
    
    return true;
}

Renderer.prototype.renderShip = function(ship)
{
    ship.construct( this );
    this.ctx.save();
    
    var center = ship.position.clone();
    center = this.project( center );
    
    this.ctx.translate( center.x, center.y );
    this.ctx.rotate( ship.rotation + Math.PI * 0.5 );
    this.ctx.scale( ship.renderScale, ship.renderScale );
    this.ctx.translate( 0, ship.renderHeight * 0.5 );
    
    for(var i in ship.parts)
    {
        if(ship.parts[i] == null) continue;
        
        this.ctx.drawImage( 
            ship.parts[i].image,
            -ship.parts[i].image.width * 0.5,
            -ship.parts[i].renderY
        );
    }
    this.ctx.restore();
    
    if(Settings.debug)
    {
        this.ctx.save();
        this.ctx.translate( center.x, center.y ); 
        this.ctx.rotate( ship.rotation + Math.PI * 0.5 );
        this.ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
        //this.ctx.fillRect( ship.bounds.x, ship.bounds.y, ship.bounds.w, ship.bounds.h );
        this.ctx.fillRect( this.worldToPixel( ship.bounds.x ), 
                           this.worldToPixel( ship.bounds.y ), 
                           this.worldToPixel( ship.bounds.w ), 
                           this.worldToPixel( ship.bounds.h ) );
        this.ctx.restore();
    }
    
}

Renderer.prototype.resize = function( w, h )
{
    if(!this.initialized) return;
    
    this.canvas.width = w;
    this.canvas.height = h;
}


Renderer.prototype.worldToPixel = function( worldVal )
{
    return worldVal * this.pixelRatio * this.zoom;
}

Renderer.prototype.pixelToWorld = function( pixelVal )
{
    return pixelVal * this.pixelRatioInv * 1 / this.zoom;
}

Renderer.prototype.worldToPixel2 = function( worldPos )
{
    return worldPos.getMultiplyScalar( this.pixelRatio * this.zoom );
}

Renderer.prototype.pixelToWorld2 = function( pixelPos )
{
    return pixelPos.getMultiplyScalar( this.pixelRatioInv * 1 / this.zoom );
}

Renderer.prototype.unProject = function( screenPos )
{
    var x = map( screenPos.x, 0, this.canvas.width, this.viewport.x, this.viewport.x + this.viewport.w )
    var y = map( screenPos.y, 0, this.canvas.height, this.viewport.y, this.viewport.y + this.viewport.h );
    return new Vector2( x, y );
}

Renderer.prototype.project = function( worldPos )
{
    var x = map( worldPos.x, this.viewport.x, this.viewport.x + this.viewport.w, 0, this.canvas.width  )
    var y = map( worldPos.y, this.viewport.y, this.viewport.y + this.viewport.h, 0, this.canvas.height );
    return new Vector2( x, y );
}

Renderer.prototype.wrapWorldCoords = function( worldAbs )
{
    //if it's in viewport, return it
    if( this.viewport.contains( worldAbs ) ) 
        return worldAbs;
    
    var center = this.viewport.center;
    
    var options = [];
    
    //try normal
    var norm = worldAbs.clone();
    options.push({
        pos : norm.clone(),
        dist : norm.sub( center ).lengthSqd()
    });
    //try top
    var top = worldAbs.clone();
    top.y -= Settings.worldSize.y;
    options.push({
        pos : top.clone(),
        dist : top.sub( center ).lengthSqd()
    });
    //try left
    var left = worldAbs.clone();
    left.x -= Settings.worldSize.x;
    options.push({
        pos : left.clone(),
        dist : left.sub( center ).lengthSqd()
    });
    //try bottom
    var bottom = worldAbs.clone();
    bottom.y += Settings.worldSize.y;
    options.push({
        pos : bottom.clone(),
        dist : bottom.sub( center ).lengthSqd()
    });
    //try right
    var right = worldAbs.clone();
    right.x += Settings.worldSize.x;
    options.push({
        pos : right.clone(),
        dist : right.sub( center ).lengthSqd()
    });
    //try both
    var bothNeg = worldAbs.clone();
    bothNeg.x -= Settings.worldSize.x;
    bothNeg.y -= Settings.worldSize.y;
    options.push({
        pos : bothNeg.clone(),
        dist : bothNeg.sub( center ).lengthSqd()
    });
    var bothPos = worldAbs.clone();
    bothPos.x += Settings.worldSize.x;
    bothPos.y += Settings.worldSize.y;
    options.push({
        pos : bothPos.clone(),
        dist : bothPos.sub( center ).lengthSqd()
    });
    
    /*//try normal
    var norm = worldAbs.clone();
    options.push({
        pos : norm,
        dist : this.viewport.distanceTo( norm )
    });
    //try top
    var top = worldAbs.clone();
    top.y -= Settings.worldSize.y;
    options.push({
        pos : top,
        dist : this.viewport.distanceTo( top )
    });
    //try left
    var left = worldAbs.clone();
    left.x -= Settings.worldSize.x;
    options.push({
        pos : left,
        dist : this.viewport.distanceTo( left )
    });
    //try bottom
    var bottom = worldAbs.clone();
    bottom.y += Settings.worldSize.y;
    options.push({
        pos : bottom,
        dist : this.viewport.distanceTo( bottom )
    });
    //try right
    var right = worldAbs.clone();
    right.x += Settings.worldSize.x;
    options.push({
        pos : right,
        dist : this.viewport.distanceTo( right )
    });
    //try both
    var bothNeg = worldAbs.clone();
    bothNeg.x -= Settings.worldSize.x;
    bothNeg.y -= Settings.worldSize.y;
    options.push({
        pos : bothNeg,
        dist : this.viewport.distanceTo( bothNeg )
    });
    var bothPos = worldAbs.clone();
    bothPos.x += Settings.worldSize.x;
    bothPos.y += Settings.worldSize.y;
    options.push({
        pos : bothPos,
        dist : this.viewport.distanceTo( bothPos )
    });*/
    
    options.sort(function(a, b){return a.dist-b.dist});
    return options[0].pos;
    
}