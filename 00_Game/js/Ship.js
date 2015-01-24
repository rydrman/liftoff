var Ship = function() {
    // Position
    this.position = new Vector2();
    this.goal = new Vector2();
    this.speed = 5; //units per second - 1 unit = 50px
    
    // Variables
    this.damage = 100;
    this.fuel = 100;
    
    // parts
}

Ship.prototype.init = function() {
    
}

Ship.prototype.update = function(timer) {
    if( !this.position.compare( this.goal ) ) {
        var offset = this.goal.clone().sub( this.position);
        if (offset.length() < 0.05) {
            this.position.copy(this.goal);
        } else {
            offset.normalize();
            offset.multiplyScalar(this.speed * timer.deltaTimeS);
            this.position.add( offset );
        }
    }
}

Ship.prototype.checkClickIntersect = function(clickPos) {
    // TODO - modules on ship change its bounding box
    return (Math.abs(clickPos.x - this.position.x) < 0.5 && Math.abs(clickPos.y - this.position.y) < 0.5)
}

Ship.prototype.wrapValues = function( bounds )
{
    //position
    this.position.x = wrap( this.position.x, bounds.x, bounds.x + bounds.w );
    this.position.y = wrap( this.position.y, bounds.y, bounds.y + bounds.h );
    
    //goal
    this.goal.x = wrap( this.goal.x, bounds.x, bounds.x + bounds.w );
    this.goal.y = wrap( this.goal.y, bounds.y, bounds.y + bounds.h );
}