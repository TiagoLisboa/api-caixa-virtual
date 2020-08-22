class User {
  constructor(user) {
    this.user = {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}

export default User;
