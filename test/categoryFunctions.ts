/* eslint-disable node/no-unpublished-import */
import request from 'supertest';
import {Category} from '../src/types/DBTypes';
import {App} from 'supertest/types';

const postCategory = async (
  url: App,
  newCategory: Partial<Category>,
): Promise<{message: string; category?: Category}> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .send({
        query: `mutation AddCategory($category: CategoryInput!) {
          addCategory(category: $category) {
            category {
              id
              category_name
            }
            message
          }
        }`,
        variables: {
          category: {
            category_name: newCategory.category_name,
          },
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          console.log('asdf', response.body);
          const categoryResponse = response.body.data.addCategory as {
            message: string;
            category?: Category;
          };
          console.log('asdf', categoryResponse);
          expect(categoryResponse.category?.category_name).toBe(
            newCategory.category_name,
          );
          resolve(categoryResponse);
        }
      });
  });
};

const getCategoryById = async (url: App, id: string): Promise<Category> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .send({
        query: `query GetCategory($id: ID!) {
          getCategoryById(id: $id) {
            id
            category_name
          }
        }`,
        variables: {
          categoryId: id,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          console.log(response.body);
          const category = response.body.data.getCategoryById as Category;
          expect(category._id).toBe(id);
          resolve(category);
        }
      });
  });
};

export {postCategory, getCategoryById};
