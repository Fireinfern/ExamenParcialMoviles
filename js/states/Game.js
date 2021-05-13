Game = function (game) { };

Game.prototype = {
    create: function () {
        this.timer = 0;
        this.waveTime = 0;
        this.wave = -1;
        this.wavesLeft = 0;
        this.mobsLeft = 0;
        this.lives = this.game._vidasIniciales;
        this.score = 0;
        this.bulletCooldown = 0;

        this.background = this.game.add.sprite(0, 0, "background");
        this.background.width = this.game.width;
        this.background.height = this.game.height;

        this.timerText = this.game.add.text(this.game.width - 170, 0, 'Time:' + (this.timer / 1000));
        this.timerText.addColor('#ffffff', 0);
        this.livesText = this.game.add.text(0, 0, 'Vidas: ' + this.lives);
        this.livesText.addColor('#ffffff', 0);
        this.scoreText = this.game.add.text(this.game.width / 2 - 100, 0, "Score: " + this.score);
        this.scoreText.addColor('#ffffff', 0);

        this.tiles = JSON.parse(this.game.cache.getText('platformData'));
        this.enemyWaves = JSON.parse(this.game.cache.getText('waves'));

        this.keyInputs = this.game.input.keyboard.createCursorKeys();
        // Shoot Keys
        this.A = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
        this.A.onDown.add(() => {
            if (this.bulletCooldown <= 0) {
                this.bulletCooldown = 500;
                this.createBullet("brown");
            }
        }, this);
        this.S = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
        this.S.onDown.add(() => {
            if (this.bulletCooldown <= 0) {
                this.bulletCooldown = 500;
                this.createBullet("cream");
            }
        }, this);
        this.D = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
        this.D.onDown.add(() => {
            if (this.bulletCooldown <= 0) {
                this.bulletCooldown = 500;
                this.createBullet("fly");
            }
        }, this);
        this.F = this.game.input.keyboard.addKey(Phaser.Keyboard.F);
        this.F.onDown.add(() => {
            if (this.bulletCooldown <= 0) {
                this.bulletCooldown = 500;
                this.createBullet("red");
            }
        }, this);
        this.G = this.game.input.keyboard.addKey(Phaser.Keyboard.G);
        this.G.onDown.add(() => {
            if (this.bulletCooldown <= 0) {
                this.bulletCooldown = 500;
                this.createBullet("yellow");
            }
        }, this);

        this.gravity = 400;
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.dude = this.game.add.sprite(this.game.width / 2, this.game.height / 2, 'dude');
        this.dude.frame = 0;
        this.dude.anchor.setTo(0.5);
        this.dude.animations.add("idle", [4], 10, true);
        this.dude.animations.play("idle");
        this.dude.direction = "up";
        this.dude.animations.add("walkLeft", [0, 1, 2, 3], 5, true);
        this.dude.animations.add("walkRight", [5, 6, 7, 8], 5, true);

        this.platforms = this.game.add.group();
        this.tiles.platforms.forEach((element) => {
            let tile = this.game.add.sprite(element.x, element.y, element.sprite);
            this.platforms.add(tile);
        }, this);

        this.redEnemies = this.game.add.group();
        this.yellowEnemies = this.game.add.group();
        this.flyEnemies = this.game.add.group();
        this.creamEnemies = this.game.add.group();
        this.brownEnemies = this.game.add.group();

        this.bullets = this.game.add.group();

        this.game.physics.arcade.enable(this.platforms);
        this.platforms.enableBody = true;
        this.platforms.setAll("body.immovable", true);
        this.game.physics.arcade.enable(this.dude);
        this.dude.body.gravity.y = this.gravity
    },
    update: function () {
        if (this.lives <= 0) {
            this.game.finalScore = this.score;
            this.game.state.start("GameOver");
        }

        if (this.bulletCooldown > 0) {
            this.bulletCooldown -= this.game.time.elapsed;
        }

        // Colisiones
        // Colisiones con el piso
        this.game.physics.arcade.collide(this.dude, this.platforms);
        this.game.physics.arcade.collide(this.redEnemies, this.platforms);
        this.game.physics.arcade.collide(this.yellowEnemies, this.platforms);

        // Colisiones que dañan al personaje
        this.game.physics.arcade.overlap(this.dude, this.redEnemies, this.quitarVida, () => { return true; }, this);
        this.game.physics.arcade.overlap(this.dude, this.yellowEnemies, this.quitarVida, () => { return true; }, this);
        this.game.physics.arcade.overlap(this.dude, this.flyEnemies, this.quitarVida, () => { return true; }, this);
        this.game.physics.arcade.overlap(this.dude, this.brownEnemies, this.quitarVida, () => { return true; }, this);
        this.game.physics.arcade.overlap(this.dude, this.creamEnemies, this.quitarVida, () => { return true; }, this);

        // Colisiones de Balas con enemigos
        this.game.physics.arcade.overlap(this.bullets, this.redEnemies, this.killEnemy, (a, b) => { return a.nombre == "red" }, this);
        this.game.physics.arcade.overlap(this.bullets, this.yellowEnemies, this.killEnemy, (a, b) => { return a.nombre == "yellow" }, this);
        this.game.physics.arcade.overlap(this.bullets, this.brownEnemies, this.killEnemy, (a, b) => { return a.nombre == "brown" }, this);
        this.game.physics.arcade.overlap(this.bullets, this.creamEnemies, this.killEnemy, (a, b) => { return a.nombre == "cream" }, this);
        this.game.physics.arcade.overlap(this.bullets, this.flyEnemies, this.killEnemy, (a, b) => { return a.nombre == "fly" }, this);

        // Inputs de Movimiento
        if (this.keyInputs.up.isDown && this.dude.body.touching.down) {
            this.dude.body.velocity.y = -350;
        }
        if (this.keyInputs.left.isDown) {
            this.dude.animations.play("walkLeft");
            this.dude.body.velocity.x = -200;
            this.dude.direction = "left";
        }
        else if (this.keyInputs.right.isDown) {
            this.dude.animations.play("walkRight");
            this.dude.body.velocity.x = 200;
            this.dude.direction = "right";
        }
        else {
            this.dude.body.velocity.x = 0;
            this.dude.animations.play("idle");
            this.dude.direction = "up";
        }
        // Updates del Timer
        this.timer += this.game.time.elapsed;
        this.timerUpdate();
        this.createWave();
    },
    // Actualiza el texto del Timer
    timerUpdate: function () {
        this.timerText.setText('Time:' + (this.timer / 1000));
    },
    // Crea la siguiente Ola de enemigos
    createWave: function () {
        if (this.mobsLeft <= 0) {
            this.wave++;
            try{
                this.waveTime = this.enemyWaves.oleadas[this.wave].time * 1000;
                this.wavesLeft = this.enemyWaves.oleadas[this.wave].oleadas - 1;
                this.mobsLeft = this.enemyWaves.oleadas[this.wave].enemigos * this.enemyWaves.oleadas[this.wave].oleadas;
                this.spawnWave();
            }
            catch{
                this.wave = 0;
            }
        }
        if (this.waveTime <= 0 && this.wavesLeft > 0) {
            this.spawnWave();
            this.waveTime = this.enemyWaves.oleadas[this.wave].time * 1000;
            this.wavesLeft--;

        }
        this.waveTime -= this.game.time.elapsed;
    },
    // Spawnea los enemigos de la Ola
    spawnWave: function () {
        console.log(this.enemyWaves.oleadas[this.wave].enemigos);
        let Wave = this.enemyWaves.oleadas[this.wave];
        for (let index = 0; index < Wave.enemigos; index++) {
            // Elige el tipo de enemigo que se creara
            let col = this.game.rnd.integerInRange(0, Wave.color.length - 1);
            // Crea el lugar de Donde van a salir
            let dir = this.game.rnd.integerInRange(0, 1);
            // Enemigo
            let e;
            switch (col) {
                // Enemigo Rojo
                case 0:
                    e = this.game.add.sprite(this.game.width * dir + (-(dir * 2 - 1) * this.game.rnd.integerInRange(10, 100)), 450, Wave.color[col]);
                    e.anchor.setTo(0.5, 0.5);
                    e.scale.setTo(0.5);
                    this.game.physics.arcade.enable(e);
                    e.body.gravity.y = this.gravity;
                    e.body.velocity.x = -(dir * 2 - 1) * 100;
                    e.checkWorldBounds = true;
                    this.redEnemies.add(e);
                    e.events.onOutOfBounds.add(() => {
                        e.destroy();
                    });
                    e.events.onDestroy.add(() => {
                        this.redEnemies.remove(e);
                        this.mobsLeft--;
                    });
                    break;
                case 1:
                    e = this.game.add.sprite(this.game.width * dir + (-(dir * 2 - 1) * this.game.rnd.integerInRange(10, 100)), 450, Wave.color[col]);
                    e.anchor.setTo(0.5, 0.5);
                    e.scale.setTo(0.5);
                    this.game.physics.arcade.enable(e);
                    e.body.gravity.y = this.gravity;
                    e.body.velocity.x = -(dir * 2 - 1) * 100;
                    e.checkWorldBounds = true;
                    this.yellowEnemies.add(e);
                    e.events.onOutOfBounds.add(() => {
                        e.destroy();
                    });
                    e.events.onDestroy.add(() => {
                        this.redEnemies.remove(e);
                        this.mobsLeft--;
                    });
                    break;
                case 2:
                    e = this.game.add.sprite(this.game.width * dir + (-(dir * 2 - 1) * this.game.rnd.integerInRange(10, 100)), this.game.height / 2, Wave.color[col]);
                    e.anchor.setTo(0.5, 0.5);
                    e.scale.setTo(0.5);
                    this.game.physics.arcade.enable(e);
                    e.body.velocity.x = -(dir * 2 - 1) * 100;
                    e.checkWorldBounds = true;
                    this.flyEnemies.add(e);
                    e.events.onOutOfBounds.add(() => {
                        e.destroy();
                    });
                    e.events.onDestroy.add(() => {
                        this.redEnemies.remove(e);
                        this.mobsLeft--;
                    });
                    break;
                case 3:
                    e = this.game.add.sprite(this.game.rnd.integerInRange(50, 750), 550, Wave.color[col]);
                    e.anchor.setTo(0.5, 0.5);
                    e.scale.setTo(0.5);
                    this.game.physics.arcade.enable(e);
                    e.body.gravity.y = -this.gravity;
                    e.checkWorldBounds = true;
                    this.brownEnemies.add(e);
                    e.events.onOutOfBounds.add(() => {
                        e.destroy();
                    });
                    e.events.onDestroy.add(() => {
                        this.redEnemies.remove(e);
                        this.mobsLeft--;
                    });
                    break;
                case 4:
                    e = this.game.add.sprite(this.game.rnd.integerInRange(50, 750), 0, Wave.color[col]);
                    e.anchor.setTo(0.5, 0.5);
                    e.scale.setTo(0.5);
                    this.game.physics.arcade.enable(e);
                    e.body.gravity.y = this.gravity;
                    e.checkWorldBounds = true;
                    this.creamEnemies.add(e);
                    e.events.onOutOfBounds.add(() => {
                        e.destroy();
                    });
                    e.events.onDestroy.add(() => {
                        this.redEnemies.remove(e);
                        this.mobsLeft--;
                    });
                    break;
            }

        }

    },
    quitarVida: function (a, b) {
        this.lives--;
        this.livesText.setText('Vidas: ' + this.lives);
        b.destroy();
    },
    createBullet: function (bullet) {
        let b;
        let dir = this.setBulletDirection();
        switch (bullet) {
            case "red":
                b = new Bullet(this.game, this.dude.x, this.dude.y, "bulletred", dir, "red");
                this.bullets.add(b);
                b.events.onDestroy.add(() => {
                    this.bullets.remove(b);
                });
                break;
            case "yellow":
                b = new Bullet(this.game, this.dude.x, this.dude.y, "bulletyellow", dir, "yellow");
                this.bullets.add(b);
                b.events.onDestroy.add(() => {
                    this.bullets.remove(b);
                });
                break;
            case "fly":
                b = new Bullet(this.game, this.dude.x, this.dude.y, "bulletfly", dir, "fly");
                this.bullets.add(b);
                b.events.onDestroy.add(() => {
                    this.bullets.remove(b);
                });
                break;
            case "brown":
                b = new Bullet(this.game, this.dude.x, this.dude.y, "bulletbrown", dir, "browm");
                this.bullets.add(b);
                b.events.onDestroy.add(() => {
                    this.bullets.remove(b);
                });
                break;
            case "cream":
                b = new Bullet(this.game, this.dude.x, this.dude.y, "bulletcream", dir, "cream");
                //b.scale.setTo(2);
                this.bullets.add(b);
                b.events.onDestroy.add(() => {
                    this.bullets.remove(b);
                });
                break;
        }
    },
    killEnemy: function (a, b) {
        switch (a.nombre) {
            case "red":
                this.score += 10;
                this.scoreText.setText("Score: " + this.score);
                break;
            case "cream":
                this.score += 20;
                this.scoreText.setText("Score: " + this.score);
                break;
            case "yellow":
                this.score += 15;
                this.scoreText.setText("Score: " + this.score);
                break;
            case "brown":
                this.score += 5;
                this.scoreText.setText("Score: " + this.score);
                break;
            case "fly":
                this.score += 50;
                this.scoreText.setText("Score: " + this.score);
                break;
        }
        a.kill();
        b.destroy();
    },
    setBulletDirection: function () {
        if (this.dude.direction == "left") {
            return [-1, 0];
        }
        if (this.dude.direction == "right") {
            return [1, 0];
        }
        return [0, -1];
    }
};