var Renderer = function()
{
    AsyncLoadable.call(this);
    
    this.zoom = 1.0; // TODO - a "Goal" type system like player
    this.viewport = new Rectangle();
    
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
}

Renderer.prototype.render = function( world, player, ship, timer )
{
    this.ctx.clearRect( 0, 0, this.canvas.width, this.canvas.height );
    
    //calculate world viewport first
    var center = player.inShip ? ship.position.clone() : player.position.clone();
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
        var goal = (player.inShip) ? this.project(ship.goal) : this.project( player.goal );
        this.ctx.fillStyle = "#F00";
        this.ctx.beginPath();
        this.ctx.arc(goal.x, goal.y, 10, 0, Math.PI * 2, false);
        this.ctx.fill();
        
        //debug player position
        this.ctx.fillStyle = "#FFF";
        var pos = player.inShip ? ship.position : player.position;
        this.ctx.fillText("x: " + pos.x.toFixed(2) + ", y: " + pos.y.toFixed(2), 10, 30);
        
        // Ship position
        var shipPos = this.project(ship.position);
        this.ctx.fillRect(shipPos.x - 25, shipPos.y - 25, 50, 50);
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
    this.ctx.beginPath();
    var p, pos, rad;
    for(var i in world.planets)
    {
        p = world.planets[i];
        pos = this.project( this.wrapWorldCoords( p.position ) );
        rad = this.worldToPixel( p.radius );
        this.ctx.moveTo(pos.x, pos.y);
        this.ctx.arc(pos.x, pos.y, rad, 0, Math.PI * 2, false );
    }
    this.ctx.fill();
    
    
    // UI Components TEST
    
    /*
    this.ctx.save();
    
    this.ctx.fillStyle = "#FFF";
    this.ctx.arc(70, 70, 25, 2*Math.PI, false);
    this.ctx.closePath();
    this.ctx.clip();
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(40, 95, 50, -50);
    this.ctx.fillStyle = '#13a8a4';
    this.ctx.fillRect(40, 95, 60, map(player.oxygen, 0, 100, 0, -50));
    
    this.ctx.restore();
    this.ctx.strokeStyle = "#ddd";
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.arc(70, 70, 25, 2*Math.PI, false);
    this.ctx.stroke();
    this.ctx.closePath();
    */
    
    // Player Inventory
    this.ctx.fillStyle = "#eee";
    for (var i=0; i < player.inventory.length; i++) {
        this.ctx.fillRect(200 + (75*i), this.canvas.height - 60, 50, 50);
    }
    
}

Renderer.prototype.resize = function( w, h )
{
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
    
    var options = [];
    
    //try normal
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
    //try both-
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
    });
    
    options.sort(function(a, b){return a.dist-b.dist});
    return options[0].pos;
    
}