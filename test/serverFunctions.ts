/* eslint-disable node/no-unpublished-import */
import request from 'supertest';
import {App} from 'supertest/types';

const getRoot = (url: App) => {
  return new Promise((resolve, reject) => {
    request(url)
      .get('/')
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          resolve(response.body);
        }
      });
  });
};

export {getRoot};
