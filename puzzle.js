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
  const solveDelay = 500;     

  // Timer für den präzisen Doppelklick-Schutz
  let lastClickTime = 0;
  const doubleClickThreshold = 250; // Zeitfenster in ms für Doppelklick

  // Variablen für den Überstrahl-Effekt
  let isSolved = false;
  let solvedAnimFrame = 0;
  const maxAnimFrames = 60; 
  const peakFrame = 55;     

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

  function drawDrostePuzzle(x, y, currentW, currentH, currentDepth, maxDepth) {
    let localW = currentW / cols;
    let localH = currentH / rows;
    let idx = 0;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        let tileX = x + c * localW;
        let tileY = y + r * localH;

        if (!(r === 2 && c === 0)) {
          p.image(images[idx], tileX, tileY, localW, localH);
          idx++;
        } else {
          if (currentDepth < maxDepth) {
            drawDrostePuzzle(tileX, tileY, localW, localH, currentDepth + 1, maxDepth);
          } else {
            p.fill(255);
            p.noStroke();
            p.rect(tileX, tileY, localW, localH);
          }
        }
      }
    }
  }

  p.draw = () => {
    if (isSolving) {
      let currentTime = p.millis();
      if (currentTime - lastSolveTime > solveDelay) {
        if (moveHistory.length > 0) {
          let prevEmptySlot = moveHistory.pop();
          moveTile(prevEmptySlot.r, prevEmptySlot.c, false);
          lastSolveTime = currentTime;
          
          if (moveHistory.length === 0 && checkIsSolved()) {
            isSolved = true;
            solvedAnimFrame = maxAnimFrames;
          }
        } else {
          isSolving = false; 
        }
      }
    }

    if (isSolved) {
      p.background(255); 
    } else {
      p.background(0);   
    }

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        let imgIndex = board[r][c];
        
        if (imgIndex !== -1) {
          p.image(images[imgIndex], c * w, r * h, w, h);
        } else {
          if (isSolved) {
            drawDrostePuzzle(c * w, r * h, w, h, 1, 4);
          } else {
            p.fill(0);
            p.rect(c * w, r * h, w, h);
          }
        }

        if (!isSolved) {
          p.stroke(255, 50);
          p.noFill();
          p.rect(c * w, r * h, w, h);
        }
      }
    }

    if (isSolved) {
      if (solvedAnimFrame > 0) {
        let progress = 0;
        
        if (solvedAnimFrame > peakFrame) {
          progress = p.map(solvedAnimFrame, maxAnimFrames, peakFrame, 0, 1);
        } else {
          progress = p.map(solvedAnimFrame, peakFrame, 0, 1, 0);
        }

        let flashAlpha = p.map(progress, 0, 1, 0, 200); 
        p.fill(255, flashAlpha);
        p.noStroke();
        p.rect(0, 0, p.width, p.height);

        p.noFill();
        for (let i = 1; i <= 6; i++) {
          let glowWeight = i * 8 * progress; 
          let glowAlpha = p.map(progress, 0, 1, 0, 45 / i);
          
          p.stroke(255, glowAlpha * 2.5);
          p.strokeWeight(glowWeight);
          p.rect(0, 0, p.width, p.height);
        }
        
        p.stroke(255);
        p.strokeWeight(1 + 5 * progress);
        p.rect(0, 0, p.width, p.height);

        solvedAnimFrame--; 
      } else {
        p.stroke(255);
        p.strokeWeight(4);
        p.noFill();
        p.rect(0, 0, p.width, p.height);
      }
      p.strokeWeight(1); 
    }
  };

  // Zusammengeführte Klick-Logik für präzisere Kontrolle
  p.mousePressed = () => {
    // Falls das Spiel schon fertig gelöst ist, startet jeder Klick neu
    if (isSolved) {
      startNewGame();
      return;
    }

    // Erneuter Klick stoppt die automatische Lösung (egal wo im Puzzle geklickt wird)
    if (isSolving) {
      isSolving = false;
      return; 
    }

    // Prüfen, ob der Klick innerhalb des Canvas liegt
    if (p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= 0 && p.mouseY <= p.height) {
      let c = p.floor(p.mouseX / w);
      let r = p.floor(p.mouseY / h);

      if (c >= 0 && c < cols && r >= 0 && r < rows) {
        let currentTime = p.millis();

        // Überprüfung auf Doppelklick im schwarzen (leeren) Quadrat
        if (r === emptySlot.r && c === emptySlot.c) {
          if (currentTime - lastClickTime < doubleClickThreshold) {
            // Doppelklick erfolgreich registriert
            if (checkIsSolved()) {
              startNewGame();
            } else if (moveHistory.length > 0) {
              isSolving = true;
              lastSolveTime = p.millis();
            }
            lastClickTime = 0; // Timer zurücksetzen
            return;
          }
          lastClickTime = currentTime;
          return; // Einzelklick im leeren Feld blockieren
        }

        // Normaler Kachel-Zug (wenn nicht das leere Feld geklickt wurde)
        lastClickTime = 0; // Timer zurücksetzen bei Klick auf andere Kacheln
        if (isAdjacent(r, c, emptySlot.r, emptySlot.c)) {
          moveTile(r, c, false);
          
          if (checkIsSolved()) {
            isSolved = true;
            solvedAnimFrame = maxAnimFrames; 
          }
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

    let canvasSize = p.min(300, containerWidth);
    p.resizeCanvas(canvasSize, canvasSize);
    calculateGrid();
  };

  function calculateGrid() {
    w = p.width / cols;
    h = p.height / rows;
  }
};

new p5(puzzleSketch);
