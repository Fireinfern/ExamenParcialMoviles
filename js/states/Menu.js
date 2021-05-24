Menu = function(game) {};

Menu.prototype = {
    create: function() {
        this.background = this.game.add.sprite(0,0, "background");
        this.background.width = this.game.width;
        this.background.height = this.game.height;

        this.title = this.game.add.text(0,this.game.height - 50, 'Examen Parcial', {font: '20px sans-serif'});
        this.jugar = this.game.add.text(this.game.width / 2, this.game.height - 50, 'Jugar', {font: '20px sans-serif'})
        this.scores = this.game.add.text(this.game.width -200, this.game.height - 50, 'Ver Puntajes', {font: '20px sans-serif'})
        
        this.jugar.inputEnabled = true;
        this.jugar.events.onInputDown.add(this.iniciar, this);

        this.scores.inputEnabled = true;
        this.scores.events.onInputDown.add(this.openScores, this);

    },
    iniciar: function(){
        this.game.state.start("Seleccion");
    },
    openScores(){
        this.game.state.start("Scores");
    }
}