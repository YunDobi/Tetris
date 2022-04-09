
const createPiece = function(type) {
  if (type === 'T') {
    return [
      [0, 0, 0],
      [1, 1, 1],
      [0, 1, 0],
    ];
  } else if (type === 'O') {
    return [
      [2, 2],
      [2, 2],
    ];
  } else if (type === 'L') {
    return [
      [0, 3, 0],
      [0, 3, 0],
      [0, 3, 3],
    ];
  } else if (type === 'J') {
    return [
      [0, 4, 0],
      [0, 4, 0],
      [4, 4, 0],
    ];
  } else if (type === 'I') {
    return [
      [0, 5, 0, 0],
      [0, 5, 0, 0],
      [0, 5, 0, 0],
      [0, 5, 0, 0],
    ];
  } else if (type === 'S') {
    return [
      [0, 6, 6],
      [6, 6, 0],
      [0, 0, 0],
    ];
  } else if (type === 'Z') {
    return [
      [7, 7, 0],
      [0, 7, 7],
      [0, 0, 0],
    ];
  }
};


const tetri = [];

const playerElements = document.querySelectorAll(".player");
[...playerElements].forEach(element => {
  const tetris = new Tetris(element);
  tetri.push(tetris);
});


//38 is up
document.addEventListener('keydown', event => {
  [
    [37, 39, 40, 38]
  ].forEach((key, index) => {
    const player = tetri[index].player;
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
