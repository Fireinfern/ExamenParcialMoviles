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

        this.database = firebase.database();
        this.addScore();
    },
    update: function() {
        if(this.timeout <= 0){
            this.game.state.start("Menu");
        }
        this.timeout -= this.game.time.elapsed;
    },
    addScore(){
        let date = Date.now();
        let id = this.game.rnd.integerInRange(1000,9000);
        this.database.ref(id.toString(16)).set({
            created_at: date,
            score: this.game.finalScore,
            user_id: id.toString(16)
        })
    }
};