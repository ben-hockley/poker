//shuffles deck on page load.
function shuffle(){ 
    deck = [
        '2S','3S','4S','5S','6S','7S','8S','9S','TS','JS','QS','KS','AS',
        '2C','3C','4C','5C','6C','7C','8C','9C','TC','JC','QC','KC','AC',
        '2H','3H','4H','5H','6H','7H','8H','9H','TH','JH','QH','KH','AH',
        '2D','3D','4D','5D','6D','7D','8D','9D','TD','JD','QD','KD','AD'
    ]
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
function cardFaceUp(container, arrayName){
    //get card on top of deck, and remove it from the deck.
    cardDealt = deck[0];
    deck.splice(0,1);

    var card = document.createElement('img');
    card.className = 'cardImg';
    card.id = cardDealt;
    arrayName.push(cardDealt);
    card.setAttribute("src","/static/img/"+cardDealt+".png");
    document.getElementById(container).appendChild(card);
}

//deals a card face down
function cardFaceDown(container, arrayName){
    cardDealt = deck[0];
    deck.splice(0,1);

    var card = document.createElement('img');
    card.className = 'cardImg';
    card.id = cardDealt;
    arrayName.push(cardDealt);
    card.setAttribute("src", "/static/img/BACK.png");
    document.getElementById(container).appendChild(card);
}

//turns go round in circle
var turn = 3; //index of order, bet arrays (cpu1 starts)
var roundsPlayed = 0; //counts rounds played 
var roundsPlayedIncrementer = 0.25; //value to add to rounds played upon check (depends on number of players still in)


// Bank
var bankBalance = 0;

var cpu1Chips = 100; //first to play
var cpu2Chips = 100;
var cpu3Chips = 100;
var playerChips = 100;



//deal first two cards to each player
//player cards visible (face up)
//CPU cards hidden (face down)
function dealHands(){
    for (i=0;i<2;i++){ //deal two cards to each player
        cardFaceUp("player",playerHand);
        cardFaceDown("cpu1",cpu1Hand);
        cardFaceDown("cpu2",cpu2Hand);
        cardFaceDown("cpu3",cpu3Hand);
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


var smallBlind = 1;
var bigBlind = 2;
//setup game by dealing hands and printing bets and chips to the table
function setupGame(){
    playerHand = [];
    cpu1Hand = [];
    cpu2Hand = [];
    cpu3Hand = [];
    cardsOnTable = [];

    roundsPlayed = 0;
    roundsPlayedIncrementer = 0.25;
    gameStage = 0;

    document.getElementById('cpu1').innerHTML = '';
    document.getElementById('cpu2').innerHTML = '';
    document.getElementById('cpu3').innerHTML = '';
    document.getElementById('player').innerHTML = '';
    document.getElementById('cardsOnTheTable').innerHTML = '';

    order = ['cpu1', 'cpu2', 'cpu3', 'player'];
    bet = [0, 0, 0, 0];

    if (smallBlind == 3){
        smallBlind = 0;
    } else {
        smallBlind += 1;
    }
    bet[smallBlind] += 5;
    switch (smallBlind){
        case 0:
            cpu1Chips -= 5;
            break;
        case 1:
            cpu2Chips -= 5;
            break;
        case 2:
            cpu3Chips -= 5;
            break;
        case 3:
            playerChips -= 5;
            break;
    }

    if (bigBlind == 3){
        bigBlind = 0;
    } else {
        bigBlind += 1;
    }
    bet[bigBlind] += 10;
    switch (bigBlind){
        case 0:
            cpu1Chips -= 10;
            break;
        case 1:
            cpu2Chips -= 10;
            break;
        case 2:
            cpu3Chips -= 10;
            break;
        case 3:
            playerChips -= 10;
            break;
    }

    if (turn == 3){
        turn = 0;
    } else {
        turn += 1;
    }

    document.getElementById('cpu1').style.backgroundColor = 'white';
    document.getElementById('cpu2').style.backgroundColor = 'white';
    document.getElementById('cpu3').style.backgroundColor = 'white';
    document.getElementById('player').style.backgroundColor = 'white';

    document.getElementsByClassName('hand')[turn].style.backgroundColor = 'green';


    shuffle();
    dealHands();
    printBetsandChips();
    document.getElementById('playButton').style.display = 'none'; //hide play button
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
    cardFaceUp("cardsOnTheTable",cardsOnTable);
    cardFaceUp("cardsOnTheTable",cardsOnTable);
    cardFaceUp("cardsOnTheTable",cardsOnTable);
    roundsPlayed = 0; //resets rounds played
}
function showFourthCard(){
    cardFaceUp("cardsOnTheTable",cardsOnTable);
    roundsPlayed = 0;
}
function showFifthCard(){
    cardFaceUp("cardsOnTheTable",cardsOnTable);
    roundsPlayed = 0;
}
function revealCards(){
    showCards(); 
    [cpu1,cpu2,cpu3,player] = evaluateHands();
    winner = getWinner(cpu1,cpu2,cpu3,player);
    //give chips in bank to the winner
    if (winner){
        switch (winner){
            case 'cpu1':
                cpu1Chips += bankBalance;
                document.getElementById('cpu1Chips').innerHTML = cpu1Chips;
                break;
            case 'cpu2':
                cpu2Chips += bankBalance;
                document.getElementById('cpu2Chips').innerHTML = cpu2Chips;
                break;
            case 'cpu3':
                cpu3Chips += bankBalance;
                document.getElementById('cpu3Chips').innerHTML = cpu3Chips;
                break;
            case 'player':
                playerChips += bankBalance;
                document.getElementById('playerChips').innerHTML = playerChips;
                break;

        }
        bankBalance = 0;
        document.getElementById('bankBalance').innerHTML = bankBalance;
    }
    //show play button to start next game
    document.getElementById('playButton').style.display = 'block';
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

function evaluateHands(){

    //player's hand value defaulted to 0 (it will stay this way if folded)
    playerHandValue = 0;
    cpu1HandValue = 0;
    cpu2HandValue = 0;
    cpu3HandValue = 0;


    for (i=0;i<order.length;i++){
        //player's hand value increased if still in game.
        if (order[i] == 'player'){
            player7Cards = playerHand.concat(cardsOnTable);
            playerHandValue = (findBestCombo(player7Cards))[0];
        } else if(order[i] == 'cpu1'){
            cpu17Cards = cpu1Hand.concat(cardsOnTable);
            cpu1HandValue = (findBestCombo(cpu17Cards))[0];
        } else if(order[i] == 'cpu2'){
            cpu27Cards = cpu2Hand.concat(cardsOnTable);
            cpu2HandValue = (findBestCombo(cpu27Cards))[0];
        } else {
            cpu37Cards = cpu3Hand.concat(cardsOnTable);
            cpu3HandValue = (findBestCombo(cpu37Cards))[0];
        }
    }
    return [cpu1HandValue,cpu2HandValue,cpu3HandValue,playerHandValue];
}

function findBestCombo(seventhStreet){
    diamonds = 0;
    hearts = 0;
    clubs = 0;
    spades = 0;

    ace = 0;
    two = 0;
    three = 0;
    four = 0;
    five = 0;
    six = 0;
    seven = 0;
    eight = 0;
    nine = 0;
    ten = 0;
    jack = 0;
    queen = 0;
    king = 0;

    for (j=0;j<7;j++){
        switch (seventhStreet[j][0]){
            case 'A':
                ace += 1;
                break;
            case '2':
                two += 1;
                break;
            case '3':
                three += 1;
                break;
            case '4':
                four += 1;
                break;
            case '5':
                five += 1;
                break;
            case '6':
                six += 1;
                break;
            case '7':
                seven += 1;
                break;
            case '8':
                eight += 1;
                break;
            case '9':
                nine += 1;
                break;
            case 'T':
                ten += 1;
                break;
            case 'J':
                jack += 1;
                break;
            case 'Q':
                queen += 1;
                break;
            case 'K':
                king += 1;
                break;
        }
        switch (seventhStreet[j][1]){
            case 'D':
                diamonds += 1;
                break;
            case 'H':
                hearts += 1;
                break;
            case 'C':
                clubs += 1;
                break;
            case 'S':
                spades += 1;
                break;
        }
    }

    suits = [diamonds,hearts,clubs,spades];
    numbers = [two,three,four,five,six,seven,eight,nine,ten,jack,queen,king,ace];
    console.log(suits);
    console.log(numbers);

    var handValue; //Royal Flush = 10, Straight Flush = 9 etc.
    var type; //used for tiebreakers, better type = better hand.

    //Royal Flush ? = 10 //this is faulty, fix it.
    if (
        //seventhStreet.includes('AD','KD','QD','JD','TD')||
        //seventhStreet.includes('AH','KH','QH','JH','TH')||
        //seventhStreet.includes('AC','KC','QC','JC','TC')||
        //seventhStreet.includes('AS','KS','QS','JS','TS')
        Math.max(...numbers) == 20 //impossible placefiller statement
    ){
        console.log('Royal Flush!');
        handValue = 10;
        type = 1;
        type2 = 1;//placefillers
    }
    //Straight Flush? = 9 => Not sure on best way to do this.
    //Four of a kind? = 8
    else if (Math.max(...numbers) == 4){
        console.log('4 of a kind!');
        handValue = 8;
        type = numbers.lastIndexOf(4);
    } 
    //Full house? = 7
    else if (Math.max(...numbers) == 3 && numbers.includes(2)){
        console.log('Full House!');
        handValue = 7;
        type = numbers.lastIndexOf(3);
        type2 = numbers.indexOf(2);
    }
    //Flush? = 6
    else if (Math.max(...suits) >= 5){
        console.log('Flush!');
        handValue = 6;
        type = numbers.lastIndexOf(1); //high card
        type2 = (numbers.splice(numbers.lastIndexOf(1),1)).lastIndexOf(1); //2nd highest card
    }
    //Straight? = 5
    else if (
        Math.min(...numbers.slice(0,5)) == 1|| //23456
        Math.min(...numbers.slice(1,6)) == 1|| //34567
        Math.min(...numbers.slice(2,7)) == 1|| //45678
        Math.min(...numbers.slice(3,8)) == 1|| //56789
        Math.min(...numbers.slice(4,9)) == 1|| //6789T
        Math.min(...numbers.slice(5,10)) == 1|| //789TJ
        Math.min(...numbers.slice(6,11)) == 1|| //89TJQ
        Math.min(...numbers.slice(7,12)) == 1|| //9TJQK
        Math.min(...numbers.slice(8,13)) == 1|| //TJQKA
        (Math.min(...numbers.slice(0,4)) == 1 && numbers[12] > 0) //A2345
        ){
        console.log('Straight!');
        handValue = 5;
        //type for tiebreakers
        if (Math.min(...numbers.slice(0,4)) == 1 && numbers[12] > 0) type = 0; //weakest straight
        if (Math.min(...numbers.slice(0,5)) == 1) type = 1;
        if (Math.min(...numbers.slice(1,6)) == 1) type = 2;
        if (Math.min(...numbers.slice(2,7)) == 1) type = 3;
        if (Math.min(...numbers.slice(3,8)) == 1) type = 4;
        if (Math.min(...numbers.slice(4,9)) == 1) type = 5;
        if (Math.min(...numbers.slice(5,10)) == 1) type = 6;
        if (Math.min(...numbers.slice(6,11)) == 1) type = 7;
        if (Math.min(...numbers.slice(7,12)) == 1) type = 8;
        if (Math.min(...numbers.slice(8,13)) == 1) type = 9; //strongest straight

        type2 = numbers.lastIndexOf(1); //high card
    }
    //Three of a kind? = 4
    else if (Math.max(...numbers) == 3){
        console.log('3 of a kind!');
        handValue = 4;
        type = numbers.indexOf(3);
        type2 = numbers.lastIndexOf(1); //high card
    }
    //Two pair? = 3
    else if (Math.max(...numbers) == 2 && numbers.findIndex(x=>x==2) != numbers.findLastIndex(x=>x==2)){
        console.log('Two Pair!');
        handValue = 3;
        type = numbers.lastIndexOf(2); //higher pair
        type2 = numbers.indexOf(2); //lower pair
    }
    //Pair? = 2
    else if (Math.max(...numbers) == 2){
        console.log('Pair!');
        handValue = 2;
        type = numbers.indexOf(2); //higher index = better pair (Ace=12 is best)
        type2 = numbers.lastIndexOf(1); //high card
    }
    //High Card = 1
    else {
        console.log('High Card!');
        handValue = 1;
        type = numbers.lastIndexOf(1); //high card
        type2 = (numbers.splice(numbers.lastIndexOf(1),1)).lastIndexOf(1); //2nd highest card
    }
    return [handValue,type,type2];
}

function getWinner(cpu1, cpu2, cpu3, player){ //player's hand values given as parameters
    handValues = [cpu1, cpu2, cpu3, player];
    bestCombo = Math.max(...handValues); //finds highest hand value out of players.
    winnerHandType = getWinnerHandType(bestCombo); //String of winning hand type (e.g. 'Royal Flush).
    //check whether there is more than one player with the best hand type.
    if (handValues.indexOf(bestCombo) == handValues.lastIndexOf(bestCombo)){
        winningIndex = handValues.indexOf(bestCombo);
    } //more than one player had the winning hand type, tiebreaker required
    else {
        playersWithBestHandType = 0;
        winningPlayersIndexes = [];
        winningPlayersTypes = [];
        for (i=0;i<4;i++){
            if (handValues[i] == bestCombo){
                playersWithBestHandType += 1;
                winningPlayersIndexes.push(i);
            }
        };
        console.log(playersWithBestHandType + " players have a " + winnerHandType);
        console.log("tiebreaker required");
        alert(playersWithBestHandType + " players have a " + winnerHandType + " ,tiebreaker required");

        for (i=0;i<winningPlayersIndexes.length;i++){
            switch (winningPlayersIndexes[i]){
                case 0:
                    winnersType = (findBestCombo(cpu17Cards))[1]
                    winningPlayersTypes.push(winnersType);
                    break;
                case 1:
                    winnersType = (findBestCombo(cpu27Cards))[1]
                    winningPlayersTypes.push(winnersType);
                    break;
                case 2:
                    winnersType = (findBestCombo(cpu37Cards))[1]
                    winningPlayersTypes.push(winnersType);
                    break;
                case 3:
                    winnersType = (findBestCombo(player7Cards))[1]
                    winningPlayersTypes.push(winnersType);
                    break;
            }
        }
        bestType = Math.max(...winningPlayersTypes);
        if (winningPlayersTypes.indexOf(bestType) == winningPlayersTypes.lastIndexOf(bestType)){
            bestTypeListIndex = winningPlayersTypes.indexOf(bestType);
            winningIndex = winningPlayersIndexes[bestTypeListIndex];
        } else {
            winningIndex = null;
        }
    }
    switch (winningIndex){
        case 0:
            console.log('cpu1 wins with a ' + winnerHandType);
            alert('cpu1 wins with a ' + winnerHandType);
            winner = 'cpu1';
            document.getElementById('cpu1').style.backgroundColor = 'gold';
            break;
        case 1:
            console.log('cpu2 wins with a ' + winnerHandType);
            alert('cpu2 wins with a ' + winnerHandType);
            winner = 'cpu2';
            document.getElementById('cpu2').style.backgroundColor = 'gold';
            break;
        case 2:
            console.log('cpu3 wins with a ' + winnerHandType);
            alert('cpu3 wins with a ' + winnerHandType);
            winner = 'cpu3';
            document.getElementById('cpu3').style.backgroundColor = 'gold';
            break;
        case 3:
            console.log('player wins with a ' + winnerHandType);
            alert('player wins with a ' + winnerHandType);
            winner = 'player';
            document.getElementById('player').style.backgroundColor = 'gold';
            break;
        default:
            console.log("couldn't determine winner");
            alert("we couldn't determine which hand won this time, fix coming soon");
            winner = null;
            break;
    }
    return winner;
}

function getWinnerHandType(bestComboValue){
    winningHand = '';
    switch (bestComboValue){
        case 10:
            winningHand = 'Royal Flush';
            break;
        case 9:
            winningHand = 'Straight Flush';
            break;
        case 8:
            winningHand = 'Four of a kind';
            break;
        case 7:
            winningHand = 'Full House';
            break;
        case 6:
            winningHand = 'Flush';
            break;
        case 5:
            winningHand = 'Straight';
            break;
        case 4:
            winningHand = 'Three of a kind';
            break;
        case 3:
            winningHand = 'Two pair';
            break;
        case 2:
            winningHand = 'Pair';
            break;
        case 1:
            winningHand = 'High Card';
            break;
    }
    return winningHand;
}


function showCards(){
    for (i=0;i<order.length;i++){
        firstCardName = document.getElementById(order[i]).firstChild.id;
        document.getElementById(order[i]).firstChild.setAttribute("src","/static/img/"+firstCardName+".png");
        secondCardName = document.getElementById(order[i]).lastChild.id;
        document.getElementById(order[i]).lastChild.setAttribute("src","/static/img/"+secondCardName+".png");
    }
}
