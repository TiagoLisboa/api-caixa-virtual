"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

class Session {
  constructor(user, token) {
    this.user = {
      id: user.id,
      name: user.name,
      email: user.email
    };
    this.token = token;
  }

}

var _default = Session;
exports.default = _default;
//# sourceMappingURL=Session.js.map