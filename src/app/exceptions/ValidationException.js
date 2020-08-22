class ValidationException {
  constructor(value) {
    this.fields = value;
    this.error = 'Error validation the fields.';
  }
}

export default ValidationException;
