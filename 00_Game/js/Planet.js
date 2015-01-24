var Planet = function( options )
{
    this.radius = options.radius ? options.radius : 1;
    this.position = options.position ? new Vector2().copy(options.position) : new Vector2();
}
