"use strict";

const five = require('johnny-five');
const Tessel = require('tessel-io');
const Soar = require('./soar.js');
const board = new five.Board({
  io : new Tessel(),
  repl : false
});

board.on('ready', () => {

    const soar = new Soar(this, five);

    soar.start();

});
