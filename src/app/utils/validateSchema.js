import ValidationException from '../exceptions/ValidationException';

const validateSchema = (body, schema) => {
  const result = schema.validate(body, { abortEarly: false });
  const valid = result.error === undefined;
  if (!valid) {
    const fields = result.error.details.reduce(
      (obj, { message, context }) => ({
        ...obj,
        [context.key]: message,
      }),
      {}
    );
    throw new ValidationException(fields);
  }
  return result.value;
};

export default validateSchema;
