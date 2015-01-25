var Engine = function()
{
    //usefull stuff
    this.timer;
    this.input;
    this.generator;
    
    //classes
    this.renderer;
    this.player;
    this.ship;
    this.world;
    this.ui;
}

Engine.prototype.init = function()
{
    //usefull stuff
    this.timer = new GameTimer();
    this.input= new Input();
    this.generator = new Generator();
    this.crafting = new Crafting();
    
    //classes
    this.renderer = new Renderer();
    this.player = new Player();
    this.ship = new Ship();
    
    //TODO get to inventory
    this.ui = new UI();

    //load everythign that needs loading
    var loader = new AsyncLoader()
    loader.onCompleteContext = this;
    loader.onComplete = this.begin;
    
    loader.addClassCall( this.renderer );
    loader.addClassCall( this.generator );
<<<<<<< HEAD
    loader.addClassCall( this.crafting );
=======
    loader.addClassCall( this.ui );
>>>>>>> 812d58b05f46993c9c87a26931e41a30d9972b88
    
    loader.runCalls();
}

Engine.prototype.begin = function()
{
    //get world 
    this.world = this.generator.generate();
    
    //initialize stuff
    this.renderer.init( canvas );
    this.player.init();
    this.ui.init(canvas, this.player, null);
    this.ship.init();
    
    //set 
    this.input.addListener( Input.eventTypes.MOUSEDOWN, this.onMouseDown, this );
    this.input.addListener(Input.eventTypes.RIGHTMOUSEDOWN, this.onRMouseDown, this);
    
    this.input.addListener(Input.eventTypes.MOUSEMOVE_ABS, this.onMouseMove, this);
    
    onResize();
    window.requestAnimationFrame( this.frameCallback );
}

Engine.prototype.onMouseDown = function( mousePos )
{
    
    var worldPos = this.renderer.unProject( mousePos );
    
    //TODO try ui first, then ship / player, then world
    var uiResult = this.ui.sample(mousePos);
    var result = this.world.sample( worldPos );
    if (uiResult) {
        console.log ("UI ELEMENT CLICKED");
    } else if (this.ship.checkClickIntersect(worldPos)) {
        // Open Ship Menu
    } else if (result) {
        console.log("WORLD ELEMENT CLICKED");
        // check if player is close enough to pick up object
        if (this.player.position.clone().sub(this.world.planets[result.planetIndex].position.clone().add(result.objectData.position)).length() < 0.4) {
            // Add to player inventory and remove from world
            if (this.player.addToInventory(result.objectData))
                this.world.planets[result.planetIndex].removeItem(result.objectData);
        }
    } else if (this.player.inShip) { // Update player / ship position
        if (this.ship.landed)
            this.ship.launch();
        else
            this.ship.goal.copy(worldPos);
    } else {
        this.player.goal.copy( worldPos );
    }
}

Engine.prototype.onRMouseDown = function( mousePos) {
    var worldPos = this.renderer.unProject( mousePos );
    
    //Check UI elements first
    
    
    // Check Gameplay elements
    if (this.ship.checkClickIntersect(worldPos) && (this.player.inShip || this.ship.position.clone().sub(this.player.position).length() < 2)) {
        this.player.toggleShipStatus(this.ship);
        this.renderer.zoom = (this.player.inShip) ? 1.0 : 2.5;
    }
    for (var p=0; p < this.world.planets.length; p++) {
        var planet = this.world.planets[p];
        
        // check click
        if (planet.position.clone().sub(worldPos).length() < planet.radius) {
            console.log("Planet Clicked");
            this.ship.landing = true;
            // set ship goal to be the planet
            this.ship.goal.copy(planet.position);
        }
    }
}

Engine.prototype.onMouseMove = function(mousePos) {
    this.timer.startSubTick("mouseMove");
}

Engine.prototype.frameCallback = function()
{
    engine.update.call(engine);
}

Engine.prototype.update = function()
{
    this.timer.tick();
    
    // Check mousemove timer for hovers
    this.timer.endSubTick("mouseMove");
    if (this.timer.subTicks["mouseMove"].deltaS > 1) {
        console.log("TODO: Hover Action on screen!");
        
        // Follow same pattern - sample ui, then ship / player, then world
        
        
    }
    
    // Check collisions between ship and planets
    if (!this.ship.landed) {
        this.ship.update(this.timer);
        var checkDist = false;
        for (p in this.world.planets) {
            var planet = this.world.planets[p];
            var distance = planet.position.clone().sub(this.ship.position).length();
            if (distance < planet.radius + 0.5) { // TODO: Change to fit ship size
                this.ship.landed = true;
                checkDist = true;
                if (this.ship.landing) {
                    console.log("Successful Landing!");
                } else {
                    console.log("CRASH");
                    this.ship.takeDamage(40); // TODO - MAKE NOT HARDCODE
                }
            } else if (distance < 5 + planet.radius) {
                // add gravity force to the movement
                this.ship.force = planet.position.clone().sub(this.ship.position).normalize().multiplyScalar(0.1);
                console.log("GRAVITY");
                checkDist = true;
            }
        }
        if (!checkDist) {
            this.ship.force = new Vector2();
        }
    }
    if (!this.player.inShip) {
        // Player / planet collision
        this.player.update( this.timer );
        
        var checkDist = false;
        for (p in this.world.planets) {
            var planet = this.world.planets[p];
            var distance = planet.position.clone().sub(this.player.position).length();
            if (distance < planet.radius + 0.4) { // TODO: Change to fit ship size
                // Player is on the surface - controls should behave
                checkDist = false; // don't want the force to continue acting
                
                // Set player position to exactly radius + 0.5 along that vector
                this.player.position.copy(planet.position.clone().add(planet.position.clone().sub(this.player.position).negate().normalize().multiplyScalar(planet.radius + 0.3)));
                // set player goal to be 0.5 along its current vector
                this.player.goal.copy(planet.position.clone().add(planet.position.clone().sub(this.player.goal).negate().normalize().multiplyScalar(planet.radius + 0.3)));
                this.player.goal
                break;
            } else if (distance < 5 + planet.radius) {
                // add gravity force to the movement
                this.player.force = planet.position.clone().sub(this.player.position).normalize().multiplyScalar(0.1);
                console.log("GRAVITY on Player");
                checkDist = true;
                break;
            }
        }
        if (!checkDist) {
            this.player.force = new Vector2();
        }
    }
    
    //wrap if necessary
    var obj = this.player.inShip ? this.ship : this.player;
    if(!this.world.bounds.contains(obj.position))
    {
        obj.wrapValues( this.world.bounds );
    }
    
    //other class updates
    
    this.renderer.render( this.world, this.player, this.ship, this.ui, this.timer );
    
    window.requestAnimationFrame( this.frameCallback );
}

Engine.prototype.resize = function( w, h )
{
    if( isDefined(this.renderer) )
    {
        this.renderer.resize( w, h );
        this.ui.resize(w, h);
    }
}