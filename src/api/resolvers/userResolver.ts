import {GraphQLError} from 'graphql';
import {User} from '../../types/DBTypes';
import fetchData from '../../lib/fetchData';

export default {
  Query: {
    users: async (): Promise<User[]> => {
      if (!process.env.AUTH_URL) {
        throw new GraphQLError('Auth URL not set in .env file');
      }
      const users = await fetchData<User[]>(process.env.AUTH_URL + '/users');
      return users;
    },
  },
};
