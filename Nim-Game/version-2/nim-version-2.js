const statusDiv = document.getElementById('gameState');
const initialInput = [1,0,0,7];
let firstPlayer = document.getElementById('user').checked ? 'user' : 'ai';
let difficultyLevel = document.getElementById('easy').checked ? 'easy' : 'hard';

const game = {
  rows: [...initialInput],
  currentPlayer: firstPlayer,
};




document.getElementById('user').addEventListener('change', () => {
  firstPlayer = 'user';
  game.currentPlayer = firstPlayer;
  updateUI();
});

document.getElementById('ai').addEventListener('change', () => {
  firstPlayer = 'ai';
  game.currentPlayer = firstPlayer;
  updateUI();
});

document.getElementById('easy').addEventListener('change', () => 
  difficultyLevel = 'easy'
);

document.getElementById('hard').addEventListener('change', () => 
  difficultyLevel = 'hard'
);

document.getElementById('start-game-button').addEventListener('click', () => {
 
  if (document.getElementById('user').checked) {

    const currentPara = document.getElementById('current-para');
    const currentParaHTML = currentPara.innerHTML;
    currentPara.innerHTML = '<b>Please make a move to start the game</b>';
    setTimeout(() => (currentPara.innerHTML = currentParaHTML), 2500);

  } else {

    document.getElementById('user').disabled = true;
    document.getElementById('ai').disabled = true;
    game.currentPlayer = 'ai';
    updateUI();

    //stringify -> convert from object to JSON string
    //parse -> convert from JSON string to object
    const tempGame = JSON.parse(JSON.stringify(game));
    const aiMove = findBestMove(tempGame.rows);
    const move = `AI moves ${aiMove[1]} objects from row ${aiMove[0] + 1}`;
    makeMove(aiMove[0], aiMove[1]);
    setTimeout(() => updateUI(), 1000); //execute the function after the specified time
    checkGameEnd();
    setTimeout(() => (document.getElementById('print-move-para').innerHTML = move), 1000);
    game.currentPlayer = 'user';
    document.getElementById('start-game-button').disabled = true;

  }
});

document.getElementById('userMoveButton').addEventListener('click', () => {

  const rowIndex = parseInt(document.getElementById('rowIndex').value - 1);
  const numObjects = parseInt(document.getElementById('numObjects').value);

  if (makeMove(rowIndex, numObjects)) {
    updateUI();
    checkGameEnd();

    const totalObjects = game.rows.reduce((accumulater, singleRow) => accumulater + singleRow, 0); 
    if(totalObjects != 0){
      game.currentPlayer = 'ai';
      updateUI();

    const tempGame = JSON.parse(JSON.stringify(game));
    const aiMove = findBestMove(tempGame.rows);
    const move = `AI moves ${aiMove[1]} objects from row ${aiMove[0] + 1}`;

    makeMove(aiMove[0], aiMove[1]);
    setTimeout(() => updateUI(), 1000);
    checkGameEnd();
    setTimeout(() => (document.getElementById('print-move-para').innerHTML = move), 1000);
    game.currentPlayer = 'user';
    }
  }
  document.getElementById('rowIndex').value = '';
  document.getElementById('numObjects').value = '';
});

document.getElementById('playAgainButton').addEventListener('click', () => {
  game.rows = [...initialInput];
  game.currentPlayer = 'user';
  document.getElementById('userMoveButton').disabled = false;
  statusDiv.innerHTML = '';
  document.getElementById('rowIndex').value = '';
  document.getElementById('numObjects').value = '';
  document.getElementById('start-game-button').disabled = false;
  document.getElementById('user').checked = true;
  document.getElementById('print-move-para').innerHTML = '';
  document.getElementById('user').disabled = false;
  document.getElementById('ai').disabled = false;

  updateUI();
});



function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function checkIfLastOne(rows) {
  let onesCount = 0;
  let zerosCount = 0;
  for (let i=0; i<rows.length; i++) {
      if (rows[i] === 1) 
          onesCount ++;
      if (rows[i] === 0) 
          zerosCount ++;
  }
  return onesCount === 1 && zerosCount === (rows.length - 1);
}

function nimSum(arr) {
 
  let nimSum = 0;
  for (let i=0; i< arr.length; i++) 
      nimSum ^= arr[i];
  
  return nimSum;
}

function createRowElements() {

  const rowsContainer = document.querySelector('.game-rows');
  rowsContainer.innerHTML = '';

  game.rows.forEach((numObjects, rowIndex) => {
    let spacesCount = '';
    for (let i = rowIndex; i <= initialInput.length; i++) 
      spacesCount += '&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp';

    const rowElement = document.createElement('div');
    rowElement.classList.add('row');
    rowElement.innerHTML = `Row ${rowIndex + 1}:${spacesCount}`;

    for (let i = 0; i < numObjects; i++) {
      const objectElement = document.createElement('div');
      objectElement.classList.add('object');
      rowElement.appendChild(objectElement); //put the objects inside the row
    }

    rowsContainer.appendChild(rowElement); //put the row inside the cetral div 
  });
}

function checkGameEnd() {

  const totalObjects = game.rows.reduce((accumulater, singleRow) => accumulater + singleRow, 0); 
  if (totalObjects === 0) {
    if (game.currentPlayer === 'user')
      setTimeout(() => (statusDiv.innerHTML = '<b>You lose !</b>'), 1000);
    else 
      setTimeout(() => (statusDiv.innerHTML = '<b>You won !</b>'), 1000);

    setTimeout(() => (document.getElementById('currentPlayer').innerHTML = 'Game over!'), 1000);
    document.getElementById('userMoveButton').disabled = true;
  }
}

function updateUI() {
  createRowElements();
  document.getElementById('currentPlayer').innerHTML = game.currentPlayer;
}

function makeMove(rowIndex, numObjects) {
  if (rowIndex < 0 || rowIndex >= game.rows.length || isNaN(rowIndex)) {
    statusDiv.innerHTML = '<b>Invalid row index !</b>';
    setTimeout(() => (statusDiv.innerHTML = ''), 2500);
    return false;
  }

  if (numObjects < 1 || numObjects > game.rows[rowIndex] || isNaN(numObjects)) {
    statusDiv.innerHTML = '<b>Invalid number of objects !</b>';
    setTimeout(() => (statusDiv.innerHTML = ''), 2500);
    return false;
  }

  game.rows[rowIndex] -= numObjects;
  return true;
}

function alphaBetaPruning(rows, alpha, beta, depth, isMaximizer) {
  if (depth === 0 || rows.reduce((acc, curr) => acc + curr, 0) === 0) {
      return nimSum(rows);
  }

  if (isMaximizer) {
      let v = Number.NEGATIVE_INFINITY;
      for (let i = 0; i < rows.length; i++) {
          for (let j = 1; j <= rows[i]; j++) {
              let tempRows = [...rows];
              tempRows[i] -= j;
              v = Math.max(v, alphaBetaPruning(tempRows, alpha, beta, depth - 1, false));
              alpha = Math.max(alpha, v);
              if (alpha >= beta) {
                  break;
              }
          }
      }
      return v;

  } else {
      let v = Number.POSITIVE_INFINITY;
      for (let i = 0; i < rows.length; i++) {
          for (let j = 1; j <= rows[i]; j++) {
              let tempRows = [...rows];
              tempRows[i] -= j;
              v = Math.min(v, alphaBetaPruning(tempRows, alpha, beta, depth - 1, true));
              beta = Math.min(beta, v);
              if (beta <= alpha) {
                  break;
              }
          }
      }
      return v;
  }
}

function findBestMove(rows) {
  
  if(difficultyLevel === 'easy'){


    const tempGame = JSON.parse(JSON.stringify(game));
    let i = getRandomNumber(0,3);

    while(tempGame.rows[i] === 0)
      i = getRandomNumber(0, 3)

    if(tempGame.rows[i] !== 0)
      return [i, getRandomNumber(1,rows[i])];
  
  }

  const depth = 3;
  let bestValue = Number.NEGATIVE_INFINITY;
  let bestMove = null;

  for (let i = 0; i < rows.length; i++) {
      for (let j = 1; j <= rows[i]; j++) {
          let tempRows = [...rows];
          tempRows[i] -= j;

            if (checkIfLastOne(tempRows)) {
            bestMove = [i, j];
            return bestMove
          }

          const moveValue = alphaBetaPruning(tempRows, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, depth, false);
          if (moveValue > bestValue) {
              bestValue = moveValue;
              bestMove = [i, j];
          }
      }
  }
  return bestMove;
}


updateUI();



