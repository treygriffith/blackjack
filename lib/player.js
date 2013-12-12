var EventEmitter = require('events').EventEmitter;


module.exports = Player;

function Player(i) {
  this.num = i;
  this.cards = [];
  this.active = true;
  this.busted = false;
}

Player.prototype.__proto__ = EventEmitter.prototype;


Player.prototype.takeTurn = function (fn) {
  this.emit('turn', fn);

  if(!this.num) {
    // dealer
    if(this.handValue() >= 17) {
      return this.stay(fn);
    }

    return this.hit(fn);

  }
};

Player.prototype.stay = function (fn) {
  this.active = false;
  this.emit('stay');

  fn("stay");

  return "stay";
};

Player.prototype.hit = function (fn) {
  this.emit('hit');

  fn("hit");

  return "hit";
};

Player.prototype.bust = function () {
  if(this.handValue() > 21) {
    this.busted = true;
    this.emit('bust');
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

Player.prototype.cardString = function (hideFirst) {
  return this.cards.map(function (card, i) {
    return hideFirst && !i ? "Facedown" : card.card;
  }).join(' ');
};