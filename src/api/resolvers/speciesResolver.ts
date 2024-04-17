import {GraphQLError} from 'graphql';
import {Animal, Species} from '../../types/DBTypes';
import speciesModel from '../models/speciesModel';
import {MyContext} from '../../types/MyContext';
import animalModel from '../models/animalModel';
import {io, Socket} from 'socket.io-client';
import {ClientToServerEvents, ServerToClientEvents} from '../../types/Socket';
import imageFromWikipedia from '../../lib/imageFromWikipedia';

if (!process.env.SOCKET_URL) {
  throw new Error('SOCKET_URL not defined');
}
// socket io client
const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  process.env.SOCKET_URL,
);

export default {
  Animal: {
    species: async (parent: Animal): Promise<Species> => {
      const species = await speciesModel.findById(parent.species);
      if (!species) {
        throw new Error('Species not found');
      }
      return species;
    },
  },
  Query: {
    species: async (): Promise<Species[]> => {
      return await speciesModel.find();
    },
    speciesByID: async (
      _parent: undefined,
      args: {id: string},
    ): Promise<Species> => {
      const species = await speciesModel.findById(args.id);
      if (!species) {
        throw new GraphQLError('Animal not found', {
          extensions: {
            code: 'NOT_FOUND',
          },
        });
      }
      return species;
    },
  },
  Mutation: {
    addSpecies: async (
      _parent: undefined,
      args: {species: Omit<Species, '_id'>},
      context: MyContext,
    ): Promise<{message: string; species?: Species}> => {
      if (!context.userdata || context.userdata.role !== 'admin') {
        throw new GraphQLError('User not authorized', {
          extensions: {
            code: 'UNAUTHORIZED',
          },
        });
      }
      try {
        const thumbnail = await imageFromWikipedia(args.species.species_name);
        args.species.image = thumbnail;
        const species = await speciesModel.create(args.species);
        if (!species) {
          return {message: 'Species not added'};
        }

        socket.emit('update', 'species');
        return {message: 'Species added', species};
      } catch (error) {
        throw new GraphQLError((error as Error).message, {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }
    },
    modifySpecies: async (
      _parent: undefined,
      args: {species: Omit<Species, '_id'>; id: string},
      context: MyContext,
    ): Promise<{message: string; species?: Species}> => {
      if (!context.userdata || context.userdata.role !== 'admin') {
        throw new GraphQLError('User not authorized', {
          extensions: {
            code: 'UNAUTHORIZED',
          },
        });
      }
      const species = await speciesModel.findByIdAndUpdate(
        args.id,
        args.species,
        {new: true},
      );
      if (species) {
        return {message: 'Species updated', species};
      } else {
        return {message: 'Species not updated'};
      }
    },
    deleteSpecies: async (
      _parent: undefined,
      args: {id: string},
      context: MyContext,
    ): Promise<{message: string; species?: Species}> => {
      if (!context.userdata) {
        throw new GraphQLError('User not authenticated', {
          extensions: {
            code: 'UNAUTHENTICATED',
          },
        });
      }
      // delete animals that belong to this species
      await animalModel.deleteMany({species: args.id});

      const species = await speciesModel.findByIdAndDelete(args.id);
      if (species) {
        return {message: 'Species deleted', species};
      } else {
        return {message: 'Species not deleted'};
      }
    },
  },
};
