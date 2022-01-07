import { body } from 'express-validator';

export const addProductValidator = [
  body('title').notEmpty(),
  body('price').isCurrency(),
  body('step').isCurrency(),
  body('description').notEmpty(),
  body('buyNowPrice')
    .optional({ nullable: true, checkFalsy: true })
    .isCurrency(),
];
