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
bet = [0, 0, 0, 0]; //value each player has bet, values removed similarly to order array as game progresses.
var turn = 0 //index of order, bet arrays (cpu1 starts)

// Bank
var cpu1Chips = 100;
var cpu2Chips = 100;
var cpu3Chips = 100;
var playerChips = 100;



//deal first two cards to each player
//player cards visible (face up)
//CPU cards hidden (face down)
function dealHands(){
    for (i=0;i<2;i++){
        cardFaceUp("player");
        cardFaceDown("cpu1");
        cardFaceDown("cpu2");
        cardFaceDown("cpu3");
    }
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
}

function check(){
    document.getElementById(order[turn]).style.backgroundColor = 'White';
    turn += 1;
    if (turn == order.length){
        turn = 0;
    }
    document.getElementById(order[turn]).style.backgroundColor = 'Green';
}

function showFirstThreeCards(){
    cardFaceUp("cardsOnTheTable");
    cardFaceUp("cardsOnTheTable");
    cardFaceUp("cardsOnTheTable");
}

function raise(){
    bet[turn] += 5; //add bet to player.
    activePlayer = order[turn];
    switch (activePlayer) {
        case 'cpu1':
            cpu1Chips -= 5;
            document.getElementById('cpu1Bet').innerHTML = bet[turn]; //print bet to poker table.
            document.getElementById('cpu1Chips').innerHTML = cpu1Chips; //print chips to window
            break;
        case 'cpu2':
            cpu2Chips -= 5;
            document.getElementById('cpu2Bet').innerHTML = bet[turn];
            document.getElementById('cpu2Chips').innerHTML = cpu2Chips;
            break;
        case 'cpu3':
            cpu3Chips -= 5;
            document.getElementById('cpu3Bet').innerHTML = bet[turn];
            document.getElementById('cpu3Chips').innerHTML = cpu3Chips;
            break;
        case 'player':
            playerChips -= 5;
            document.getElementById('playerBet').innerHTML = bet[turn];
            document.getElementById('playerChips').innerHTML = playerChips;
            break;
    }
}