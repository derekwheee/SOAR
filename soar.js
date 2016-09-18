"use strict";

class Soar {
    constructor(ctx, five) {

        this.state = new Map();

        this.leds = {
            status : new five.Led('b5'),
            running : new five.Led('b4')
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

        // this.motors = {
        //     left : new five.Motor({
        //
        //     }),
        //     right : new five.Motor({
        //
        //     })
        // }

    }

    start() {

        this.leds.status.on();

        this.sensors.proximity.left.on('data', (data) => {

            this.state.set('proximityLeft', data.cm);

            if (!isNaN(data.cm) && data.cm < 10 && !this.state.get('avoiding')) {
                this.avoid();
            }
        });

        this.sensors.proximity.right.on('data', (data) => {

            this.state.set('proximityRight', data.cm);

            if (!isNaN(data.cm) && data.cm < 10 && !this.state.get('avoiding')) {
                this.avoid();
            }
        });

    }

    avoid () {

        this.state.set('avoiding', true);

        console.log('AVOIDING');
        console.log(this.state.get('proximityLeft'));
        console.log(this.state.get('proximityRight'));

        setTimeout(() => {
            this.state.set('avoiding', false);
        }, 500)

    }
}

module.exports = Soar;
