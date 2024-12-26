let stompClient,
    roomId,
    userIndInRoom,
    username,
    opponent,
    figureColor,
    selectedCell,
    opponentFigureColor,
    isReversedChessTable,
    firstPawnPosition = 2,
    figuresAttackKing = [],
    chessTable = $(".chess_table")[0];
function connect(username) {
  let socket = new SockJS("/chess_room");

  stompClient = Stomp.over(socket);
  stompClient.connect({username: username, endpoint: "/chess_room"},() => {
    console.log("Connection is opened!");
    setTimeout(() => {
      getRoomId();
      getFigureColorAndOpponent();
      getUserIndInRoom();
      checkMoveChessFigure();

      if (userIndInRoom === 1) {
        reverseCell();
        reverseCellNum();
        isReversedChessTable = true;
        firstPawnPosition = 7;
      }

      setClassOnCell();
      addChessFiguresInTable();
      setTurn();
      setTimer();
    }, 2000);
  })
}
function getUsername() {
  $.ajax({
    async: false,
    method: "GET",
    url: "/chess/username",
    contentType: "application/json",
    success(name) {
      username = name;
    }
  })
}
function getRoomId() {
  $.ajax({
    method: "GET",
    async: false,
    url: `/chess/roomId/${username}`,
    contentType: "application/json",
    success(id) {
      roomId = id;
    }
  })
}
function getFigureColorAndOpponent() {
  $.ajax({
    method: "POST",
    async: false,
    url: "/chess/figure_color_and_opponent",
    contentType: "application/json",
    data: JSON.stringify({
      roomId: roomId,
      username: username
    }),
    success(response) {
      opponent = response.opponent;
      figureColor = response.figureColor;
      setOpponentFigureColor();
    }
  })
}
function getUserIndInRoom() {
  $.ajax({
    method: "POST",
    async: false,
    url: "/chess/user_ind_in_room",
    contentType: "application/json",
    data: JSON.stringify({
      username: username,
      roomId: roomId
    }),
    success(userInd) {
      userIndInRoom = userInd;
    }
  })
}
function reverseCell() {
  for (let row of chessTable.children) {
    if (getComputedStyle(row).flexDirection === "row") {
      row.style.flexDirection = "row-reverse";
    } else {
      row.style.flexDirection = "row";
    }
  }
}
function reverseCellNum() {
  chessTable.previousElementSibling.style.flexDirection = "column-reverse";
}
function setChessTableHeight() {
  let chessTableWidth = parseFloat(getComputedStyle(chessTable).width);
  chessTable.style.height = chessTableWidth;
}
function setOpponentFigureColor() {
  if (figureColor === "white") {
    opponentFigureColor = "black";
  }

  if (figureColor === "black") {
    opponentFigureColor = "white";
  }
}
function setClassOnCell() {
  let cellNameNum = 'a'.charCodeAt(),
      rowNums = [...chessTable.previousElementSibling.children],
      cellNum;

  if (userIndInRoom === 1) {
    rowNums.reverse();
  }

  for (let i = 0; i < chessTable.children.length; i++) {
    let rowCells = chessTable.children[i],
        cells = [...rowCells.children];

    if (isReversedRow(rowCells)) {
      cells.reverse();
    }

    cellNum = rowNums[i].innerText;

    let j = 0;
    while (j < cells.length) {
      cells[j].classList.add(String.fromCharCode(cellNameNum) + cellNum);
      cellNameNum++;
      j++;
    }

    cellNameNum = 'a'.charCodeAt();
  }
}
function isReversedRow(row) {
  return getComputedStyle(row).flexDirection === "row-reverse" ||
         userIndInRoom === 1 && row.style.flexDirection === "row-reverse";
}
function addChessFiguresInTable() {
  let chessTableRows = [...chessTable.children],
      chessFigures = getAllChessFigures(),
      temp;

  function getAllChessFigures() {
    return ["rook", "knight", "bishop", "queen", "king", "pawn"].map((name) => {
      let svg;

      $.ajax({
        async: false,
        method: "GET",
        url: `/icons/${name}.svg`,
        success(doc) {
          svg = doc.querySelector("svg");
        }
      })

      return svg;
    })
  }

  chessTableRows.splice(2, chessTableRows.length - 4);

  temp = chessTableRows[2];
  chessTableRows[2] = chessTableRows[3];
  chessTableRows[3] = temp;

  for (let i = 0; i < chessTableRows.length; i++) {
    let row = chessTableRows[i],
        rowCells = [...row.children],
        chessOrder = [...chessFigures],
        pawn = chessOrder.pop();

    if (i % 2 === 0) {
      chessOrder = chessOrder.concat(chessOrder.slice(0, 3).reverse());
    } else {
      chessOrder = Array(8).fill(pawn);
    }

    if (isReversedRow(row)) {
      rowCells.reverse();
    }

    let j = 0;
    while (j < rowCells.length) {
      rowCells[j].appendChild(chessOrder[j].cloneNode(true));

      if (i > 1) {
        rowCells[j].children[0].style.fill = figureColor;

        if (figureColor === "white") {
          rowCells[j].style.cursor = "pointer";
          rowCells[j].addEventListener("click", selectCell);
        }
      } else {
        rowCells[j].children[0].style.fill = opponentFigureColor;
      }

      j++;
    }
  }
}
function selectCell(e) {
  let cell = e.currentTarget,
      figure = cell.querySelector("svg");

  if (figure !== null) {
    if (figure.style.fill === figureColor) {
      if (selectedCell === cell.classList[0]) {
        selectedCell = undefined;
        clearHighlightChessCells();
      } else {
        let moveAndAttackCells = findCellsToMoveOrAttack(cell.classList[0]);

        if (selectedCell !== undefined) {
          if (selectedCell !== cell.classList[0]) {
            clearHighlightChessCells();
          }
        }

        selectedCell = cell.classList[0];
        highlightChessCells(moveAndAttackCells);
      }
    }

    if (figure.style.fill === opponentFigureColor) {
      attackFigure(cell.classList[0]);
    }
  } else {
    moveFigure(cell.classList[0]);
  }
}
function findCellsToMoveOrAttack(cellName) {
  let currentCell = $(`.${cellName}`)[0],
      currentFigure = currentCell.querySelector("svg"),
      moveAndAttackCells = new Map(),
      move,
      attack;

  moveAndAttackCells.set("move", []);
  moveAndAttackCells.set("attack", []);

  move = moveAndAttackCells.get("move");
  attack = moveAndAttackCells.get("attack");

  function getDirection(primaryCoord) {
    let x = primaryCoord[0],
        y = primaryCoord[1],
        direction = [];

    while (true) {
      let cell = convertCoordToCell([x, y]);

      if (cell === undefined) break;

      direction.push(cell);

      if (x < 0) x--;
      if (x > 0) x++;
      if (y < 0) y--;
      if (y > 0) y++;
    }

    return direction;
  }
  function cellsHasEnemyOrEmpty(figureType, cells) {
    for (let cell of cells) {
      if (!hasFigure(cell)) {
        move.push(cell.classList[0]);
      } else {
        if (hasEnemy(cell)) {
          attack.push(cell.classList[0]);
        }

        if (figureType !== "king" && figureType !== "knight") {
          break;
        }
      }
    }
  }
  function convertCoordToCell(coord) {
    let [letter, num] = currentCell.classList[0].split(""),
        selector;

    if (isReversedChessTable) {
      coord[1] = -coord[1];
    }

    selector = String.fromCharCode(letter.charCodeAt() + coord[0]) + (+num + coord[1]);

    try {
      return $(`.${selector}`)[0];
    } catch {
      return undefined;
    }
  }
  function hasFigure(cell) {
    return !!cell.querySelector("svg");
  }
  function hasEnemy(cell) {
    let currentFigureColor = currentFigure.style.fill;

    if (hasFigure(cell)) {
      return cell.querySelector("svg").style.fill !== currentFigureColor;
    }
  }

  if (currentFigure.classList[0] === "pawn") {
    let pawnMove = [[0, 1]],
        pawnAttack = [[-1, 1], [1, 1]];

    if (+currentCell.classList[0][1] === firstPawnPosition) {
      pawnMove.push([0, 2]);
    }

    pawnMove = pawnMove.map(convertCoordToCell);
    pawnAttack = pawnAttack.map(convertCoordToCell);

    pawnMove = pawnMove.filter(cell => cell !== undefined);
    pawnAttack = pawnAttack.filter(cell => cell !== undefined);

    if (pawnMove.length !== 0) {
      if (!hasFigure(pawnMove[0])) {
        move.push(pawnMove[0].classList[0]);

        if (pawnMove[1] !== undefined && !hasFigure(pawnMove[1])) {
          move.push(pawnMove[1].classList[0]);
        }
      }
    }

    if (pawnAttack[0] !== undefined && hasEnemy(pawnAttack[0])) {
      attack.push(pawnAttack[0].classList[0]);
    }

    if (pawnAttack[1] !== undefined && hasEnemy(pawnAttack[1])) {
      attack.push(pawnAttack[1].classList[0]);
    }
  }

  if (currentFigure.classList[0] === "knight") {
    let knightCells = [[1, 2], [-1, 2], [2, 1], [2, -1], [-2, 1], [-2, -1], [-1, -2], [1, -2]];
    knightCells = knightCells.map(convertCoordToCell);
    knightCells = knightCells.filter(cell => cell !== undefined);
    cellsHasEnemyOrEmpty(currentFigure.classList[0], knightCells);
  }

  if (currentFigure.classList[0] === "king") {
    let kingCells = [
        [-1, 1], [0, 1], [1, 1],
        [1, 0], [1, -1], [0, -1],
        [-1, -1], [-1, 0]
    ];

    kingCells = kingCells.map(convertCoordToCell);
    kingCells = kingCells.filter(cell => cell !== undefined);
    cellsHasEnemyOrEmpty(currentFigure.classList[0], kingCells);
  }

  if (currentFigure.classList[0] === "rook") {
    let rookCells = [[-1, 0], [1, 0], [0, 1], [0, -1]];
    rookCells = rookCells.map(getDirection);
    rookCells.forEach(direction => cellsHasEnemyOrEmpty(currentFigure.classList[0], direction));
  }

  if (currentFigure.classList[0] === "bishop") {
    let bishopCells = [[-1, -1], [-1, 1], [1, 1], [1, -1]];
    bishopCells = bishopCells.map(getDirection);
    bishopCells.forEach(direction => cellsHasEnemyOrEmpty(currentFigure.classList[0], direction));
  }

  if (currentFigure.classList[0] === "queen") {
    let queenCells = [
        [-1, 0], [1, 0], [0, 1], [0, -1],
        [-1, -1], [-1, 1], [1, 1], [1, -1]
    ];

    queenCells = queenCells.map(getDirection);
    queenCells.forEach(direction => cellsHasEnemyOrEmpty(currentFigure.classList[0], direction));
  }

  return moveAndAttackCells;
}
function highlightChessCells(moveAndAttackCells) {
  for (let entry of moveAndAttackCells) {
    let name = entry[0],
        cells = entry[1].map(selector => $(`.${selector}`)[0]);

    cells.forEach((cell) => {
      let mark = document.createElement("p");

      mark.classList.add("mark");

      if (name === "move") {
        mark.classList.add("move_cell");
      }

      if (name === "attack") {
        mark.classList.add("attack_cell");
      }

      cell.appendChild(mark);
      cell.style.cursor = "pointer";
      cell.addEventListener("click", selectCell);
    })
  }
}
function clearHighlightChessCells() {
  let highlightCells = $(".move_cell, .attack_cell");

  for (let mark of highlightCells) {
    let cell = mark.parentNode;
    cell.style.cursor = "default";
    cell.removeChild(mark);
    cell.removeEventListener("click", selectCell);
  }
}
function moveFigure(newCellPositionClass) {
  let cellWithFigure = $(`.${selectedCell}`)[0],
      newFigurePosition = $(`.${newCellPositionClass}`)[0],
      figure = cellWithFigure.children[0];

  function moveFigureDelay() {
    figure.style.top = "";
    figure.style.left = "";
    cellWithFigure.style.cursor = "default";
    newFigurePosition.appendChild(cellWithFigure.children[0]);
    cellWithFigure.removeEventListener("click", selectCell);
    newFigurePosition.addEventListener("click", selectCell);

    if (figure?.style?.fill === figureColor) {
      setTurn();
      sendMoveChessFigure(cellWithFigure.classList[0], newFigurePosition.classList[0]);
    }

    checkShah(figure);
  }

  clearHighlightChessCells();
  animationFigure(cellWithFigure, newFigurePosition);
  setTimeout(moveFigureDelay, 900);
}
function attackFigure(newCellPositionClass) {
  let newFigurePosition = $(`.${newCellPositionClass}`)[0];

  moveFigure(newCellPositionClass);

  setTimeout(() => {
    newFigurePosition.removeChild(newFigurePosition.children[0]);
  }, 800);
}
function animationFigure(cellWithFigure, newFigurePosition) {
  let top,
      left,
      figure = cellWithFigure.children[0],
      figureMargin = parseFloat(getComputedStyle(figure).top),
      cwfRect = cellWithFigure.getBoundingClientRect(),
      nfpRect = newFigurePosition.getBoundingClientRect(),
      cwfRowInd = getChildIndex(cellWithFigure.parentNode),
      cwfCellInd = getChildIndex(cellWithFigure),
      nfpRowInd = getChildIndex(newFigurePosition.parentNode),
      nfpCellInd = getChildIndex(newFigurePosition);

  top = nfpRect.top - cwfRect.top;
  left = nfpRect.left - cwfRect.left;

  top += figureMargin;
  left += figureMargin;

  figure.style.top = top;
  figure.style.left = left;
}
function getChildIndex(item) {
  return [...item.parentNode.children].indexOf(item);
}
function sendMoveChessFigure(currentPosition, newPosition) {
  let moveChessFigureInfo = JSON.stringify({
    username: username,
    currentPosition: currentPosition,
    newPosition: newPosition
  });

  addAndRemoveChessFigureHandler("remove");
  stompClient.send("/send/move_chess_figure", {}, moveChessFigureInfo);
}
function checkMoveChessFigure() {
  stompClient.subscribe("/user/msg/move_chess_figure", (msg) => {
    let figuresAttackKing,
        chessFigureMoveInfo = JSON.parse(msg.body),
        {"currentPosition": currentPosition, "newPosition": newPosition} = chessFigureMoveInfo;

    currentPosition = $(`.${currentPosition}`)[0];
    newPosition = $(`.${newPosition}`)[0];
    selectedCell = currentPosition.classList[0];

    if (newPosition.querySelector("svg") !== null) {
      attackFigure(newPosition.classList[0]);
    } else {
      moveFigure(newPosition.classList[0]);
    }

    selectedCell = undefined;
    setTimeout(() => {
      setTurn();
      addAndRemoveChessFigureHandler("add");
    }, 1000)
  })
}
function addAndRemoveChessFigureHandler(type) {
  let shahOrMateP = $(".shah_or_mate p")[0],
      figuresInChess = [...$(".chess svg")].filter((figure) => {
        return figure.style.fill === figureColor;
      });

  for (let i = 0; i < figuresInChess.length; i++) {
    let cell = figuresInChess[i].parentNode;

    if (type === "add") {
      if (shahOrMateP.innerText === "(Шах)") {
        if (figuresAttackKing.length === 1) {
          if (hasAttackOpponentFigure(cell) || canCoverKing(cell)) {
            cell.style.cursor = "pointer";
            cell.addEventListener("click", selectCell);
          }
        }
      } else {
        cell.addEventListener("click", selectCell);
        cell.style.cursor = "pointer";
      }
    }

    if (type === "remove") {
      cell.removeEventListener("click", selectCell);
      cell.style.cursor = "default";
    }
  }
}
function setTurn() {
  let turnAndTimer = $(".turn_and_timer")[0],
      turnP = $(".turn p")[0];

  if (turnP.innerText === "") {
    if (figureColor === "white") {
      turnP.innerText = "Ваш ход";
      turnAndTimer.style.color = "green";
    } else {
      turnP.innerText = "Ход противника";
      turnAndTimer.style.color = "red";
    }
  } else {
    if (turnP.innerText === "Ваш ход") {
      turnP.innerText = "Ход противника";
      turnAndTimer.style.color = "red";
    } else {
      turnP.innerText = "Ваш ход";
      turnAndTimer.style.color = "green";
    }
  }
}
function setTimer() {
  let timerP = $(".timer p")[0],
      timerDate = new Date();

  timerDate.setHours(0);
  timerDate.setMinutes(0);
  timerDate.setSeconds(0);

  setInterval(() => {
    let timerDateString;

    timerDate.setTime(timerDate.getTime() + 1000);
    timerDateString = timerDate.toLocaleTimeString();

    if (timerDate.getHours() === 0) {
      timerDateString = timerDateString.slice(timerDateString.indexOf(":") + 1);
    } else {
      if (timerDateString[0] === '0') {
        timerDateString = timerDateString.slice(1);
      }
    }

    timerP.innerText = timerDateString;
  }, 1000);
}
function checkShah(figure) {
  let figureColor = figure.style.fill,
      figures = [...$(".chess_table svg")],
      king, opponentKing;

  figures = figures.filter(fig => fig.style.fill === figureColor);
  opponentKing = figures.find(fig => fig.classList.contains("king"));
  king = [...$(".chess_table svg.king")].find(fig => fig !== opponentKing);

  for (let i = 0; i < figures.length; i++) {
    let cell = figures[i].parentNode,
        attackCells = findCellsToMoveOrAttack(cell.classList[0]).get("attack");

    if (attackCells.includes(king.parentNode.classList[0])) {
      figuresAttackKing.push(cell);
    }
  }

  if (figuresAttackKing.length !== 0) {
    let shahOrMateP = $(".shah_or_mate p")[0];
    shahOrMateP.innerText = "(Шах)";
  }
}
function checkMate() {

}
function hasAttackOpponentFigure(cell) {
  return findCellsToMoveOrAttack(cell.classList[0])
         .get("attack")
         .includes(figuresAttackKing[0].classList[0]);
}
function canCoverKing(cell) {
  let directionCells = [],
      figureAttackKingClass = figuresAttackKing[0].classList[0],
      figuresAttackKingMove = findCellsToMoveOrAttack(figureAttackKingClass).get("move"),
      startCellDirections;

  startCellDirections = figuresAttackKingMove.filter((cell) => {
    let figuresAttackKingNums,
        coords = [
        [0, 1], [1, 0], [0, -1], [-1, 0],
        [-1, -1], [1, 1], [-1, 1], [1, -1]
    ];

    figuresAttackKingNums = figureAttackKingClass.split("");
    figuresAttackKingNums = figuresAttackKingNums.map(chr => isFinite(chr) ? +chr : chr.charCodeAt());

    coords = coords.map((coord) => {
      coord[0] += figuresAttackKingNums[0];
      coord[1] += figuresAttackKingNums[1];

      coord = coord.map((num, ind) => {
        return ind === 0 ? String.fromCharCode(num) : num + "";
      });

      return coord.join("");
    });

    return coords.includes(cell);
  });
  
  for (let i = 0; i < startCellDirections.length; i++) {
    let startCellInd = figuresAttackKingMove.indexOf(startCellDirections[i]),
        nextCellInd = figuresAttackKingMove.indexOf(startCellDirections[i + 1]),
        diffNextAndStart;

    if (nextCellInd === -1) {
      figuresAttackKingMove.unshift(figuresAttackKingMove.splice(startCellInd));
    } else {
      diffNextAndStart = nextCellInd - startCellInd;
      figuresAttackKingMove.unshift(figuresAttackKingMove.splice(startCellInd, diffNextAndStart));
    }
  }

  figuresAttackKingMove.reverse();
  console.log(figuresAttackKingMove);
}

getUsername();
connect(username);
setChessTableHeight();