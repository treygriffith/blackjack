module.exports = Card;

var suits = {
  hearts: "\u2665",
  clubs: "\u2663",
  diamonds: "\u2666",
  spades: "\u2660"
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

Card.prototype.toString = function () {
  return this.card + suits[this.suit];
};