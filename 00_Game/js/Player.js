var Player = function()
{
    this.position = new Vector2();
    
    this.goal = new Vector2();
}

Player.prototype.init = function()
{
}

Player.prototype.update = function( timer )
{
    if( !this.position.compare( this.goal ) )
    {
        var offset = this.goal.clone().sub ( this.position );
        offset.multiplyScalar( timer.deltaTimeS );
        this.position.add( offset );
    }
}

