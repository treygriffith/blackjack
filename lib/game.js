var suits = ["hearts", "spades", "diamonds", "clubs"];
var cards = [2, 3, 4, 5, 6, 7, 8, 9, "J", "Q", "K", "A"];

var Card = require('./card')
  , Player = require('./player')
  , EventEmitter = require('events').EventEmitter;


module.exports = Game;

function Game(numPlayers) {

  this.cardsPerPlayer = 2;

  this.players = [];
  for(var i=0; i<numPlayers; i++) {
    this.players.push(new Player(i));
  }

  this.currentPlayer = 0;

  this.deck = [];
}

Game.prototype.__proto__ = EventEmitter.prototype;


Game.prototype.start = function () {

  this.emit('start');

  this.currentPlayer = 0;

  this.deck = [];

  this.shuffleDeck();
  this.deal();

  // check for dealer victory
  if(this.players[0].blackjack()) {
    // game over
    this.players[0].win();
    return this.end();
  }

  // start the game
  this.nextPlayer();
};

Game.prototype.end = function () {
  this.players.forEach(function (player) {
    player.end();
  });

  this.emit('end');
};

Game.prototype.shuffleDeck = function () {
  var deck = this.deck;

  if(!this.deck.length) {
    suits.forEach(function (suit) {
      cards.forEach(function (card) {
        deck.push(new Card(suit, card));
      });
    });
  }

  shuffle(this.deck);

  return this.deck;
};

Game.prototype.deal = function () {
  var game = this;

  for(var i=0; i<this.cardsPerPlayer; i++) {
    this.players.forEach(function (player) {
      player.cards.push(game.deck.shift());
    });
  }

  this.emit('deal');
};

Game.prototype.hit = function (player) {
  player.cards.push(this.deck.shift());
};

Game.prototype.nextPlayer = function () {

  this.currentPlayer++;


  if(this.currentPlayer >= this.players.length) {
    return this.dealersTurn();
  }

  if(!this.players[this.currentPlayer].active || !this.players[this.currentPlayer].busted) return this.nextPlayer();

  this.turn(this.players[this.currentPlayer]);
};

Game.prototype.dealersTurn = function () {
  var dealer = this.players[0]
    , activePlayers = this.players.slice(1).filter(function (player) {
      return !player.busted;
    });

  if(!activePlayers.length) {
    dealer.win();
    return this.end();
  }

  if(!dealer.active) {
    return this.turn(dealer);
  }

  activePlayers.forEach(function (player) {
    if(player.beat(dealer)) player.win();
  });


    if(this.currentPlayer === this.players.length) {
    
    // check if everyone else has busted


    
    // dealer's turn
    return this.turn(dealer);
  }
};

Game.prototype.turn = function (player) {
  this.emit('turn', player);

  var action = player.takeTurn();

  if(action === 'hit') {
    this.hit(player);

    // check for bust
    if(player.bust()) {
      return this.nextPlayer();
    }

    if(player.blackjack()) {
      player.win();

      return this.nextPlayer();
    }

    this.turn(player);

  } else {
    this.nextPlayer();
  }
};


// utils

function shuffle(array) {
    var counter = array.length, temp, index;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}