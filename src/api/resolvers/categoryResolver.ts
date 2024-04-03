import {Category, Species} from '../../types/DBTypes';
import categoryModel from '../models/categoryModel';

// TODO: categoryResolver
const categoryData = [
  {
    id: '1',
    category_name: 'Mammal',
  },
];

export default {
  Species: {
    category: (parent: Species) => {
      return categoryData.find(
        (category) => category.id === String(parent.category),
      );
    },
  },
  Mutation: {
    addCategory: (
      _parent: undefined,
      args: {category: Omit<Category, '_id'>},
    ) => {
      const newCategory = new categoryModel(args.category);
      return newCategory.save();
    },
  },
};
