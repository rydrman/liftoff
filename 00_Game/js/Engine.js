var Engine = function()
{
    //usefull stuff
    this.timer;
    this.input;
    this.generator;
    
    //classes
    this.renderer;
    this.player;
    this.world;
}

Engine.prototype.init = function()
{
    //usefull stuff
    this.timer = new GameTimer();
    this.input= new Input();
    this.generator = new Generator();
    
    //classes
    this.renderer = new Renderer();
    this.player = new Player();
    
    //TODO get to inventory
    this.world = this.generator.generate();
    
    //load everythign that needs loading
    var loader = new AsyncLoader()
    loader.onCompleteContext = this;
    loader.onComplete = this.begin;
    
    loader.addClassCall( this.renderer );
    
    loader.runCalls();
}

Engine.prototype.begin = function()
{
    //initialize stuff
    this.renderer.init( canvas );
    this.player.init();
    
    //set 
    this.input.addListener( Input.eventTypes.MOUSEDOWN, this.onMouseDown, this );
    
    window.requestAnimationFrame( this.frameCallback );
}

Engine.prototype.onMouseDown = function( mousePos )
{
    
    var worldPos = this.renderer.unProject( mousePos );
    
    //TODO try ui first, then world
    
    var result = this.world.sample( worldPos );
    
    //TODO use other options
    this.player.goal.copy( result.position );
}

Engine.prototype.frameCallback = function()
{
    engine.update.call(engine);
}

Engine.prototype.update = function()
{
    this.timer.tick();
    
    this.player.update( this.timer );
    
    //other class updates
    
    this.renderer.render( this.world, this.player, this.timer );
    
    window.requestAnimationFrame( this.frameCallback );
}

Engine.prototype.resize = function( w, h )
{
    if( isDefined(this.renderer) )
    {
        this.renderer.resize( w, h );
    }
}