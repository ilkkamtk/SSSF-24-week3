/* eslint-disable @typescript-eslint/no-unused-vars */
import {Animal} from '../../types/DBTypes';
const animalData = [
  {
    id: '1',
    animal_name: 'Frank',
    species: '1',
  },
];

export default {
  Query: {
    animals: (_parent: undefined, _args: Animal) => {
      return animalData;
    },
  },
};
