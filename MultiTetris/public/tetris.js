const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
console.log(context)

context.scale(20,20);

//clear if the line is all "1"
const arenaclear = () => {
  let rowCounter = 1;
  outerloop: for (let i = 0; i < arena.length; i++) {
    for (let x = 0; x < arena[i].length; x++) {
      if (arena[i][x] === 0) {
        continue outerloop;
      }
    }
    const row = arena.splice(i, 1)[0].fill(0);
    arena.unshift(row);
    i++;

    Player.score += rowCounter * 10;
    rowCounter *= 2;
  }
};

const createPiece = (type) => {
  if (type === 'I') {
    return [
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
    ];
  } else if (type === 'L') {
    return [
      [0, 2, 0],
      [0, 2, 0],
      [0, 2, 2],
    ];
  } else if (type === 'J') {
    return [
      [0, 3, 0],
      [0, 3, 0],
      [3, 3, 0],
    ];
  } else if (type === 'O') {
    return [
      [4, 4],
      [4, 4],
    ];
  } else if (type === 'Z') {
    return [
      [5, 5, 0],
      [0, 5, 5],
      [0, 0, 0],
    ];
  } else if (type === 'S') {
    return [
      [0, 6, 6],
      [6, 6, 0],
      [0, 0, 0],
    ];
  } else if (type === 'T') {
    return [
      [0, 7, 0],
      [7, 7, 7],
      [0, 0, 0],
    ];
  }
};


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
        context.fillStyle = colors[value];
        context.fillRect(x + offset.x, y + offset.y, 1, 1);
      }
    });
  });
};

//adding rotation
const playerotate = (dir) => {
  const pos = Player.pos.x;
  let offset = 1;
  rotate(Player.matrix, dir);

  //fixing bug of rotating in the wall
  while (checker(arena, Player)) {
    console.log(offset);
    Player.pos.x += offset;
    offset = -(offset + (offset > 0 ? 1 : -1));

    if (offset > Player.matrix[0].length) {
      rotate(Player.matrix, -dir);
      console.log(pos);
      Player.pos.x = pos;
    }
  }

};

const rotate = (matrix, dir) => {
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < y; x++) {
      [
        matrix[x][y],
        matrix[y][x],
      ] = [
        matrix[y][x],
        matrix[x][y],
      ];
    }
  }
  if (dir > 0) {
    matrix.forEach(row => row.reverse());
  } else {
    matrix.reverse();
  }
}


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
    playereset();
    arenaclear();
    updateScore();
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
  matrix: null,
  score: 0
};

//after the block is set and comming down new matrix
const playereset = () => {
  const pieces = 'TJLOSZI';
  Player.matrix = createPiece(pieces[pieces.length * Math.random() | 0]);
  Player.pos.y = 0;
  Player.pos.x = (arena[0].length / 2 | 0) -
                 (Player.matrix[0].length / 2 | 0);
  if (checker(arena, Player)) {
    arena.forEach(row => row.fill(0));
    Player.score = 0;
    updateScore();
  }
};

const playerMove = (dir) => {
  Player.pos.x += dir;
  if (checker(arena, Player)) {
    Player.pos.x -= dir;
  }
};

const updateScore = () => {
  document.getElementById("score").innerHTML = Player.score;
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

document.addEventListener('keydown', event => {
  if (event.keyCode === 37) {
    playerMove(-1);
  } else if (event.keyCode === 39) {
    playerMove(1);
  } else if (event.keyCode === 40) {
    PlayerDrop();
  } else if (event.keyCode === 38) {
    playerotate(-1);
  }
});

playereset();
updateScore();
update();