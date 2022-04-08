class Tetris {
  constructor(canvas) {

    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    this.context.scale(20,20);

    this.arena = new Arena(12, 20);
    this.player = new Players(this);

    this.colors = [
      null,
      '#FF0D72',
      '#0DC2FF',
      '#0DFF72',
      '#F538FF',
      '#FF8E0D',
      '#FFE138',
      '#3877FF',
    ];

    let lastTime = 0;
    //base on the time, keep change the shape and matrix
    const update = (time = 0) => {
      const tempTime = time - lastTime;
      lastTime = time;

      this.player.Update(tempTime);

      this.Draw();
      requestAnimationFrame(update);
    };

    update();
  }

  //total drawing of the game. update function, and draw continuously. Visualize the matrix
  Draw() {
    this.context.fillStyle = '#000';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawMatrix(this.arena.matrix, {x: 0, y: 0});
    this.drawMatrix(this.player.matrix, this.player.pos);
  };

  //drawing matrix on the draw funtion
  drawMatrix(matrix, offset) {
    matrix.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          this.context.fillStyle = this.colors[value];
          this.context.fillRect(x + offset.x, y + offset.y, 1, 1);
        }
      });
    });
  };
}