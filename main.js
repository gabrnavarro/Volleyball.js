// Create our 'main' state that will contain the game

var mouseTouchDown = false;
var score = 0
var highscore = 0
var mainState = {



    preload: function() { 
        // This function will be executed at the beginning     
        // That's where we load the images and sounds 
        
        game.load.image('ball', 'assets/PNG/Balls/Black/ballBlack_04.png');
        game.load.image('cannon', 'assets/PNG/Pipes/Green/pipeGreen_09.png');
        game.load.image('bullet', 'assets/PNG/Balls/Yellow/ballYellow_10.png');
        game.load.image('cloud', 'assets/PNG/Enemies/cloud.png');
        game.load.image('grass', 'assets/PNG/Environment/ground_grass.png');

        
    },
    
    init: function() {
        
        var keys = [Phaser.KeyCode.SPACEBAR, Phaser.KeyCode.ENTER];
	// Create Phaser.Key objects for listening to the state
        phaserKeys = game.input.keyboard.addKeys(keys);
	// Capture these keys to stop the browser from receiving this event
        game.input.keyboard.addKeyCapture(keys);
    
    
    
    },

    create: function() { 
        // This function is called after the preload function     
        // Here we set up the game, display sprites, etc. 
        this.cursors = this.game.input.keyboard.createCursorKeys();

        //background
        this.cloud = game.add.sprite(50, 100, 'cloud');
        this.cloud.scale.setTo(.4,.4);
        this.cloud1 = game.add.sprite(250, 200, 'cloud');
        this.cloud1.scale.setTo(.5,.5);
        this.grass = game.add.sprite(0, 470, 'grass');
        game.stage.backgroundColor = '#71c5cf';

        //Ball and cannon
        game.physics.startSystem(Phaser.Physics.P2JS);
        game.physics.p2.restitution = 1.2;
        this.ball = game.add.sprite(200, 245, 'ball');
        this.cannon = game.add.sprite(200, 490, 'cannon');
        this.ball.anchor.setTo(0.4, 0.4);
        this.cannon.anchor.setTo(0.5, 0.5);
        this.cannon.scale.setTo(.4,.4);
        this.ball.scale.setTo(.4,.4);
        game.physics.p2.enable(this.ball);
        this.ball.body.setCircle(29);
        this.game.debug.body(this.ball)
        //gravity and bounce, collision
        this.game.physics.p2.gravity.y = 1500; 

        this.ballCollisionGroup = this.game.physics.p2.createCollisionGroup();
        this.bulletCollisionGroup = this.game.physics.p2.createCollisionGroup();
        this.game.physics.p2.updateBoundsCollisionGroup();
        this.ball.body.setCollisionGroup(this.ballCollisionGroup);
        this.ball.body.collides([this.bulletCollisionGroup]);
        
        this.bullet = game.add.group();
        
        this.bullet.createMultiple(20, 'bullet');
        
        this.bullet.callAll('events.onOutOfBounds.add', 'events.onOutOfBounds', this.resetbullet);
        this.bullet.callAll('anchor.setTo', 'anchor', 0.1, 0.1);
        this.bullet.callAll('scale.setTo', 'scale', .1, .1);
        this.bullet.setAll('checkWorldBounds', true);
        this.bullet.enableBody = true;
        this.bullet.physicsBodyType = Phaser.Physics.P2JS;
        game.physics.p2.enable(this.bullet);
       

        this.bullet.forEach(function(child){
        child.body.setCircle(7);
        child.body.setCollisionGroup(this.bulletCollisionGroup);
        child.body.collides([this.ballCollisionGroup], this.addscore());
        child.body.collideWorldBounds=false;
    }, this);
    },
    
    resetbullet: function(bullet) {
        bullet.kill();
    },
    
    update: function() {
        // This function is called 60 times per second    
        // It contains the game's logic   
        
        // game.physics.p2.collide(this.ball, this.bullet, this.addscore);
        for (var index in phaserKeys) {
		// Save a reference to the current key
            var key = phaserKeys[index];
            if(key.isDown)
            console.log(key, key.isDown)
		// If the key was just pressed, fire a laser
            if (key.justDown) {
                this.firebullet();
                }
        }
        if(this.cursors.left.isDown) {
            this.cannon.x-=4;
        
        }
        
        else if(this.cursors.right.isDown) {
            this.cannon.x+=4;
        }
        
        
        
        
       if (this.ball.y > 440) {
           this.ball.reset(200, 245);
           if (score > highscore){
              highscore = score;
                }
            score = 0
        }
      

	// Game.input.activePointer is either the first finger touched, or the mouse
        if (game.input.activePointer.isDown) {
		// We'll manually keep track if the pointer wasn't already down
            if (!mouseTouchDown) {
                this.touchDown();
            }
        } else {
		if (mouseTouchDown) {
			this.touchUp();
            }
        }
    
    
    },
    
    touchDown: function(){
        mouseTouchDown = true;
        this.firebullet();
    },
    
    touchUp: function(){
        mouseTouchDown = false;
    },
    
    addscore: function(body1, body2){
    	console.log(score)
        score = score + 1
        },
    
    firebullet: function(){
	var bullets = this.bullet.getFirstDead(false);
	if (bullets) {
		// If we have a laser, set it to the starting position
		bullets.reset(this.cannon.x, this.cannon.y - 20);
		// Give it a velocity of -500 so it starts shooting
		bullets.body.velocity.x = this.game.rnd.between(-.10, .10)
		bullets.body.velocity.y = -1000
	}
    
    },
    
    render: function(){
    game.debug.text('Score: ' + score + '   Highscore: ' + highscore, 10, 30)
    }

  
    
};

// Initialize Phaser, and create a 400px by 490px game
var game = new Phaser.Game(400, 490, Phaser.AUTO);

// Add and start the 'main' state to start the game
game.state.add('main', mainState, true); 