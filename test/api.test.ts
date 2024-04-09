/* eslint-disable node/no-unpublished-import */
import dotenv from 'dotenv';
dotenv.config();
import app from '../src/app';
import mongoose from 'mongoose';
import randomstring from 'randomstring';
import {getCategoryById, postCategory} from './categoryFunctions';
import {Category} from '../src/types/DBTypes';
import {getRoot} from './serverFunctions';

describe('tests for /', () => {
  it('should return the root', async () => {
    await getRoot(app);
  });
});

describe('tests for /graphql', () => {
  beforeAll(async () => {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL is not set');
    }
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('connected to db');
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  let newCategory: Category;
  const testCategory: Partial<Category> = {
    category_name: 'test category' + randomstring.generate(7),
  };

  it('should create a new category', async () => {
    const response = await postCategory(app, testCategory);
    if (response.category) {
      newCategory = response.category;
    }
  }, 10000);

  it('should get a category by id', async () => {
    await getCategoryById(app, String(newCategory.id!));
  });
});
