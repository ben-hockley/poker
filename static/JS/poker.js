//spades,clubs,hearts,diamonds
deck = [
    '2S','3S','4S','5S','6S','7S','8S','9S','TS','JS','QS','KS','AS',
    '2C','3C','4C','5C','6C','7C','8C','9C','TC','JC','QC','KC','AC',
    '2H','3H','4H','5H','6H','7H','8H','9H','TH','JH','QH','KH','AH',
    '2D','3D','4D','5D','6D','7D','8D','9D','TD','JD','QD','KD','AD'
]

//4 player game
//Arrays for player and CPU hands
player = [];
cpu1 = [];
cpu2 = [];
cpu3 = [];

//shuffles deck
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

//deal first two cards
function dealHands(){
    //logic
    for (i=0;i<2;i++){
        player.push(deck[0])
        deck.splice(0, 1)
        printPlayerCard();
        window.

        cpu1.push(deck[0])
        deck.splice(0, 1)
        cardFaceDown("cpu1");

        cpu2.push(deck[0])
        deck.splice(0, 1)
        cardFaceDown("cpu2");

        cpu3.push(deck[0])
        deck.splice(0, 1)
        cardFaceDown("cpu3");
    }
}

//shows a card face up
function printPlayerCard(){
    var card = document.createElement('img');
    card.className = 'cardImg'
    card.setAttribute("src", "/static/img/"+player[player.length-1]+".png")
    document.getElementById("player").appendChild(card)
}

//puts a card face down
function cardFaceDown(container){
    var card = document.createElement('img');
    card.className = 'cardImg'
    card.setAttribute("src", "/static/img/BACK.png")
    document.getElementById(container).appendChild(card)
}

//turns go round in circle
order = ['cpu1', 'cpu2', 'cpu3', 'player']
var turn = 0 //index of order (cpu1)
activePlayer = order[turn]

function nextTurn(){
    document.getElementById(activePlayer).style.backgroundColor = 'White'; //sets old user to white
    if (turn == 3){
        turn = 0
    } else {
        turn += 1
    }
    activePlayer = order[turn]
    console.log(activePlayer)
    document.getElementById(activePlayer).style.backgroundColor = 'Green'; //sets new user to green
}

