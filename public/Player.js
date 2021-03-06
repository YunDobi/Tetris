//player will can be other, so create new files
class Players {
  constructor(tetris) {

    this.dropSlow = 1000;
    this.dropFast = 50;

    this.event = new Events();

    this.tetris = tetris;
    this.arena = tetris.arena;

    this.dropCounter = 0;
    this.dropInterval = this.dropSlow;

    this.pos = {x: 0, y: 0},
    this.matrix = null,
    this.score = 0;

    this.Reset();
  }

  Move(dir) {
    this.pos.x += dir;
    if (this.arena.Checker(this)) {
      this.pos.x -= dir;
      return;
    }
    this.event.emit('pos', this.pos);
  }

  //adding rotation
  Rotate(dir) {
    const pos = this.pos.x;
    let offset = 1;
    this.RotateMatrix(this.matrix, dir);

    //fixing bug of rotating in the wall
    while (this.arena.Checker(this)) {
      console.log(offset);
      this.pos.x += offset;
      offset = -(offset + (offset > 0 ? 1 : -1));

      if (offset > this.matrix[0].length) {
        this.RotateMatrix(this.matrix, -dir);
        // console.log(pos);
        this.pos.x = pos;
      }
    }
    this.event.emit('matrix', this.matrix);
  }


  RotateMatrix(matrix, dir) {
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
  
  //moving to the bottom and referesh
  Drop() {
    this.pos.y ++;
    this.dropCounter = 0;
    //checking touching other block or bottom
    if (this.arena.Checker(this)) {
      this.pos.y --;
      this.arena.Merge(this);
      this.Reset();
      this.score += this.arena.Clear();

      this.event.emit('score', this.score);
      return;
    }
    this.event.emit('pos', this.pos);
  }

  //after the block is set and comming down new matrix
  Reset() {
    const pieces = 'TJLOSZI';
    this.matrix = this.tetris.CreatePiece(pieces[pieces.length * Math.random() | 0]);
    this.pos.y = 0;
    this.pos.x = (this.arena.matrix[0].length / 2 | 0) -
                  (this.matrix[0].length / 2 | 0);


    //if the loss, reset the arena
    if (this.arena.Checker(this)) {
      this.arena.ClearLine();
      this.score = 0;
      this.event.emit('score', this.score);
    }

    this.event.emit('pos', this.pos);
    this.event.emit('matrix', this.matrix);
  }

  Update(tempTime) {
    this.dropCounter += tempTime;
    if (this.dropCounter > this.dropInterval) {
      this.Drop();
    }
  }
}