"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ValidationException = _interopRequireDefault(require("../exceptions/ValidationException"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const validateSchema = (body, schema) => {
  const result = schema.validate(body, {
    abortEarly: false
  });
  const valid = result.error === undefined;

  if (!valid) {
    const fields = result.error.details.reduce((obj, {
      message,
      context
    }) => ({ ...obj,
      [context.key]: message
    }), {});
    throw new _ValidationException.default(fields);
  }

  return result.value;
};

var _default = validateSchema;
exports.default = _default;
//# sourceMappingURL=validateSchema.js.map