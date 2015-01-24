var Renderer = function()
{
    AsyncLoadable.call(this);
    
    this.zoom = 1.0;
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
    var center = (player.inShip) ? ship.position : player.position;
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
        var origin = this.project( new Vector2( 0, 0 ) );
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
        this.ctx.fillText("x: " + engine.player.position.x + ", y: " + engine.player.position.y, 10, 30);
        
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
        pos = this.project( p.position );
        rad = this.worldToPixel( p.radius );
        this.ctx.moveTo(pos.x, pos.y);
        this.ctx.arc(pos.x, pos.y, rad, 0, Math.PI * 2, false );
    }
    this.ctx.fill();
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