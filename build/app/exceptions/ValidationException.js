"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

class ValidationException {
  constructor(value) {
    this.fields = value;
    this.error = 'Error validation the fields.';
  }

}

var _default = ValidationException;
exports.default = _default;
//# sourceMappingURL=ValidationException.js.map