import {GraphQLError} from 'graphql';

const fetchData = async <T>(
  url: string,
  options: RequestInit = {},
): Promise<T> => {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new GraphQLError('Error fetching data', {
        extensions: {
          code: response.statusText,
        },
      });
    }

    return await response.json();
  } catch (error) {
    throw new GraphQLError('Error fetching data', {
      extensions: {
        code:
          (error as GraphQLError).extensions?.code || 'INTERNAL_SERVER_ERROR',
      },
    });
  }
};

export default fetchData;
