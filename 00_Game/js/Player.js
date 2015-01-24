var Player = function() {
    this.position = new Vector2();
    this.speed = 4; // units per second - 1 unit = 50px;
    
    this.goal = new Vector2();
    
    this.inShip = true;
    
    // Variables
    this.oxygen = 100;
    this.comfort = 100;
}

Player.prototype.init = function() {
    
}

Player.prototype.update = function( timer ) {
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

Player.prototype.toggleShipStatus = function(ship) {
    this.inShip = !this.inShip;
    this.goal.copy(ship.position)
    this.position.copy(ship.position);
}