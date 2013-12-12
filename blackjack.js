// house hits until 17, stays
// 52 card deck, every game has a new deck
// stay hit user interface

var suits = ["hearts", "spades", "diamonds", "clubs"];
var cards = [2, 3, 4, 5, 6, 7, 8, 9, "J", "Q", "K", "A"];

function Game(numPlayers) {

  this.cardsPerPlayer = 2;
  this.players = [];
  for(var i=0; i<numPlayers; i++) {
    this.players.push(new Player(i));
  }

  this.currentPlayer = 0;

  this.deck = [];

  this.shuffleDeck();
  this.deal();

  // check for dealer victory
  if(this.players[0].blackjack()) {
    // game over
    this.players[0].win();
    this.end();
  } else {
    // start the game
    this.nextPlayer();
  }
}

Game.prototype.end = function () {
  this.players.forEach(function (player) {
    player.end();
  });
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
};

Game.prototype.hit = function (player) {
  player.cards.push(game.deck.shift());
};

Game.prototype.nextPlayer = function () {
  var dealer = this.players[0];

  this.currentPlayer++;

  var activePlayers = this.players.slice(1).filter(function (player) {
    return !player.busted;
  });

  if(this.currentPlayer === this.players.length) {
    
    // check if everyone else has busted

    if(!activePlayers.length) {
      dealer.win();
      this.end();
    }
    
    // dealer's turn
    return this.turn(dealer);
  }

  if(this.currentPlayer > this.players.length) {
    activePlayers.forEach(function (player) {
      if(player.beat(dealer)) {
        player.win();
      }
    });

  }

  if(!this.players[this.currentPlayer].active || !this.players[this.currentPlayer].busted) return this.nextPlayer();

  this.turn(this.players[this.currentPlayer]);
};

Game.prototype.turn = function (player) {
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


function Player(i, game) {
  this.num = i;
  this.cards = [];
  this.active = true;
  this.busted = false;
}

Player.prototype.takeTurn = function () {
  if(!this.num) {
    // dealer
    if(this.handValue() >= 17) {
      return this.stay();
    }

    return this.hit();

  } else {
    // user
  }
};

Player.prototype.stay = function () {
  this.active = false;
  
  return "stay";
};

Player.prototype.hit = function () {
  return "hit";
};

Player.prototype.bust = function () {
  if(this.handValue() > 21) {
    this.busted = true;
    return true;
  }

  return false;
};

Player.prototype.beat = function (player) {
  if(this.handValue() > player.handValue()) return true;
  return false;
};

Player.prototype.win = function () {
  this.won = true;
};

Player.prototype.end = function () {

};

Player.prototype.blackjack = function () {
  if(this.handValue() === 21 && this.cards.length === 2) return true;
  return false;
};

Player.prototype.handValue = function () {
  var value = 0;

  this.cards.forEach(function (card) {
    value += card.value();
  });

  // special case for aces with dual values
  var aces = this.cards.filter(function (card) {
    return card.card === 'A';
  });

  aces.forEach(function () {
    if(value < 11) {
      value += 11;
    } else {
      value += 1;
    }
  });

  return value;
};

function Card(suit, card) {
  this.suit = suit;
  this.card = card;
}

Card.prototype.value = function () {
  var val = typeof(this.card) === 'number' ? this.card : 10;

  if(this.card === 'A') {
    return 0;
  }

  return val;
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