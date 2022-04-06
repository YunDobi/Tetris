const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
console.log(context)

context.scale(20,20);


const matrix = [
  [0,0,0],
  [1,1,1],
  [0,1,0]
];

//checking touching other blocke or bottom
const checker = function(arena, player) {
  const m = player.matrix;
  const o = player.pos;
  for (let y = 0; y < m.length; y++) {
    for (let x = 0; x < m[y].length; x++) {
      if (m[y][x] !== 0 &&
        (arena[y + o.y] &&
          arena[y + o.y][x + o.x]) !== 0) {
        return true;
      }
    }
  }
  return false;
};

//creating the table? arean
const createMatrix = (w, h) => {
  const matrix = [];
  while (h > 0) {
    matrix.push(new Array(w).fill(0));
    h--;
  }
  return matrix;
};

//total drawing of the game. update function, and draw continuously. Visualize the matrix
const draw = () => {
  context.fillStyle = '#000';
  context.fillRect(0, 0, canvas.width, canvas.height);
  drawMatrix(arena, {x: 0, y: 0});
  drawMatrix(Player.matrix, Player.pos);
};

//drawing matrix on the draw funtion
const drawMatrix = function(matrix, offset) {
  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        context.fillStyle = 'red';
        context.fillRect(x + offset.x, y + offset.y, 1, 1);
      }
    });
  });
};


let lastTime = 0;

let dropCounter = 0;
let dropInterval = 1000;

//moving to the bottom and referesh
const PlayerDrop = function() {
  Player.pos.y ++;
  //checking touching other block or bottom
  if (checker(arena, Player)) {
    Player.pos.y --;
    merge(arena, Player);
    // console.log(arena)
    // console.log(Player)
    Player.pos.y = 0;
  }
  dropCounter = 0;
};

//base on the time, keep change the shape and matrix
const update = (time = 0) => {
  const tempTime = time - lastTime;
  lastTime = time;

  dropCounter += tempTime;
  if (dropCounter > dropInterval) {
    PlayerDrop();
  }

  lastTime = time;

  draw();
  requestAnimationFrame(update);
};

const arena = createMatrix(12, 20);

//merging the arean that created and player which is in the canvas
const merge = function(arena, player) {
  player.matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        arena[y + player.pos.y][x + player.pos.x] = value;
      }
    });
  });
};

//player will can be other, so create new files
const Player = {
  pos: {x: 5, y: 5},
  matrix: matrix
};

const playerMove = (dir) => {
  Player.pos.x += dir;
  if (checker(arena, Player)) {
    Player.pos.x -= dir;
  }
};

document.addEventListener('keydown', event => {
  if (event.keyCode === 37) {
    playerMove(-1);
} else if (event.keyCode === 39) {
    playerMove(1);
} else if (event.keyCode === 40) {
    PlayerDrop();
  }
})

update()