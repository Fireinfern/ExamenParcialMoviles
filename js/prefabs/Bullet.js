Bullet = function (game, x, y, type, dir, nombre) {
    Phaser.Sprite.call(this, game, x, y, type);
    this.game = game;
    this.game.physics.arcade.enable(this);
    this.body.velocity.x = dir[0] * 300;
    this.body.velocity.y = dir[1] * 300;
    this.nombre = nombre;
    this.scale.setTo(0.3);
    this.anchor.setTo(0.5);
    this.checkWorldBounds = true;
    this.events.onOutOfBounds.add(() => {
        this.destroy();
    });
}

Bullet.prototype = Object.create(Phaser.Sprite.prototype);
Bullet.prototype.constructor = Bullet;