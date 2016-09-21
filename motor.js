"use strict";

const five = require('johnny-five');
const Tessel = require('tessel-io');
const board = new five.Board({
  io : new Tessel(),
  repl : false
});

board.on('ready', () => {

    const motor = new five.Motor({
        controller: "PCA9685",
        frequency: 200, // Hz
        pins: {
            pwm: 8,
            dir: 9,
            cdir: 10,
        }
    });

    motor.forward();

});
