class CategoryCollection {
  constructor(categories) {
    this.categories = categories.map(category => ({
      id: category.id,
      name: category.name,
    }));
  }
}

export default CategoryCollection;
