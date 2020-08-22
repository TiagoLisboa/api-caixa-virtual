const user = user => ({
  user: {
    id: user.id,
    name: user.name,
    email: user.email,
  },
});

export default user;
