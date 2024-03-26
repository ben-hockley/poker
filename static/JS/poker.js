//spades,clubs,hearts,diamonds
deck = [
    '2S','3S','4S','5S','6S','7S','8S','9S','TS','JS','QS','KS','AS',
    '2C','3C','4C','5C','6C','7C','8C','9C','TC','JC','QC','KC','AC',
    '2H','3H','4H','5H','6H','7H','8H','9H','TH','JH','QH','KH','AH',
    '2D','3D','4D','5D','6D','7D','8D','9D','TD','JD','QD','KD','AD'
]

//4 player game
//Arrays for player and CPU hands
playerHand = [];
cpu1Hand = [];
cpu2Hand = [];
cpu3Hand = [];

//shuffles deck on page load.
function shuffle(){ 
    shuffledDeck = []
    while (deck.length > 0){
        randomIndex = Math.floor(Math.random() * deck.length);
        shuffledDeck.push(deck[randomIndex]);
        deck.splice(randomIndex, 1);
    }
    console.log(shuffledDeck);
    deck = shuffledDeck;
}

//deals a card face up
function cardFaceUp(container){
    //get card on top of deck, and remove it from the deck.
    cardDealt = deck[0];
    deck.splice(0,1);

    var card = document.createElement('img');
    card.className = 'cardImg';
    card.id = cardDealt;
    card.setAttribute("src","/static/img/"+cardDealt+".png");
    document.getElementById(container).appendChild(card);

}

//deals a card face down
function cardFaceDown(container){
    cardDealt = deck[0];
    deck.splice(0,1);

    var card = document.createElement('img');
    card.className = 'cardImg';
    card.id = cardDealt;
    card.setAttribute("src", "/static/img/BACK.png");
    document.getElementById(container).appendChild(card);
}

//turns go round in circle
order = ['cpu1', 'cpu2', 'cpu3', 'player'];
bet = [0, 0, 5, 10]; //value each player has bet, values removed similarly to order array as game progresses.
var turn = 0; //index of order, bet arrays (cpu1 starts)
var roundsPlayed = 0; //counts rounds played 
var roundsPlayedIncrementer = 0.25; //value to add to rounds played upon check (depends on number of players still in)


// Bank
var bankBalance = 0;

var cpu1Chips = 100; //first to play
var cpu2Chips = 100;
var cpu3Chips = 95; //small blind (5)
var playerChips = 90; //big blind (10)



//deal first two cards to each player
//player cards visible (face up)
//CPU cards hidden (face down)
function dealHands(){
    for (i=0;i<2;i++){ //deal two cards to each player
        cardFaceUp("player");
        cardFaceDown("cpu1");
        cardFaceDown("cpu2");
        cardFaceDown("cpu3");
    }
}
function printBetsandChips(){
    //print chips
    document.getElementById('cpu1Chips').innerHTML = cpu1Chips;
    document.getElementById('cpu2Chips').innerHTML = cpu2Chips;
    document.getElementById('cpu3Chips').innerHTML = cpu3Chips;
    document.getElementById('playerChips').innerHTML = playerChips;

    //print bets
    for (i=0;i<4;i++){
        document.getElementsByClassName('bet')[i].innerHTML = bet[i];
        //color code the bets.
        checkBetValue('cpu1','cpu1Bet');
        checkBetValue('cpu2','cpu2Bet');
        checkBetValue('cpu3','cpu3Bet');
        checkBetValue('player','playerBet');
    }
}

//setup game by dealing hands and printing bets and chips to the table
function setupGame(){
    dealHands();
    printBetsandChips();
}




//player controls
function fold(){
    //set players hand to red, to show they have folded
    document.getElementById(order[turn]).style.backgroundColor = 'Red';
    //remove player from the array 'order' so we do not cycle through them in future turns.
    order.splice(turn,1)
    //remove player from array 'bet' so we do not take more chips from this player.
    bet.splice(turn,1)
    if (turn == order.length){
        turn = 0;
    }
    document.getElementById(order[turn]).style.backgroundColor='Green';
    roundsPlayed += roundsPlayedIncrementer;
}


//implement a test to force user to either match the highest bet or fold
function check(){
    if (bet[turn] >= Math.max(...bet)){
        document.getElementById(order[turn]).style.backgroundColor = 'White';
    turn += 1;
    if (turn == order.length){
        turn = 0;
    }
    document.getElementById(order[turn]).style.backgroundColor = 'Green';
    roundsPlayed += roundsPlayedIncrementer;
    nextRoundMaybe(); //checks if all bets match and if they do, shows the next card/s.
    } else {
        alert("please match the bet or fold");
    }
}

function raise(){
    bet[turn] += 5; //add bet to player.
    activePlayer = order[turn];
    switch (activePlayer) {
        case 'cpu1':
            cpu1Chips -= 5;
            document.getElementById('cpu1Bet').innerHTML = bet[turn]; //print bet to poker table.
            document.getElementById('cpu1Chips').innerHTML = cpu1Chips; //print chips to window

            checkBetValue('cpu1','cpu1Bet');
            checkBetValue('cpu2','cpu2Bet');
            checkBetValue('cpu3','cpu3Bet');
            checkBetValue('player','playerBet');
            break;
        case 'cpu2':
            cpu2Chips -= 5;
            document.getElementById('cpu2Bet').innerHTML = bet[turn];
            document.getElementById('cpu2Chips').innerHTML = cpu2Chips;

            checkBetValue('cpu1','cpu1Bet');
            checkBetValue('cpu2','cpu2Bet');
            checkBetValue('cpu3','cpu3Bet');
            checkBetValue('player','playerBet');
            break;
        case 'cpu3':
            cpu3Chips -= 5;
            document.getElementById('cpu3Bet').innerHTML = bet[turn];
            document.getElementById('cpu3Chips').innerHTML = cpu3Chips;

            checkBetValue('cpu1','cpu1Bet');
            checkBetValue('cpu2','cpu2Bet');
            checkBetValue('cpu3','cpu3Bet');
            checkBetValue('player','playerBet');
            break;
        case 'player':
            playerChips -= 5;
            document.getElementById('playerBet').innerHTML = bet[turn];
            document.getElementById('playerChips').innerHTML = playerChips;

            checkBetValue('cpu1','cpu1Bet');
            checkBetValue('cpu2','cpu2Bet');
            checkBetValue('cpu3','cpu3Bet');
            checkBetValue('player','playerBet');
            break;
    }
}

//checks to see if all players have matched the bet
function checkBetValue(orderIndex,textID){

    turnFinder = order.findIndex(getOrderIndex);
    console.log(turnFinder);

    function getOrderIndex(index){
        return index == orderIndex;
    }

    if (bet[turnFinder] == Math.max(...bet)){
        document.getElementById(textID).style.color = 'Green';
    } else {
        document.getElementById(textID).style.color = 'Red';
    }
}


//starts next round of game if all users have either folded or matched the highest bet
function nextRoundMaybe(){
    function checkBetsMatch(betAmount){
        return betAmount == Math.max(...bet) //checks each bet matches the highest bet
    }
    if (bet.every(checkBetsMatch) && roundsPlayed >= 1){ //checks whether all players have been yet.
        gameStage += 1; //next game stage
        applyGameStage();
    }
}

var gameStage = 0;
function applyGameStage(){
    roundsPlayedIncrementer = (1/order.length) + 0.01; //add 0.01 for 1/3 stage so roundsPlayed passes 1.
    putBetsInBank();
    switch (gameStage){
        case 1:
            showFirstThreeCards();
            break;
        case 2:
            showFourthCard();
            break;
        case 3:
            showFifthCard();
            break;
        case 4:
            revealCards();
            break;
            //end of game
    }
}

//Game stage 1
function showFirstThreeCards(){
    cardFaceUp("cardsOnTheTable");
    cardFaceUp("cardsOnTheTable");
    cardFaceUp("cardsOnTheTable");
    roundsPlayed = 0; //resets rounds played
}
function showFourthCard(){
    cardFaceUp("cardsOnTheTable");
    roundsPlayed = 0;
}
function showFifthCard(){
    cardFaceUp("cardsOnTheTable");
    roundsPlayed = 0;
}
function revealCards(){
    //not sure on this one yet
}

function putBetsInBank(){
    for (i=0;i<bet.length;i++){
        bankBalance += bet[i];
        bet[i] = 0;
    }
    console.log(bankBalance);
    document.getElementById('bankBalance').innerHTML = bankBalance;
    document.querySelectorAll('.bet').forEach(e=> e.innerHTML = 0);
}