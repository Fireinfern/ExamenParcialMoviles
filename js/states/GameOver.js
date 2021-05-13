GameOver = function (game) { };

GameOver.prototype = {
    create: function () {
        this.Title = this.game.add.text(this.game.width / 2, this.game.height / 2, "Game Over")
        this.Title.anchor.setTo(0.5);
        this.Title.addColor("#ffffff", 0);
        this.score = this.game.add.text(this.game.width / 2, this.game.height / 2 + 100, "Score: " + this.game.finalScore);
        this.score.anchor.setTo(0.5);
        this.score.addColor("#ffffff", 0);
        this.timeout = 3000;
    },
    update: function() {
        if(this.timeout <= 0){
            this.game.state.start("Menu");
        }
        this.timeout -= this.game.time.elapsed;
    }
};