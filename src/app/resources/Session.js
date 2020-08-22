class Session {
  constructor(user, token) {
    this.user = {
      id: user.id,
      name: user.name,
      email: user.email,
    };
    this.token = token;
  }
}

export default Session;
