var Ship = function() {
    // Position
    Player.call(this);

    this.speed = 5; //units per second - 1 unit = 50px
    
    // Variables
    this.damage = 100;
    this.fuel = 100;
    
    // parts
    
    this.engine = null;
    this.cockpit = null;
    this.cargo = null;
    this.science = null;
    this.engineering = null;
    
    this.inMenu = false;
    this.landed = false;
    this.landing = false;
}
Ship.prototype = new Player();

Ship.prototype.init = function() {
    
}

Ship.prototype.checkClickIntersect = function(clickPos) {
    // TODO - modules on ship change its bounding box
    return (Math.abs(clickPos.x - this.position.x) < 0.5 && Math.abs(clickPos.y - this.position.y) < 0.5)
}

Ship.prototype.launch = function() {
    // Basically - set the goal vector to outside the gravitational influence
    // Also, move the position slightly along that vector to prevent immediate crashing
    this.goal.copy(this.force.clone().negate().multiplyScalar(50).add(this.position));
    this.position.add(this.goal.clone().sub( this.position).multiplyScalar(0.1));
    this.landed = false;
    this.landing = false;
}

Ship.prototype.takeDamage = function(amount) {
    this.damage -= amount;
    
    // TODO Check 0 condition
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