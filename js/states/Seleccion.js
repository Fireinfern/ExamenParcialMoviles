Seleccion = function(game) {};

Seleccion.prototype = {
    create: function() {
        this.background = this.game.add.sprite(0,0, "background");
        this.background.width = this.game.width;
        this.background.height = this.game.height;

        this.normal = this.game.add.text(this.game.width / 4, this.game.height - 50, 'Normal' ,{font: '20px sans-serif'});
        this.normal.anchor.setTo(0.5);
        this.normal.inputEnabled = true;
        this.normal.events.onInputDown.add(this.startNormal, this);

        this.hard = this.game.add.text(this.game.width / 2 + 100, this.game.height - 50, 'Parado y Sin Polo', {font: '20px sans-serif'});
        this.hard.anchor.setTo(0.5);
        this.hard.inputEnabled = true;
        this.hard.events.onInputDown.add(this.startHard, this);

    },
    startNormal: function() {
        this.game._vidasIniciales = 4;
        this.startGame();
    },
    startHard: function() {
        this.game._vidasIniciales = 1;
        this.startGame();
    },
    startGame: function() {
        this.game.state.start("Game");
    }
};