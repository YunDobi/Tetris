class TetrisManager {
  constructor(document) {
    this.document = document;

    this.template = document.getElementById('player-template');
    
    this.instance = new Set;
    
    //init the tetris
    const playerElements = document.querySelectorAll(".player");
    [...playerElements].forEach(element => {
      const tetris = new Tetris(element);
      this.instance.push(tetris);
    });
  }

  //acess to the player-template > player
  createPlayer() {
    const element = this.document.importNode(this.template.content, true).children[0];

    const tetris = new Tetris(element);
    this.instance.add(tetris);

    this.document.body.appendChild(tetris.element);

    return tetris;
  }

  removePlayer(tetris) {
    this.instance.delete(tetris);
    this.document.body.removeChild(tetris.element);

  }
}