const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

context.scale(20,20);

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

const colors = [
  null,
  '#FF0D72',
  '#0DC2FF',
  '#0DFF72',
  '#F538FF',
  '#FF8E0D',
  '#FFE138',
  '#3877FF',
];

const arena = new Arena(12, 20);

const player = new Players;

const tetris = new Tetris;


const updateScore = () => {
  document.getElementById("score").innerHTML = player.score;
};


document.addEventListener('keydown', event => {
  if (event.keyCode === 37) {
    player.Move(-1);
  } else if (event.keyCode === 39) {
    player.Move(1);
  } else if (event.keyCode === 40) {
    player.Drop();
  } else if (event.keyCode === 38) {
    player.Rotate(-1);
  }
});

updateScore();
