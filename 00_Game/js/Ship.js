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