'use strict';

function BaseUnit() {}

BaseUnit.prototype.side = null;

BaseUnit.prototype.position = null;

BaseUnit.SIDE_LEFT = 'left';

BaseUnit.SIDE_RIGHT = 'right';

module.exports = BaseUnit;