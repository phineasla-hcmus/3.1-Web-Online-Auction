import { body } from 'express-validator';

export const addProductValidator = [
  body('name', 'Missing product name').notEmpty(),
  body('basePrice', 'Missing base price').exists().toFloat(),
  body('stepPrice', 'Missing step price').exists().toFloat(),
  body('buyNowPrice').optional({ nullable: true, checkFalsy: true }).toFloat(),
  body('description', 'Missing description').notEmpty(),
  body('category', 'Missing category').exists(),
  body('timeNum', 'Missing expired time').exists().toInt(),
  body('timeType', 'Missing expired time')
    .toLowerCase()
    .isIn(['hour', 'day', 'week', 'month']),
  body('images', 'Required at least 3 images').isArray({ min: 3 }),
];
