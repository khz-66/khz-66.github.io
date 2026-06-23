const puzzleSketch = (p) => {
  let images = [];
  let board = [];
  const cols = 3;
  const rows = 3;
  let w, h;
  let emptySlot = { r: 2, c: 0 }; 

  let solvePath = [];         
  let isSolving = false;      
  let lastSolveTime = 0;      
  const solveDelay = 120;     

  let lastClickTime = 0;
  const doubleClickThreshold = 250;

  let isSolved = false;
  let solvedAnimFrame = 0;
  const maxAnimFrames = 60; 
  const peakFrame = 55;     

  let isThinking = false;
  

  p.preload = () => {
    for (let i = 1; i <= 8; i++) {
      images.push(p.loadImage(`puzzle${i}.jpg`)); 
    }
  };

  p.setup = () => {
    let container = document.getElementById('puzzle-holder');
    let containerWidth = container ? container.clientWidth : p.windowWidth;
    if (containerWidth === 0) containerWidth = p.windowWidth;

    let canvasSize = p.min(300, containerWidth);
    let canvas = p.createCanvas(canvasSize, canvasSize);
    canvas.parent('puzzle-holder');
    
    calculateGrid();
    startNewGame();
  };

  function startNewGame() {
    resetToSolved();
    shuffleBoard();
    isSolved = false; 
    solvedAnimFrame = 0;
  }

  function resetToSolved() {
    let index = 0;
    for (let r = 0; r < rows; r++) {
      board[r] = [];
      for (let c = 0; c < cols; c++) {
        board[r][c] = (r === 2 && c === 0) ? -1 : index++;
      }
    }
    emptySlot = { r: 2, c: 0 };
    solvePath = [];
    isSolving = false;
    isThinking = false;
  }

  function checkIsSolved(b = board) {
    let index = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (r === 2 && c === 0) {
          if (b[r][c] !== -1) return false;
        } else if (b[r][c] !== index++) return false;
      }
    }
    return true;
  }

  function boardToString(b) {
    return b.flat().join(',');
  }

  function findEmpty(b) {
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++)
        if (b[r][c] === -1) return {r, c};
  }

  function solvePuzzle(startBoard) {
    if (checkIsSolved(startBoard)) return [];

    const startStr = boardToString(startBoard);
    let queue = [startBoard.map(row => [...row])];
    let visited = new Set([startStr]);
    let cameFrom = new Map([[startStr, null]]);
    let moveRecord = new Map();

    const directions = [{dr:-1,dc:0},{dr:1,dc:0},{dr:0,dc:-1},{dr:0,dc:1}];

    while (queue.length > 0) {
      let current = queue.shift();
      let currStr = boardToString(current);
      let empty = findEmpty(current);

      for (let d of directions) {
        let nr = empty.r + d.dr;
        let nc = empty.c + d.dc;
        if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;

        let newBoard = current.map(row => [...row]);
        newBoard[empty.r][empty.c] = newBoard[nr][nc];
        newBoard[nr][nc] = -1;

        let newStr = boardToString(newBoard);

        if (!visited.has(newStr)) {
          visited.add(newStr);
          queue.push(newBoard);
          cameFrom.set(newStr, currStr);
          moveRecord.set(newStr, {r: nr, c: nc});

          if (checkIsSolved(newBoard)) {
            let path = [];
            let state = newStr;
            while (cameFrom.get(state) !== null) {
              path.push(moveRecord.get(state));
              state = cameFrom.get(state);
            }
            path.reverse();
            return path;
          }
        }
      }
    }
    return [];
  }

  function drawDrostePuzzle(x, y, currentW, currentH, currentDepth, maxDepth) {
    let localW = currentW / cols;
    let localH = currentH / rows;
    let idx = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        let tileX = x + c * localW;
        let tileY = y + r * localH;
        if (!(r === 2 && c === 0)) {
          p.image(images[idx++], tileX, tileY, localW, localH);
        } else if (currentDepth < maxDepth) {
          drawDrostePuzzle(tileX, tileY, localW, localH, currentDepth + 1, maxDepth);
        } else {
          p.fill(255); p.rect(tileX, tileY, localW, localH);
        }
      }
    }
  }

  p.draw = () => {
    if (isSolving && solvePath.length > 0) {
      let now = p.millis();
      if (now - lastSolveTime > solveDelay) {
        let move = solvePath.shift();
        moveTile(move.r, move.c);
        lastSolveTime = now;

        if (solvePath.length === 0) {
          isSolved = true;
          solvedAnimFrame = maxAnimFrames;
          isSolving = false;
        }
      }
    }

    p.background(isSolved ? 255 : 0);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        let idx = board[r][c];
        if (idx !== -1) p.image(images[idx], c * w, r * h, w, h);
        else if (isSolved) drawDrostePuzzle(c * w, r * h, w, h, 1, 4);
        else { p.fill(0); p.rect(c * w, r * h, w, h); }

        if (!isSolved) {
          p.stroke(255, 50); p.noFill(); p.rect(c * w, r * h, w, h);
        }
      }
    }

    // === SEä ===
    

    if (isThinking) {0
      
      
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(34);
      p.textStyle(p.BOLD);

      p.stroke(0);
      p.strokeWeight(4);
      p.fill(255);
      p.text("Nachdenken...", p.width/2, p.height/2);
    }

    if (isSolved) {
      if (solvedAnimFrame > 0) {
        let prog = solvedAnimFrame > peakFrame 
          ? p.map(solvedAnimFrame, maxAnimFrames, peakFrame, 0, 1)
          : p.map(solvedAnimFrame, peakFrame, 0, 1, 0);

        for (let i = 1; i <= 8; i++) {
          let alpha = p.map(prog, 0, 1, 0, 100 / i);
          p.stroke(255, alpha);
          p.strokeWeight(5 + i * 3 * prog);
          p.noFill();
          p.rect(0, 0, p.width, p.height);
        }
        solvedAnimFrame--;
      } else {
        p.stroke(255, 120);
        p.strokeWeight(6);
        p.noFill();
        p.rect(0, 0, p.width, p.height);
      }
    }
    p.strokeWeight(1);
  };

  p.mousePressed = () => {
    if (isSolved) { startNewGame(); return; }
    if (isSolving || isThinking) { 
      isSolving = false; 
      isThinking = false; 
      return; 
    }

    if (p.mouseX < 0 || p.mouseX > p.width || p.mouseY < 0 || p.mouseY > p.height) return;

    let c = Math.floor(p.mouseX / w);
    let r = Math.floor(p.mouseY / h);

    if (c < 0 || c >= cols || r < 0 || r >= rows) return;

    if (r === emptySlot.r && c === emptySlot.c) {
      if (p.millis() - lastClickTime < doubleClickThreshold) {
        isThinking = true;
        lastClickTime = 0;

        setTimeout(() => {
          let solution = solvePuzzle(board);
          isThinking = false;
          if (solution.length > 0) {
            solvePath = [...solution];
            isSolving = true;
            lastSolveTime = p.millis();
          }
        }, 50);

        return;
      }
      lastClickTime = p.millis();
      return;
    }

    lastClickTime = p.millis();

    if (isAdjacent(r, c, emptySlot.r, emptySlot.c)) {
      moveTile(r, c);
      if (checkIsSolved()) {
        isSolved = true;
        solvedAnimFrame = maxAnimFrames;
      }
    }
  };

  function isAdjacent(r1, c1, r2, c2) {
    let dr = Math.abs(r1 - r2);
    let dc = Math.abs(c1 - c2);
    return (dr === 1 && dc === 0) || (dr === 0 && dc === 1);
  }

  function moveTile(r, c) {
    board[emptySlot.r][emptySlot.c] = board[r][c];
    board[r][c] = -1;
    emptySlot = { r, c };
  }

  function shuffleBoard() {
    let last = -1;
    for (let i = 0; i < 40; i++) {
      let moves = [];
      let {r, c} = emptySlot;
      if (r > 0) moves.push({r:r-1, c});
      if (r < rows-1) moves.push({r:r+1, c});
      if (c > 0) moves.push({r, c:c-1});
      if (c < cols-1) moves.push({r, c:c+1});

      moves = moves.filter(m => board[m.r][m.c] !== last);
      if (!moves.length) moves = [{r: r>0 ? r-1 : r+1, c}];

      let chosen = p.random(moves);
      last = board[chosen.r][chosen.c];
      moveTile(chosen.r, chosen.c);
    }
  }

  function calculateGrid() {
    w = p.width / cols;
    h = p.height / rows;
  }
};

new p5(puzzleSketch);