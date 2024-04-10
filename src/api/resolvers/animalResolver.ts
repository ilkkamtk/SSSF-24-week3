import {GraphQLError} from 'graphql';
import {Animal} from '../../types/DBTypes';
import animalModel from '../models/animalModel';
import {MyContext} from '../../types/MyContext';

export default {
  Query: {
    animals: async (): Promise<Animal[]> => {
      return await animalModel.find();
    },
    animal: async (_parent: undefined, args: {id: string}): Promise<Animal> => {
      const animal = await animalModel.findById(args.id);
      if (!animal) {
        throw new GraphQLError('Animal not found', {
          extensions: {
            code: 'NOT_FOUND',
          },
        });
      }
      return animal;
    },
  },
  Mutation: {
    addAnimal: async (
      _parent: undefined,
      args: {animal: Omit<Animal, '_id'>},
      context: MyContext,
    ): Promise<{message: string; animal?: Animal}> => {
      if (!context.userdata) {
        throw new GraphQLError('User not authenticated', {
          extensions: {
            code: 'UNAUTHENTICATED',
          },
        });
      }
      const animal = await animalModel.create(args.animal);
      if (animal) {
        return {message: 'Animal added', animal};
      } else {
        return {message: 'Animal not added'};
      }
    },
    modifyAnimal: async (
      _parent: undefined,
      args: {animal: Omit<Animal, '_id'>; id: string},
    ): Promise<{message: string; animal?: Animal}> => {
      const animal = await animalModel.findByIdAndUpdate(args.id, args.animal, {
        new: true,
      });
      if (animal) {
        return {message: 'Animal updated', animal};
      } else {
        return {message: 'Animal not updated'};
      }
    },
    deleteAnimal: async (
      _parent: undefined,
      args: {id: string},
    ): Promise<{message: string; animal?: Animal}> => {
      const animal = await animalModel.findByIdAndDelete(args.id);
      if (animal) {
        return {message: 'Animal deleted', animal};
      } else {
        return {message: 'Animal not deleted'};
      }
    },
  },
};
