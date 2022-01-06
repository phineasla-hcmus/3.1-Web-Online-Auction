import { body } from 'express-validator';

export const addProductValidator = [
  body('title').notEmpty(),
  body('price').isCurrency(),
  body('step').isCurrency(),
  body('description').notEmpty(),
  body('buy-now-price')
    .optional({ nullable: true, checkFalsy: true })
    .isCurrency(),
];
