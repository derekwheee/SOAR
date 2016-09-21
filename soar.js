"use strict";

const within = require('./fn/within.js');

class Soar {
    constructor(ctx, five) {

        this.state = new Map();

        this.leds = {
            status : new five.Led('b2'),
            activity : new five.Led('b3')
        };

        this.proximity = {
            left : new five.Proximity({
                controller : 'GP2Y0A41SK0F',
                pin : 'b7',
                freq : 100
            }),
            right : new five.Proximity({
                controller : 'GP2Y0A41SK0F',
                pin : 'a7',
                freq : 100
            })
        };

        this.motors = {
            left : new five.Motor({
                pins: {
                    pwm: 'a5',
                    dir: 'a6'
                },
                invertPWM: true
            }),
            right : new five.Motor({
                pins: {
                    pwm: 'b6',
                    dir: 'b5'
                },
                invertPWM: true
            })
        }

    }

    start() {

        this.leds.status.on();

        this.proximity.left.on('data', (data) => {

            this.state.set('proximityLeft', data.cm);

            if (!isNaN(data.cm) && within([4, 10], data.cm) && !this.state.get('avoiding')) {
                this.avoid();
            }
        });

        this.proximity.right.on('data', (data) => {

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

        }.bind(this), 2000);

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

        this.motors.left[direction === 'left' ? 'forward' : 'reverse'](255);
        this.motors.right[direction === 'right' ? 'forward' : 'reverse'](255);

    }

    stop () {

        this.motors.left.stop();
        this.motors.right.stop();

    }
}

module.exports = Soar;
