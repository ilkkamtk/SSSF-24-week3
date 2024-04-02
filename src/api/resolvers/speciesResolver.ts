// TODO: speciesResolver

import {Animal} from '../../types/DBTypes';

const speciesData = [
  {
    id: '1',
    species_name: 'Cat',
    category: '1',
  },
];

export default {
  Animal: {
    species: (parent: Animal) => {
      console.log(parent);
      return speciesData.find(
        (species) => species.id === String(parent.species),
      );
    },
  },
};
