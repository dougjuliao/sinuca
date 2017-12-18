class Sinuca{
    constructor(conf){
        this.conf = conf;
        this.game = null;
        this.cursors = null;
        this.whiteBall = null;
        this.customBounds = null;
        this.init();
    }
    preload() {
        this.game.load.image('ball', 'images/shinyball.png');
        this.game.load.image('balldefault', 'images/ball.png');
    }
   
    create() {
        const bounds = new Phaser.Rectangle(100, 100, 400, 400),
              game = this.game;

        game.physics.startSystem(Phaser.Physics.P2JS);
        game.physics.p2.restitution = 0.9;

        const balls = game.add.physicsGroup(Phaser.Physics.P2JS);
        for (let i = 0; i < 15; i++) {
            let ball = balls.create(bounds.randomX, bounds.randomY, 'ball');
            ball.body.setCircle(15);
        }
        this.whiteBall = game.add.sprite(bounds.centerX, bounds.centerY, 'balldefault');
        
        game.physics.p2.enable(this.whiteBall);

        this.whiteBall.body.setCircle(28);
        this.whiteBall.scale.set(0.02);

        const createPreviewBounds = (x, y, w, h) => {
            var sim = this.game.physics.p2;

            //  If you want to use your own collision group then set it here and un-comment the lines below
            var mask = sim.boundsCollisionGroup.mask;

            this.customBounds.left = new p2.Body({ mass: 0, position: [sim.pxmi(x), sim.pxmi(y)], angle: 1.5707963267948966 });
            this.customBounds.left.addShape(new p2.Plane());
            // this.customBounds.left.shapes[0].collisionGroup = mask;

            this.customBounds.right = new p2.Body({ mass: 0, position: [sim.pxmi(x + w), sim.pxmi(y)], angle: -1.5707963267948966 });
            this.customBounds.right.addShape(new p2.Plane());
            // this.customBounds.right.shapes[0].collisionGroup = mask;

            this.customBounds.top = new p2.Body({ mass: 0, position: [sim.pxmi(x), sim.pxmi(y)], angle: -3.141592653589793 });
            this.customBounds.top.addShape(new p2.Plane());
            // this.customBounds.top.shapes[0].collisionGroup = mask;

            this.customBounds.bottom = new p2.Body({ mass: 0, position: [sim.pxmi(x), sim.pxmi(y + h)] });
            this.customBounds.bottom.addShape(new p2.Plane());
            // this.customBounds.bottom.shapes[0].collisionGroup = mask;

            sim.world.addBody(this.customBounds.left);
            sim.world.addBody(this.customBounds.right);
            sim.world.addBody(this.customBounds.top);
            sim.world.addBody(this.customBounds.bottom);
        }

        this.customBounds = { left: null, right: null, top: null, bottom: null };
        createPreviewBounds(bounds.x, bounds.y, bounds.width, bounds.height);

        //  Just to display the bounds
        var graphics = game.add.graphics(bounds.x, bounds.y);
        graphics.lineStyle(4, 0xffd900, 1);
        graphics.drawRect(0, 0, bounds.width, bounds.height);

        this.cursors = game.input.keyboard.createCursorKeys();
    }
    render() {
        this.game.debug.geom(this.circle, '#cfffff');
    }
    update() {
        this.whiteBall.body.setZeroVelocity();

        if (this.cursors.left.isDown) {
            this.whiteBall.body.moveLeft(200);
        }
        else if (this.cursors.right.isDown) {
            this.whiteBall.body.moveRight(200);
        }

        if (this.cursors.up.isDown) {
            this.whiteBall.body.moveUp(200);
        }
        else if (this.cursors.down.isDown) {
            this.whiteBall.body.moveDown(200);
        }
    }
    init() {
        const conf = this.conf;

        this.game = new Phaser.Game(conf.width, conf.height, Phaser.AUTO, conf.name,{
            preload: this.preload,
            create: this.create,
            render: this.render,
            update: this.update
        });
    }
}