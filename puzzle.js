const puzzleSketch = (p) => {
  let images = [];
  let board = [];
  const cols = 3;
  const rows = 3;
  let w, h;
  let emptySlot = { r: 2, c: 0 }; 

  let moveHistory = [];       
  let isSolving = false;      
  let lastSolveTime = 0;      
  const solveDelay = 1500;     

  p.preload = () => {
    for (let i = 1; i <= 8; i++) {
      images.push(p.loadImage(`bild${i}.jpg`)); 
    }
  };

  p.setup = () => {
    let container = document.getElementById('puzzle-holder');
    let containerWidth = container ? container.clientWidth : p.windowWidth;
    if (containerWidth === 0) containerWidth = p.windowWidth;

    let canvasSize = p.min(600, containerWidth);
    let canvas = p.createCanvas(canvasSize, canvasSize);
    canvas.parent('puzzle-holder');
    
    calculateGrid();
    startNewGame();
  };

  function startNewGame() {
    resetToSolved();
    shuffleBoard();
  }

  function resetToSolved() {
    let index = 0;
    for (let r = 0; r < rows; r++) {
      board[r] = [];
      for (let c = 0; c < cols; c++) {
        if (r === 2 && c === 0) {
          board[r][c] = -1; 
        } else {
          board[r][c] = index;
          index++;
        }
      }
    }
    emptySlot = { r: 2, c: 0 };
    moveHistory = []; 
    isSolving = false;
  }

  function checkIsSolved() {
    let index = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (r === 2 && c === 0) {
          if (board[r][c] !== -1) return false;
        } else {
          if (board[r][c] !== index) return false;
          index++;
        }
      }
    }
    return true;
  }

  p.draw = () => {
    if (isSolving) {
      let currentTime = p.millis();
      if (currentTime - lastSolveTime > solveDelay) {
        if (moveHistory.length > 0) {
          let prevEmptySlot = moveHistory.pop();
          moveTile(prevEmptySlot.r, prevEmptySlot.c, false);
          lastSolveTime = currentTime;
        } else {
          isSolving = false; 
        }
      }
    }

    p.background(0); 

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        let imgIndex = board[r][c];
        
        if (imgIndex !== -1) {
          p.image(images[imgIndex], c * w, r * h, w, h);
        } else {
          p.fill(0);
          p.rect(c * w, r * h, w, h);
        }

        p.stroke(255, 50);
        p.noFill();
        p.rect(c * w, r * h, w, h);
      }
    }
  };

  p.mousePressed = () => {
    if (isSolving) return;

    // Nur reagieren, wenn der Klick auch auf diesem Canvas stattfindet
    if (p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= 0 && p.mouseY <= p.height) {
      let c = p.floor(p.mouseX / w);
      let r = p.floor(p.mouseY / h);

      if (c >= 0 && c < cols && r >= 0 && r < rows) {
        if (isAdjacent(r, c, emptySlot.r, emptySlot.c)) {
          moveTile(r, c, false);
        }
      }
    }
  };

  p.doubleClicked = () => {
    if (isSolving) return;

    if (p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= 0 && p.mouseY <= p.height) {
      let c = p.floor(p.mouseX / w);
      let r = p.floor(p.mouseY / h);

      if (r === emptySlot.r && c === emptySlot.c) {
        if (checkIsSolved()) {
          startNewGame();
        } else if (moveHistory.length > 0) {
          isSolving = true;
          lastSolveTime = p.millis();
        }
      }
    }
  };

  function isAdjacent(r1, c1, r2, c2) {
    let dRow = p.abs(r1 - r2);
    let dCol = p.abs(c1 - c2);
    return (dRow === 1 && dCol === 0) || (dRow === 0 && dCol === 1);
  }

  function moveTile(r, c, record = false) {
    if (record) {
      moveHistory.push({ r: emptySlot.r, c: emptySlot.c });
    }
    board[emptySlot.r][emptySlot.c] = board[r][c];
    board[r][c] = -1;
    emptySlot = { r: r, c: c };
  }

  function shuffleBoard() {
    for (let i = 0; i < 40; i++) {
      let validMoves = [];
      let r = emptySlot.r;
      let c = emptySlot.c;

      if (r > 0) validMoves.push({ r: r - 1, c: c });
      if (r < rows - 1) validMoves.push({ r: r + 1, c: c });
      if (c > 0) validMoves.push({ r: r, c: c - 1 });
      if (c < cols - 1) validMoves.push({ r: r, c: c + 1 });

      let randomMove = p.random(validMoves);
      moveTile(randomMove.r, randomMove.c, true);
    }
  }

  p.windowResized = () => {
    let container = document.getElementById('puzzle-holder');
    let containerWidth = container ? container.clientWidth : p.windowWidth;
    if (containerWidth === 0) containerWidth = p.windowWidth;

    let canvasSize = p.min(600, containerWidth);
    p.resizeCanvas(canvasSize, canvasSize);
    calculateGrid();
  };

  function calculateGrid() {
    w = p.width / cols;
    h = p.height / rows;
  }
};

// Startet die Puzzle-Instanz
new p5(puzzleSketch);
