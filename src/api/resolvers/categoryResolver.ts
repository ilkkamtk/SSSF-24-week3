import {Species} from '../../types/DBTypes';

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
};
