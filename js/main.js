window.onload = () => {
    let game = new Phaser.Game(800, 600, Phaser.AUTO);
    game.state.add("Preload", Preload);
    game.state.add("Menu", Menu);
    game.state.add("Scores", Scores);
    game.state.add("Seleccion", Seleccion);
    game.state.add("Game", Game);
    game.state.add("GameOver", GameOver);
    game.state.start("Preload");
}