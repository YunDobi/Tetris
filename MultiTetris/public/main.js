const tetrisManager = new TetrisManager(document);
const localTetris = tetrisManager.createPlayer();
localTetris.element.classList.add('local');
localTetris.run();

const connectionManager = new Connection(tetrisManager);
connectionManager.connect(`ws://localhost:9000/`);

//38 is up
document.addEventListener('keydown', event => {
  [
    [37, 39, 40, 38]
  ].forEach((key, index) => {
    const player = localTetris.player;
    //left
    if (event.keyCode === key[0]) {
      player.Move(-1);
      //right
    } else if (event.keyCode === key[1]) {
      player.Move(1);
      //up
    } else if (event.keyCode === key[3]) {
      player.Rotate(-1);
    } 

    if (event.keyCode === key[2]) {
      if (event.type === 'keydown') {
        player.Drop();
        player.dropInterval = player.dropFast;
        document.addEventListener('keyup', () => {
          player.dropInterval = player.dropSlow;
        });
      }
    }
  });
});
