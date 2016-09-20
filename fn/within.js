// https://github.com/rwaldron/johnny-five/blob/master/lib/mixins/within.js

function within (range, value) {
    var upper;

    if (typeof range === 'number') {
        upper = range;
        range = [0, upper];
    }

    if (!Array.isArray(range)) {
        throw new Error('within expected a range array');
    }

    if (value >= range[0] && value <= range[1]) {
        return true;
    }

    return false;
}

module.exports = within;
