import {GraphQLError} from 'graphql';
import {User} from '../../types/DBTypes';
import fetchData from '../../lib/fetchData';
import {MessageResponse} from '../../types/MessageTypes';

export default {
  Query: {
    users: async (): Promise<User[]> => {
      if (!process.env.AUTH_URL) {
        throw new GraphQLError('Auth URL not set in .env file');
      }
      const users = await fetchData<User[]>(process.env.AUTH_URL + '/users');
      users.forEach((user) => {
        user.id = user._id;
      });
      return users;
    },
    user: async (_parent: undefined, args: {id: string}): Promise<User> => {
      if (!process.env.AUTH_URL) {
        throw new GraphQLError('Auth URL not set in .env file');
      }
      const user = await fetchData<User>(
        process.env.AUTH_URL + '/users/' + args.id,
      );
      user.id = user._id;
      return user;
    },
  },
  Mutation: {
    register: async (
      _parent: undefined,
      args: {user: Omit<User, 'role'>},
    ): Promise<{user: User; message: string}> => {
      if (!process.env.AUTH_URL) {
        throw new GraphQLError('Auth URL not set in .env file');
      }
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(args.user),
      };

      const registerResponse = await fetchData<MessageResponse & {data: User}>(
        process.env.AUTH_URL + '/users',
        options,
      );

      return {user: registerResponse.data, message: registerResponse.message};
    },
  },
};
