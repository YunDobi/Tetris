class Arena {

  constructor(w,h) {
    //creating the table? arean
    const matrix = [];
    while (h > 0) {
      matrix.push(new Array(w).fill(0));
      h--;
    }
    this.matrix = matrix;

    this.event = new Events;
  }

  //checking touching other blocke or bottom
  Checker(player) {
    const m = player.matrix;
    const o = player.pos;
    for (let y = 0; y < m.length; y++) {
      for (let x = 0; x < m[y].length; x++) {
        if (m[y][x] !== 0 &&
          (this.matrix[y + o.y] &&
            this.matrix[y + o.y][x + o.x]) !== 0) {
          return true;
        }
      }
    }
    return false;
  }

  //clear if the line is all "1"
  Clear() {
    let rowCounter = 1;
    let score = 0;
    outerloop: for (let i = 0; i < this.matrix.length; i++) {
      for (let x = 0; x < this.matrix[i].length; x++) {
        if (this.matrix[i][x] === 0) {
          continue outerloop;
        }
      }
      const row = this.matrix.splice(i, 1)[0].fill(0);
      this.matrix.unshift(row);
      i++;

      score += rowCounter * 10;
      rowCounter *= 2;
    }
    this.event.emit("matrix", this.matrix);
    return score;
  }

  ClearLine() {
    this.matrix.forEach(row => row.fill(0));
    console.log("clear")
    this.event.emit("matrix", this.matrix);
  }

  //merging the arean that created and player which is in the canvas
  Merge(player) {
    player.matrix.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          this.matrix[y + player.pos.y][x + player.pos.x] = value;
        }
      });
    });
    this.event.emit("matrix", this.matrix);
  };
}
