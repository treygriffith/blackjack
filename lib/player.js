var EventEmitter = require('events').EventEmitter;


module.exports = Player;

function Player(i, game) {
  this.num = i;
  this.cards = [];
  this.active = true;
  this.busted = false;
}

Player.prototype.__proto__ = EventEmitter.prototype;


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
  this.emit(this.won ? "win" : "loss");
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