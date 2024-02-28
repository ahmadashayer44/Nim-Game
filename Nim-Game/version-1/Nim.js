let noOfSticks;
let currentState;
let currentStateAsObject;
let oponenetTurn;
let playingDiv;
let movingDegreeForGui = 150;
let difficulty;
let x = 1;
function handleClick(arr) {
  currentState = divideSticks(arr);
  currentStateAsObject = currentState;

  let ending = true;
  for (const arr of currentState) {
    if (canDivideSticks(arr)) ending = false;
  }
  if (ending === true) {
    winningGame();
    return;
  }
  startGame();
}

function turnForWho() {
  let ending = true;
  for (const arr of currentState) {
    if (canDivideSticks(arr)) ending = false;
  }

  if (ending === true)
    setTimeout(() => {
      lostGame();
    }, 2000);
  let buttonsContainer = document.getElementById("buttons");
  buttonsContainer.innerHTML = ``;

  for (const arr of currentState) {
    const button = document.createElement("button");
    button.className = "button";
    button.textContent = `${arr}`;
    button.style.margin = "10px";
    button.style.width = "fit-content";
    button.style.height = "80px";
    button.style.borderRadius = "50%";
    button.style.fontWeight = "900";
    button.style.fontSize = "1em";
    button.style.fontSize = "1em";
    button.style.color = "blanchedalmond";
    if (canDivideSticks(arr)) {
      button.style.background = "rgb(30, 30, 112)";
    } else {
      button.style.background = "red";
      button.disabled = true;
    }
    button.onclick = () => handleClick(arr);
    buttonsContainer.appendChild(button);
  }
}
function winningGame() {
  let popup = document.getElementById("popup");
  popup.style.color = "cyan";
  popup.innerHTML = "You Won!";
  setTimeout(() => {
    popup.style.opacity = "1";
    popup.style.visibility = "visible";
  }, 800);
}
function lostGame() {
  let popup = document.getElementById("popup");
  popup.style.color = "red";
  popup.innerHTML = "You Lost!";
  setTimeout(() => {
    popup.style.opacity = "1";
    popup.style.visibility = "visible";
  }, 800);
}
document.addEventListener("click", function () {
  popup.style.opacity = "0";
  popup.style.visibility = "hidden";
});

function addSticksInputs(pilesNo) {
  const firstContent = document.querySelector(".first_content");
  const SticksInputs = document.querySelectorAll(".sticksInput");
  SticksInputs.forEach((input) => input.remove());
  for (let i = 0; i < pilesNo - 1; i++) {
    const input = document.createElement("input");
    input.id = `inputForSticksNo`;
    input.type = "number";
    input.classList.add("inputNumber");
    input.classList.add("sticksInput");
    input.value = "7";
    input.min = "7";
    input.max = "10";
    firstContent.appendChild(input);
  }
}

function startPlayingGame() {
  document.body.style.backgroundImage = "url(Imgs/321.png)";
  const inputElements = document.querySelectorAll("#inputForSticksNo");
  noOfSticks = Array.from(inputElements, (element) => element.value);
  noOfSticks.sort();
  currentState = divideSticks(noOfSticks);
  currentStateAsObject = currentState;
  const theHolePage = document.getElementById("theHolePage");
  theHolePage.style.opacity = 0;
  setTimeout(() => {
    theHolePage.style.display = "none";
  }, 700);

  versionOneOfThisGame(noOfSticks);
}
function startGame() {
  oponenetTurn = document.getElementById("firstTurn").checked;
  difficulty = document.querySelector('input[name="difficulty"]:checked').value;
  document.getElementById("aiRobot").style.opacity = "1";
  document.getElementById("startBtn").style.opacity = "0";
  document.getElementById("difficulty").style.opacity = "0";
  let divForAll = document.createElement("div");
  for (let i = 0; i < currentState.length; i++) {
    let divForEachContainer = document.createElement("div");
    divForEachContainer.style.display = "flex";
    divForEachContainer.style.width = "fit-content";
    divForEachContainer.style.height = "100px";
    divForEachContainer.style.padding = "20px";

    divForEachContainer.attributes.className = "divForEachContainer";
    let divForEachOne = document.createElement("div");
    for (let j = 0; j < currentState[i].length; j++) {
      for (let k = 0; k < currentState[i][j]; k++) {
        divForEachOne = divForEachElement();
        divForEachContainer.appendChild(divForEachOne);
        divForAll.appendChild(divForEachContainer);
      }
      divForEachOne.style.marginRight = "15px";
    }
    divForEachContainer.className = `container${currentState[i].join(",")}`;
    divForEachContainer.style.marginRight = "50px";
    divForEachContainer.style.background = "rgba(0, 0, 0, 0.423)";
    divForEachContainer.style.borderRadius = "20px";
  }
  divForAll.style.transform = `translateY(${movingDegreeForGui}px)`;
  movingDegreeForGui += 150;
  divForAll.style.display = "flex";
  divForAll.style.position = "absolute";
  divForAll.style.left = "3%";

  divForAll.style.opacity = "0";
  divForAll.style.transition = "opacity 0.7s";

  setTimeout(() => {
    divForAll.style.opacity = "1";
  }, 1000);
  playingDiv.append(divForAll);

  if (oponenetTurn && x == 1) {
    x = 0;
    turnForWho();
    return 0;
  } else {
    if (difficulty === "easy") currentState = easyVersion(currentState);
    else if (difficulty === "medium")
      currentState = getBestMove(currentState, 1, false);
    else currentState = getBestMove(currentState, 3, false);
    currentState = divideSticks(currentState);
  }

  turnForWho();
}

function versionOneOfThisGame(noOfSticks) {
  playingDiv = document.getElementById("playingPage");
  setTimeout(() => {
    playingDiv.style.minWidth = "70%";
    playingDiv.style.minHeight = "70%";
    playingDiv.style.overflow = "auto";
    playingDiv.style.background =
      "linear-gradient(to bottom, #323232 0%, #3F3F3F 40%, #1C1C1C 150%), linear-gradient(to top, rgba(255,255,255,0.40) 0%, rgba(0,0,0,0.25) 200%)";
    playingDiv.style.position = "fixed";
    playingDiv.style.top = "50%";
    playingDiv.style.left = "50%";
    playingDiv.style.transform = "translate(-50%, -50%)";
    playingDiv.style.boxShadow = "15px 15px 15px rgba(0, 0, 0, 0.5)";
    playingDiv.style.display = "flex";
    playingDiv.style.justifyContent = "center";
    let div1 = document.createElement("div");

    for (let i = 0; i < noOfSticks.length; i++) {
      const stickValue = noOfSticks[i];
      for (let j = 0; j < stickValue; j++) {
        let d = divForEachElement();
        if (j == stickValue - 1) d.style.marginRight = "25px";
        div1.appendChild(d);
      }
    }

    div1.style.display = "flex";
    div1.style.position = "absolute";
    playingDiv.appendChild(div1);
  }, 900);
}

function divForEachElement() {
  let div1 = document.createElement("div");
  let img = document.createElement("img");
  img.src = "object.png";
  img.style.zIndex = "0";
  img.style.marginRight = "5px";
  div1.style.height = "15px";
  div1.appendChild(img);
  return div1;
}
function divideSticks(input) {
  const results = [];

  function areArraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) {
      return false;
    }
    const sortedArr1 = arr1.slice().sort();
    const sortedArr2 = arr2.slice().sort();
    for (let i = 0; i < sortedArr1.length; i++) {
      if (sortedArr1[i] !== sortedArr2[i]) {
        return false;
      }
    }
    return true;
  }
  function canDivide(stick, target) {
    return stick > target * 2;
  }
  if (typeof input === "number") {
    for (let i = 1; i <= input / 2; i++) {
      const remaining = input - i;
      if (i !== remaining) {
        const result = [remaining, i];
        if (
          !results.some((existingResult) =>
            areArraysEqual(existingResult, result)
          )
        ) {
          results.push(result);
        }
      }
    }
  } else if (Array.isArray(input)) {
    const totalSticks = input.reduce((acc, val) => acc + val, 0);

    for (let i = 1; i <= totalSticks / 2; i++) {
      const remaining = totalSticks - i;
      if (i !== remaining) {
        for (const stick of input) {
          if (stick >= i && canDivide(stick, i)) {
            const copy = [...input];
            const index = copy.indexOf(stick);
            copy[index] -= i;
            copy.push(i);
            if (copy.indexOf(0) === -1) {
              const result = copy.slice().sort();
              if (
                !results.some((existingResult) =>
                  areArraysEqual(existingResult, result)
                )
              ) {
                results.push(result);
              }
            }
          }
        }
      }
    }
  }
  for (result of results) result = result.sort().reverse();
  return results;
}

function easyVersion(gamestate) {
  currentStateAsObject =
    gamestate[Math.floor(Math.random() * gamestate.length)];
  document.getElementById("headerForHint").style.display = "block";
  document.getElementById("headerForHint").style.opacity = "1";
  setTimeout(() => {
    document.getElementById("headerForHint").style.opacity = "0";
  }, 3000);
  setTimeout(() => {
    document.getElementById("aiMove").innerHTML = `${currentStateAsObject}`;
    const element = (document.querySelector(
      `[class="container${currentStateAsObject.join(",")}`
    ).style.background = "rgba(197, 109, 109, 0.772)");
  }, 2000);
  return currentStateAsObject;
}

function evaluateState(state, isMaximizingPlayer) {
  if (canDivideSticks(state)) {
    return isMaximizingPlayer ? 1 : -1;
  } else {
    return isMaximizingPlayer ? -1 : 1;
  }
}
function alphaBetaPruning(node, depth, alpha, beta, isMaximizingPlayer) {
  if (depth === 0 || node.children.length === 0) {
    return node.score;
  }

  if (isMaximizingPlayer) {
    let maxScore = -Infinity;

    for (const child of node.children) {
      const score = alphaBetaPruning(child, depth - 1, alpha, beta, false);
      maxScore = Math.max(maxScore, score);
      alpha = Math.max(alpha, score);

      if (beta <= alpha) {
        break;
      }
    }

    return maxScore;
  } else {
    let minScore = Infinity;

    for (const child of node.children) {
      const score = alphaBetaPruning(child, depth - 1, alpha, beta, true);
      minScore = Math.min(minScore, score);
      beta = Math.min(beta, score);

      if (beta <= alpha) {
        break;
      }
    }

    return minScore;
  }
}

function buildTree(currentState, isMaximizingPlayer) {
  const node = {
    state: currentState,
    score: evaluateState(currentState, isMaximizingPlayer),
    children: [],
  };

  if (canDivideSticks(currentState)) {
    const possibleMoves = divideSticks(currentState);
    for (const move of possibleMoves) {
      const child = buildTree(move, !isMaximizingPlayer);
      node.children.push(child);
    }
  }

  return node;
}

function getBestMove(initialStates, depth, isMaximizingPlayer) {
  let bestMove = null;
  let bestScore = isMaximizingPlayer ? -Infinity : Infinity;

  for (const initialState of initialStates) {
    const treeRoot = buildTree(initialState, isMaximizingPlayer);
    const score = alphaBetaPruning(
      treeRoot,
      depth,
      -Infinity,
      Infinity,
      isMaximizingPlayer
    );

    if (
      (isMaximizingPlayer && score > bestScore) ||
      (!isMaximizingPlayer && score < bestScore)
    ) {
      bestScore = score;
      bestMove = initialState;
    }
  }
  currentStateAsObject = bestMove;
  document.getElementById("headerForHint").style.display = "block";
  document.getElementById("headerForHint").style.opacity = "1";
  setTimeout(() => {
    document.getElementById("headerForHint").style.opacity = "0";
  }, 3000);
  setTimeout(() => {
    document.getElementById("aiMove").innerHTML = `${currentStateAsObject}`;
    const element = (document.querySelector(
      `[class="container${currentStateAsObject.join(",")}`
    ).style.background = "rgba(197, 109, 109, 0.772)");
  }, 2000);
  return bestMove;
}

function canDivideSticks(arr) {
  if (Array.isArray(arr)) {
    for (const element of arr) {
      if (element > 2) return true;
    }
  }
  return false;
}

