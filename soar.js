"use strict";

const within = require('./fn/within.js');

class Soar {
    constructor(ctx, five) {

        this.state = new Map();

        this.leds = {
            status : new five.Led('b5'),
            activity : new five.Led('b4')
        };

        this.sensors = {
            proximity : {
                left : new five.Proximity({
                    controller : 'GP2Y0A41SK0F',
                    pin : 'b6',
                    freq : 100
                }),
                right : new five.Proximity({
                    controller : 'GP2Y0A41SK0F',
                    pin : 'b7',
                    freq : 100
                })
            }
        };

        this.motors = {
            left : new five.Motor({
                controller: "PCA9685",
                frequency: 200, // Hz
                pins: {
                    pwm: 8,
                    dir: 9,
                    cdir: 10,
                },
            }),
            right : new five.Motor({
                controller: "PCA9685",
                frequency: 200, // Hz
                pins: {
                    pwm: 13,
                    dir: 12,
                    cdir: 11,
                },
            })
        }

    }

    start() {

        this.leds.status.on();

        this.sensors.proximity.left.on('data', (data) => {

            this.state.set('proximityLeft', data.cm);

            if (!isNaN(data.cm) && within([4, 10], data.cm) && !this.state.get('avoiding')) {
                this.avoid();
            }
        });

        this.sensors.proximity.right.on('data', (data) => {

            this.state.set('proximityRight', data.cm);

            if (!isNaN(data.cm) && within([4, 10], data.cm) && !this.state.get('avoiding')) {
                this.avoid();
            }
        });

        this.forward();

    }

    avoid () {

        const distanceLeft = this.state.get('proximityLeft');
        const distanceRight = this.state.get('proximityRight')

        this.state.set('avoiding', true);
        this.leds.activity.blink(100);
        this.stop();
        this.reverse();

        setTimeout(this.turn.bind(this, (distanceLeft < distanceRight ? 'left' : 'right')), 1000);
        setTimeout(function () {

            this.state.set('avoiding', false);
            this.leds.activity.stop().off();
            this.forward();

        }, 1500);

    }

    forward () {

        this.motors.left.forward(255);
        this.motors.right.forward(255);

    }

    reverse () {

        this.motors.left.reverse(255);
        this.motors.right.reverse(255);

    }

    turn (direction) {

        this.motors.left[direction === 'left' ? 'forward' : 'reverse'](120);
        this.motors.right[direction === 'right' ? 'forward' : 'reverse'](120);

    }

    stop () {

        this.motors.left.stop();
        this.motors.right.stop();

    }
}

module.exports = Soar;
