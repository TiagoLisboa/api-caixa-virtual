"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

class CategoryCollection {
  constructor(categories) {
    this.categories = categories.map(category => ({
      id: category.id,
      name: category.name
    }));
  }

}

var _default = CategoryCollection;
exports.default = _default;
//# sourceMappingURL=CategoryCollection.js.map