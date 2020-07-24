var cards = [];
var shuffledDeck = [];
var largeCards = [];
var passedCards = [];
var currentDeckCardIndex;
var countdownTimer;


var currentLeftCard = 0; // Refers to table 1.
var currentRightCard = 0;
var countdownTimerSeconds = 5;
var isGameOver;
var hasGameStarted;

const playButtonStates = {
  DISABLED: "disabled",
  START: "start",
  CONTINUE: "continue",
  PAUSE: "pause",
  RESTART: "restart"
}

var computerWinsText = "Loteria! Computer Wins!";
var playerWinsText = "Loteria! You Win!";

var deck = document.querySelector('#deck');
var deckImage = document.querySelector('#deckCardImage');
var leftCardTable = document.querySelector('.leftCard table').getElementsByTagName('tbody')[0];
var leftTableNumber = document.querySelector('#leftTableNumber');
var rightCardTable = document.querySelector('.rightCard table').getElementsByTagName('tbody')[0];
var computerCardHolder = document.querySelector(".rightCard");
var rightTableNumber = document.querySelector('#rightTableNumber');
var playerSelections;
var progressBar = document.getElementById("progressBar");
var previousButton = document.querySelector("#previousButton");
var nextButton = document.querySelector("#nextButton");
var selectCardButton = document.querySelector("#selectCardButton");
var startButton = document.querySelector("#startOrReset");
var winnerDisplay = document.getElementById("winnerDisplay");
var alerts = document.querySelectorAll(".alert");
var firstInstructionalStepSection = document.querySelector("#firstInstructionalStepSection");

init();

function init() {
  console.log(startButton);
  hasGameStarted = false;
  console.log(firstInstructionalStepSection);
  currentDeckCardIndex = -1;
  isGameOver = false;
  cards = createAllCards();
  largeCards = setupLargeCards();
  shuffledDeck = shuffleDeck();
  deckImage.src = "assets/img/cardBack.png";

  updateCardTable(true); // setup card table for player
  listenToPlayerClicked();
  listenForStartRestartButtonClicks();
  listenForPreviousNextButtonClicks();
  listenForSelectCardButtonClicks();
  shouldShowStartButton(playButtonStates.DISABLED);
  shouldShowComputerTable(false);
}

function listenForSelectCardButtonClicks() {
  selectCardButton.addEventListener("click", function() {
    console.log("clicked");
    hidePreviousNextAndSelectButtons();
    shouldShowComputerTable(true);
    shouldShowStartButton(playButtonStates.START);
    currentRightCard = generateRandomTableCardsIndex();
    updateCardTable(false); // set up card table for computer

  });
}

function hidePreviousNextAndSelectButtons() {
  $("#firstInstructionalStepSection").toggle(function() {
    $("#firstInstructionalStepSection").addClass("hide");
    $("#firstInstructionalStepSection").removeClass("show");
  }, function() {
    $("#firstInstructionalStepSection").addClass("show");
    $("#firstInstructionalStepSection").removeClass("hide");
  });
}

function shouldShowComputerTable(shouldShow) {
  console.log("shouldShowCOmputerTable: " + shouldShow);
  if (shouldShow) {
    computerCardHolder.setAttribute("class", "");
    computerCardHolder.classList.add("show");
    computerCardHolder.classList.add("rightCard");
    computerCardHolder.classList.add("col");
  } else {
    computerCardHolder.setAttribute("class", "");
    computerCardHolder.classList.add("hide");
  }
  console.log(computerCardHolder);
}

function shouldShowStartButton(startButtonState) {
  console.log("shouldShow: " + shouldShowStartButton);
  if (startButtonState === playButtonStates.START) {
    startButton.textContent = "Start";
    startButton.classList.add(playButtonStates.START);
    startButton.classList.remove(playButtonStates.CONTINUE);
    startButton.classList.remove(playButtonStates.PAUSE);
    startButton.classList.remove(playButtonStates.RESTART);
    startButton.classList.remove(playButtonStates.DISABLED);

  }
  else if (startButtonState === playButtonStates.CONTINUE) {
    startButton.textContent = "Continue";

    startButton.classList.add(playButtonStates.CONTINUE);
    startButton.classList.remove(playButtonStates.START);
    startButton.classList.remove(playButtonStates.PAUSE);
    startButton.classList.remove(playButtonStates.RESTART);
    startButton.classList.remove(playButtonStates.DISABLED);

  } else if (startButtonState === playButtonStates.PAUSE){
    startButton.textContent = "Pause";

    startButton.classList.add(playButtonStates.PAUSE);
    startButton.classList.remove(playButtonStates.RESTART);
    startButton.classList.remove(playButtonStates.CONTINUE);
    startButton.classList.remove(playButtonStates.START);
    startButton.classList.remove(playButtonStates.DISABLED);

  } else if (startButtonState === playButtonStates.RESTART) {
    startButton.textContent = "Restart";

    startButton.classList.add(playButtonStates.RESTART);
    startButton.classList.remove(playButtonStates.PAUSE);
    startButton.classList.remove(playButtonStates.START);
    startButton.classList.remove(playButtonStates.CONTINUE);
    startButton.classList.remove(playButtonStates.DISABLED);

  } else if (startButtonState === playButtonStates.DISABLED) {
    startButton.textContent = "Start";
    startButton.classList.add(playButtonStates.DISABLED);
    startButton.classList.remove(playButtonStates.RESTART);
    startButton.classList.remove(playButtonStates.PAUSE);
    startButton.classList.remove(playButtonStates.START);
    startButton.classList.remove(playButtonStates.CONTINUE);
  }

  console.log(startButton);

}

function listenForStartRestartButtonClicks() {
  console.log(startButton);
  startButton.addEventListener("click", function(e){
    console.log(e);
    if (startButton.classList.contains(playButtonStates.START)) {
      hasGameStarted = true;
      shouldShowComputerTable(true);

      countdownTimer = setInterval(updateTimer, 1000);
      shouldShowProgressBar(true);

      for (var i = 0; i < alerts.length; i++) {
        alerts[i].setAttribute("class", "");
        alerts[i].classList.add("hide");
      }

      onDeckClicked();
      shouldShowStartButton(playButtonStates.PAUSE);
    } else if (startButton.classList.contains(playButtonStates.CONTINUE)) {
      shouldPauseTimer(false);
      shouldShowStartButton(playButtonStates.PAUSE);
    } else if (startButton.classList.contains(playButtonStates.PAUSE)) {
      shouldPauseTimer(true);
      shouldShowStartButton(playButtonStates.CONTINUE);
    } else if(startButton.classList.contains(playButtonStates.RESTART)){
      location.reload();
    }
  });
}

function listenForPreviousNextButtonClicks() {
  previousButton.addEventListener("click", function() {
    if (currentLeftCard == 0) {
      currentLeftCard = largeCards.length - 1;
    } else {
      currentLeftCard--;
    }
    resetTableRows(leftCardTable);
    updateCardTable(true);
  });

  nextButton.addEventListener("click", function() {
    if (currentLeftCard == largeCards.length - 1) {
      currentLeftCard = 0;
    } else {
      currentLeftCard++;
    }
    resetTableRows(leftCardTable);
    updateCardTable(true);
  });
}

function listenToPlayerClicked() {
  $('.playerCell').on('click', function(e) {
    if (!isGameOver) {

      var td = $(this);
      var tr = td.parent();
      var children = tr.children().length;

      var tdIndex = td.index() + 1;
      var trIndex = tr[0].rowIndex -1 ;

      var clickedCardLocation = ((trIndex - 1) * children) + tdIndex -1;
      var cardsIndex = largeCards[currentLeftCard][clickedCardLocation] -1;
      var card = cards[cardsIndex];
      if (passedCards.includes(card)) {
        td.addClass("darkOverlay");
        var img = td.find('img')[0];
        img.classList.add("transparentImage");
        checkIfCardWins(leftCardTable, true);
      }
    }
  });
}

function gameOver() {
  isGameOver = true;
  shouldShowStartButton(playButtonStates.RESTART);
}

function onDeckClicked() {
  if (!isGameOver && hasGameStarted) {
    currentDeckCardIndex++;
    updateDeck();
  }
}

function updateCardTable(isPlayerCard) {
  var cardTable = rightCardTable;
  var tableNumberView = rightTableNumber;
  var currentCardIndex = currentRightCard;

  if (isPlayerCard) {
    tableNumberView = leftTableNumber;
    currentCardIndex = currentLeftCard;
    cardTable = leftCardTable;
  }
  tableNumberView.textContent = "Tabla " + (currentCardIndex + 1);

  var newRow;
  var index = 0;
  newRow = cardTable.insertRow();

  for (var i = 0; i < largeCards[currentCardIndex].length; i++) {
    if (i % 4 === 0) {
      newRow = cardTable.insertRow();
      index = 0;
    }

    var newCell = newRow.insertCell(index);
    var img = document.createElement('img');
    img.src = cards[largeCards[currentCardIndex][i] - 1].cardImage;
    img.classList.add("cardImage");
    newCell.className = "playerCell";
    newCell.appendChild(img);
    index++;
  }

  if (isPlayerCard) {
    listenToPlayerClicked();
  }
}

function updateDeck() {
  deckImage.src = cards[shuffledDeck[currentDeckCardIndex]].cardImage;
  passedCards.push(cards[shuffledDeck[currentDeckCardIndex]]);
  drawBeanOnComputerTableCard();
}

function drawBeanOnComputerTableCard() {

  var matchedCardLocation;

  if (largeCards[currentRightCard].includes(cards[shuffledDeck[currentDeckCardIndex]].cardNumber)) {
    for (var i = 0; i < largeCards[currentRightCard].length; i++) {
      if (largeCards[currentRightCard][i] === cards[shuffledDeck[currentDeckCardIndex]].cardNumber) {
        matchedCardLocation = i;
      }
    }
  }

  if (matchedCardLocation != null) {
    var row = Math.floor(matchedCardLocation / 4);
    var col = matchedCardLocation - (row * 4);

    row++;
    row++;
    var cell = rightCardTable.rows[row].cells[col];
    var img = cell.getElementsByTagName('img');

    cell.className = "darkOverlay";
    img[0].classList.add("transparentImage");

    checkIfCardWins(rightCardTable, false);
  }
}

function checkIfCardWins(cardTable, isPlayerCard) {
  var winsByRow = false;
  var numOfOverlays = 0;
  for (var row = 2; row < cardTable.rows.length; row++) {
    numOfOverlays = 0;
    for (var col = 0; col < cardTable.rows[row].cells.length; col++) {
      var cell = cardTable.rows[row].cells[col];

      if (cell.classList.contains("darkOverlay")) {
        numOfOverlays++;
      }

      if (col === 3 && numOfOverlays === 4) {
        if (isPlayerCard) {
          return displayWinner(playerWinsText);
        } else {
          return displayWinner(computerWinsText);
        }
      }
    }
  }

  var winsByCol = false;
  var col = 0;
  var numOfOverlays = 0;
  do {
    numOfOverlays = 0;
    for (var row = 2; row < cardTable.rows.length; row++) {

      var cell = cardTable.rows[row].cells[col];

      if (cell.classList.contains("darkOverlay")) {
        numOfOverlays++;
      }

      if (row === 5 && numOfOverlays === 4) {
        if (isPlayerCard) {
          return displayWinner(playerWinsText);
        } else {
          return displayWinner(computerWinsText);
        }
      }
    }
    col++;
  } while(col < 4);

  var numOfOverlaysFromLeftToRight = 0;
  var numOfOverlaysFromRightToLeft = 0;
  var col = 0;
  for (var row = 2; row < cardTable.rows.length; row++) {

    var cellFromLTR = cardTable.rows[row].cells[col];

    var cellFromRTL = cardTable.rows[row].cells[cardTable.rows[row].cells.length - col -1]

    if (cellFromLTR.classList.contains("darkOverlay")) {
      numOfOverlaysFromLeftToRight++;
    }

    if (cellFromRTL.classList.contains("darkOverlay")) {
      numOfOverlaysFromRightToLeft++;
    }

    if (numOfOverlaysFromLeftToRight === 4) {
      if (isPlayerCard) {
        return displayWinner(playerWinsText);
      } else {
        return displayWinner(computerWinsText);
      }
    } else if (numOfOverlaysFromRightToLeft == 4) {
      if (isPlayerCard) {
        return displayWinner(playerWinsText);
      } else {
        return displayWinner(computerWinsText);
      }
    }

    col++;
  }
}

function displayWinner(gameOverText) {
  if (!isGameOver) {
    shouldShowProgressBar(false);
    var h = document.createElement("H1");
    var t = document.createTextNode(gameOverText);
    h.appendChild(t);
    winnerDisplay.appendChild(h);
    winnerDisplay.setAttribute("class", "");
    winnerDisplay.classList.add("show");
    winnerDisplay.classList.add("alert");
    winnerDisplay.classList.add("alert-success");
    clearInterval(countdownTimer);
    gameOver();
  }
}

function shuffleDeck() {
  var shuffledCards = [];

  while(shuffledCards.length != cards.length) {
    var randomCardIndex = generateRandomCardIndex();
    while(shuffledCards.includes(randomCardIndex)) {
      randomCardIndex = generateRandomCardIndex();
    }
    shuffledCards.push(randomCardIndex);
  }

  return shuffledCards;
}

function shouldPauseTimer(shouldPauseTimer) {
  if (shouldPauseTimer) {
    clearInterval(countdownTimer);
  } else {
    countdownTimer = setInterval(updateTimer, 1000);

    progressBar.value = 5 - countdownTimerSeconds;
    countdownTimerSeconds -= 1;

    if(countdownTimerSeconds < 0){
      clearInterval(countdownTimer);
      countdownTimerSeconds = 5;
      countdownTimer = setInterval(updateTimer, 1000);
      onDeckClicked();
    }
  }
}

function updateTimer() {
  progressBar.value = 5 - countdownTimerSeconds;
  countdownTimerSeconds -= 1;

  if(countdownTimerSeconds < 0){
    clearInterval(countdownTimer);
    countdownTimerSeconds = 5;
    countdownTimer = setInterval(updateTimer, 1000);
    onDeckClicked();
  }
}

function shouldShowProgressBar(shouldShowProgressBar) {
  if (shouldShowProgressBar) {
    progressBar.setAttribute("class", "")
    progressBar.classList.add("show");
  } else {
    progressBar.setAttribute("class", "")
    progressBar.classList.add("hide");
  }
}

function resetTableRows(table) {
  var row = 1;
  tableRow = table.rows[row];
  while(tableRow != null) {
    tableRow.parentNode.removeChild(tableRow);
    tableRow = table.rows[row];
  }
}

function generateRandomCardIndex() {
  return Math.floor((Math.random() * cards.length));
}

function generateRandomTableCardsIndex() {
  console.log(currentLeftCard);

  var tempLargeCardIndex = Math.floor((Math.random() * largeCards.length));
  while(tempLargeCardIndex === currentLeftCard) {
    tempLargeCardIndex = Math.floor((Math.random() * largeCards.length));
  }
  console.log(tempLargeCardIndex);
  return tempLargeCardIndex;
}

function setupLargeCards() {
  tabla1 = [
    1, 2, 3, 4,
    10, 11, 12, 13,
    19, 20, 21, 22,
    28, 29, 30, 31];
  largeCards.push(tabla1);

  tabla2 = [
    6, 7, 8, 9,
    15, 16, 17, 18,
    24, 25, 26, 27,
    33, 34, 35, 36];
  largeCards.push(tabla2);

  tabla3 = [
    2, 3, 4, 5,
    6, 8, 9, 10,
    12, 13, 14, 15,
    17, 18, 19, 20];
  largeCards.push(tabla3);

  tabla4 = [
    43, 44, 45, 21,
    52, 53, 54, 26,
    7, 8, 9, 31,
    16, 17, 18, 36];
  largeCards.push(tabla4);

  tabla5 = [
    22, 23, 24, 25,
    27, 28, 29, 30,
    32, 33, 34, 35,
    37, 38, 39, 40]
  largeCards.push(tabla5);

  tabla6 = [
    21, 22, 23, 24,
    30, 31, 32, 33,
    39, 40, 41, 42,
    48, 49, 50, 51];
  largeCards.push(tabla6);

  tabla7 = [
    25, 26, 27, 41, 34, 35, 36, 46, 43, 44, 45, 51, 52, 53, 54, 32];
  largeCards.push(tabla7);

  tabla8 = [
    42, 43, 44, 45,
    47, 48, 49, 50,
    52, 53, 54, 1,
    40, 10, 19, 30];
  largeCards.push(tabla8);

  tabla9 = [
    41, 42, 37, 38,
    50, 51, 46, 47,
    5, 6, 1, 2,
    14, 15, 10, 11
  ];
  largeCards.push(tabla9);

  tabla10 = [
    40, 23, 4, 5,
    27, 28, 9, 30,
    32, 13, 34, 35,
    37, 18, 39, 22
  ];
  largeCards.push(tabla10);

return largeCards;
}

function createAllCards() {
  var arr = [];

  var card = new Object();
  card.cardNumber = 1;
  card.cardName = "El Gallo";
  card.cardImage = "assets/img/elGallo.png";
  arr.push(card);

  card  = new Object();
  card.cardNumber = 2;
  card.cardName = "El Diablito";
  card.cardImage = "assets/img/elDiablito.png";
  arr.push(card);

  card = new Object();
  card.cardNumber = 3;
  card.cardName = "La Dama";
  card.cardImage = "assets/img/laDama.png";
  arr.push(card);

  card = new Object();
  card.cardNumber = 4;
  card.cardName = "El Catrín";
  card.cardImage = "assets/img/elCatrin.png";
  arr.push(card);

  card = new Object();
  card.cardNumber = 5;
  card.cardName = "El Paraguas";
  card.cardImage = "assets/img/elParaguas.png";
  arr.push(card);

  card = new Object();
  card.cardNumber = 6;
  card.cardName = "La Sirena";
  card.cardImage = "assets/img/laSirena.png";
  arr.push(card);

  card = new Object();
  card.cardNumber = 7;
  card.cardName = "La Escalera";
  card.cardImage = "assets/img/laEscalera.png";
  arr.push(card);

  card = new Object();
  card.cardNumber = 8;
  card.cardName = "La Botella";
  card.cardImage = "assets/img/laBotella.png";
  arr.push(card);

  card = new Object();
  card.cardNumber = 9;
  card.cardName = "El Barril";
  card.cardImage = "assets/img/elBarril.png";
  arr.push(card);

  card = new Object();
  card.cardNumber = 10;
  card.cardName = "El Arbol";
  card.cardImage = "assets/img/elArbol.png";
  arr.push(card);

  card = new Object();
  card.cardNumber = 11;
  card.cardName = "El Melon";
  card.cardImage = "assets/img/elMelon.png";
  arr.push(card);

  card = new Object();
  card.cardNumber = 12;
  card.cardName = "El Valiente";
  card.cardImage = "assets/img/elValiente.png";
  arr.push(card);

  card = new Object();
  card.cardNumber = 13;
  card.cardName = "El Gorrito";
  card.cardImage = "assets/img/elGorrito.png";
  arr.push(card);

  card = new Object();
  card.cardNumber = 14;
  card.cardName = "La Muerte";
  card.cardImage = "assets/img/laMuerte.png";
  arr.push(card);

  card = new Object();
  card.cardNumber = 15;
  card.cardName = "La Pera";
  card.cardImage = "assets/img/laPera.png";
  arr.push(card);

  card = new Object();
  card.cardNumber = 16;
  card.cardName = "La Bandera";
  card.cardImage = "assets/img/laBandera.png";
  arr.push(card);

  card = new Object();
  card.cardNumber = 17;
  card.cardName = "El Bandolón";
  card.cardImage = "assets/img/elBandolon.png";
  arr.push(card);

  card = new Object();
  card.cardNumber = 18;
  card.cardName = "El Violoncello";
  card.cardImage = "assets/img/elVioloncello.png";
  arr.push(card);

  card = new Object();
  card.cardNumber = 19;
  card.cardName = "La Garza";
  card.cardImage = "assets/img/laGarza.png";
  arr.push(card);

  card = new Object();
  card.cardNumber = 20;
  card.cardName = "El Pájaro";
  card.cardImage = "assets/img/elPajaro.png";
  arr.push(card);

  card = new Object();
  card.cardNumber = 21;
  card.cardName = "La Mano";
  card.cardImage = "assets/img/laMano.png";
  arr.push(card);

  card = new Object();
  card.cardNumber = 22;
  card.cardName = "La Bota";
  card.cardImage = "assets/img/laBota.png";
  arr.push(card);

  card = new Object();
  card.cardNumber = 23;
  card.cardName = "La Luna";
  card.cardImage = "assets/img/laLuna.png";
  arr.push(card);

  card = new Object();
  card.cardNumber = 24;
  card.cardName = "El Cotorro";
  card.cardImage = "assets/img/elCotorro.png";
  arr.push(card);

  card = new Object();
  card.cardNumber = 25;
  card.cardName = "El Borracho";
  card.cardImage = "assets/img/elBorracho.png";
  arr.push(card);

  card = new Object();
  card.cardNumber = 26;
  card.cardName = "El Negrito";
  card.cardImage = "assets/img/elNegrito.png";
  arr.push(card);

  card = new Object();
  card.cardNumber = 27;
  card.cardName = "El Corazón";
  card.cardImage = "assets/img/elCorazon.png";
  arr.push(card);

  card = new Object();
  card.cardNumber = 28;
  card.cardName = "La Sandía";
  card.cardImage = "assets/img/laSandia.png";
  arr.push(card);

  card = new Object();
  card.cardNumber = 29;
  card.cardName = "El Tambor";
  card.cardImage = "assets/img/elTambor.png";
  arr.push(card);

  card = new Object();
  card.cardNumber = 30;
  card.cardName = "El Camarón";
  card.cardImage = "assets/img/elCamaron.png";
  arr.push(card);

  card = new Object();
  card.cardNumber = 31;
  card.cardName = "Las Jaras";
  card.cardImage = "assets/img/lasJaras.png";
  arr.push(card);

  card = new Object();
  card.cardNumber = 32;
  card.cardName = "El Músico";
  card.cardImage = "assets/img/elMusico.png";
  arr.push(card);

  card = new Object();
  card.cardNumber = 33;
  card.cardName = "La Araña";
  card.cardImage = "assets/img/laArana.png";
  arr.push(card);

  card = new Object();
  card.cardNumber = 34;
  card.cardName = "El Soldado";
  card.cardImage = "assets/img/elSoldado.png";
  arr.push(card);

  card = new Object();
  card.cardNumber = 35;
  card.cardName = "La Estrella";
  card.cardImage = "assets/img/laEstrella.png";
  arr.push(card);

  card = new Object();
  card.cardNumber = 36;
  card.cardName = "El Cazo";
  card.cardImage = "assets/img/elCazo.png";
  arr.push(card);

  card = new Object();
  card.cardNumber = 37;
  card.cardName = "El Mundo";
  card.cardImage = "assets/img/elMundo.png";
  arr.push(card);

  card = new Object();
  card.cardNumber = 38;
  card.cardName = "El Apache";
  card.cardImage = "assets/img/elApache.png";
  arr.push(card);

  card = new Object();
  card.cardNumber = 39;
  card.cardName = "El Nopal";
  card.cardImage = "assets/img/elNopal.png";
  arr.push(card);

  card = new Object();
  card.cardNumber = 40;
  card.cardName = "El Alacrán";
  card.cardImage = "assets/img/elAlacran.png";
  arr.push(card);

  card = new Object();
  card.cardNumber = 41;
  card.cardName = "La Rosa";
  card.cardImage = "assets/img/laRosa.png";
  arr.push(card);

  card = new Object();
  card.cardNumber = 42;
  card.cardName = "La Calavera";
  card.cardImage = "assets/img/laCalavera.png";
  arr.push(card);

  card = new Object();
  card.cardNumber = 43;
  card.cardName = "La Campana";
  card.cardImage = "assets/img/laCampana.png";
  arr.push(card);

  card = new Object();
  card.cardNumber = 44;
  card.cardName = "El Cantarito";
  card.cardImage = "assets/img/elCantarito.png";
  arr.push(card);

  card = new Object();
  card.cardNumber = 45;
  card.cardName = "El Venado";
  card.cardImage = "assets/img/elVenado.png";
  arr.push(card);

  card = new Object();
  card.cardNumber = 46;
  card.cardName = "El Sol";
  card.cardImage = "assets/img/elSol.png";
  arr.push(card);

  card = new Object();
  card.cardNumber = 47;
  card.cardName = "La Corona";
  card.cardImage = "assets/img/laCorona.png";
  arr.push(card);

  card = new Object();
  card.cardNumber = 48;
  card.cardName = "La Chalupa";
  card.cardImage = "assets/img/laChalupa.png";
  arr.push(card);

  card = new Object();
  card.cardNumber = 49;
  card.cardName = "El Pino";
  card.cardImage = "assets/img/elPino.png";
  arr.push(card);

  card = new Object();
  card.cardNumber = 50;
  card.cardName = "El Pescado";
  card.cardImage = "assets/img/elPescado.png";
  arr.push(card);

  card = new Object();
  card.cardNumber = 51;
  card.cardName = "La Palma";
  card.cardImage = "assets/img/laPalma.png";
  arr.push(card);

  card = new Object();
  card.cardNumber = 52;
  card.cardName = "La Maceta";
  card.cardImage = "assets/img/laMaceta.png";
  arr.push(card);

  card = new Object();
  card.cardNumber = 53;
  card.cardName = "El Arpa";
  card.cardImage = "assets/img/elArpa.png";
  arr.push(card);

  card = new Object();
  card.cardNumber = 54;
  card.cardName = "La Rana";
  card.cardImage = "assets/img/laRana.png";
  arr.push(card);

  return arr;
}
