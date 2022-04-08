class Tetris {
  constructor() {
    let lastTime = 0;
    //base on the time, keep change the shape and matrix
    const update = (time = 0) => {
      const tempTime = time - lastTime;
      lastTime = time;

      player.Update(tempTime);

      this.Draw();
      requestAnimationFrame(update);
    };

    update();
  }

  //total drawing of the game. update function, and draw continuously. Visualize the matrix
  Draw() {
    context.fillStyle = '#000';
    context.fillRect(0, 0, canvas.width, canvas.height);
    this.drawMatrix(arena.matrix, {x: 0, y: 0});
    this.drawMatrix(player.matrix, player.pos);
  };

  //drawing matrix on the draw funtion
  drawMatrix(matrix, offset) {
    matrix.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          context.fillStyle = colors[value];
          context.fillRect(x + offset.x, y + offset.y, 1, 1);
        }
      });
    });
  };
}