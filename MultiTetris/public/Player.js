//player will can be other, so create new files
class Players {
  constructor() {
    this.dropCounter = 0;
    this.dropInterval = 1000;

    this.pos = {x: 0, y: 0},
    this.matrix = null,
    this.score = 0;

    this.Reset();
  }

  Move(dir) {
    this.pos.x += dir;
    if (arena.Checker(this)) {
      this.pos.x -= dir;
    }
  }

  //adding rotation
  Rotate(dir) {
    const pos = this.pos.x;
    let offset = 1;
    this.RotateMatrix(this.matrix, dir);

    //fixing bug of rotating in the wall
    while (arena.Checker(this)) {
      console.log(offset);
      this.pos.x += offset;
      offset = -(offset + (offset > 0 ? 1 : -1));

      if (offset > this.matrix[0].length) {
        this.RotateMatrix(this.matrix, -dir);
        // console.log(pos);
        this.pos.x = pos;
      }
    }
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
    //checking touching other block or bottom
    if (arena.Checker(this)) {
      this.pos.y --;
      arena.Merge(this);
      this.Reset();
      arena.Clear();
      updateScore();
    }
    this.dropCounter = 0;
  }

  //after the block is set and comming down new matrix
  Reset() {
    const pieces = 'TJLOSZI';
    this.matrix = createPiece(pieces[pieces.length * Math.random() | 0]);
    this.pos.y = 0;
    this.pos.x = (arena.matrix[0].length / 2 | 0) -
                  (this.matrix[0].length / 2 | 0);
    if (arena.Checker(this)) {
      arena.ClearLine();
      this.score = 0;
      updateScore();
    }
  };

  Update(tempTime) {
    this.dropCounter += tempTime;
    if (this.dropCounter > this.dropInterval) {
      this.Drop();
    }
  }
}