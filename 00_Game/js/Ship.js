var Ship = function() {
    // Position
    this.position = new Vector2();
    this.goal = new Vector2();
    this.speed = 5; //units per second - 1 unit = 50px
    this.force = new Vector2();
    
    // Variables
    this.damage = 100;
    this.fuel = 100;
    
    // parts
    
    this.engine;
    this.cockpit;
    this.cargo;
    this.science;
    this.armaments;
    
    this.inMenu = false;
    this.landed = false;
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
            offset.add(this.force);
            offset.multiplyScalar(this.speed * timer.deltaTimeS);
            this.position.add( offset );
        }
    } else if (this.force.length() > 0) {
        this.position.add(this.force);
        this.goal.copy(this.position);
    }
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
}