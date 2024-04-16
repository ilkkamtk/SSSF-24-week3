type ServerToClientEvents = {
  addAnimal: (message: string) => void;
  addSpecies: (message: string) => void;
};

type ClientToServerEvents = {
  update: (message: 'animal' | 'species') => void;
};

export {ServerToClientEvents, ClientToServerEvents};
