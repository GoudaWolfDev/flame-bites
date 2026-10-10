/**
 * FLAME BITES menu — 42 fully-specified items across 7 categories.
 * Base prices are in EGP. `sizes[].price` is the absolute unit price for a size.
 */
import { CONFIG } from '../core/config.js';

const u = (id) => `https://images.unsplash.com/photo-${id}?w=700&q=80&auto=format&fit=crop`;

const EX_BURGER = [
  { name: 'Extra cheese', price: 15 }, { name: 'Beef bacon', price: 25 },
  { name: 'Extra patty', price: 35 }, { name: 'Special flame sauce', price: 10 }
];
const EX_CHICKEN = [
  { name: 'Extra dipping sauce', price: 10 }, { name: 'Cheese slice', price: 12 }, { name: 'Jalapeños', price: 10 }
];
const EX_SIDE = [
  { name: 'Large size', price: 15 }, { name: 'Extra dip', price: 8 }
];
const EX_DRINK = [
  { name: 'Extra ice', price: 0 }, { name: 'Whipped cream', price: 8 }
];
const SZ_BURGER = [
  { name: 'Single', price: 0 }, { name: 'Double patty', price: 45 }, { name: 'Triple patty', price: 80 }
];
const SZ_DRINK = [
  { name: 'Regular', price: 0 }, { name: 'Large', price: 15 }
];

function mk(o) {
  const it = {
    oldPrice: 0, calories: 0, rating: 4.5, reviewsCount: 0, prepTime: 15,
    images: [], ingredients: [], allergens: [], tags: [], sizes: [], extras: [], available: true,
    ...o
  };
  if (it.sizes.length && !it.price) it.price = it.sizes[0].price;
  it.isNew = it.tags.includes('new');
  it.isBestSeller = it.tags.includes('bestseller');
  it.isSpicy = it.tags.includes('spicy');
  it.isVeg = it.tags.includes('vegetarian') || it.tags.includes('vegan');
  return it;
}

export const MENU = [
  /* ---------------- Burgers ---------------- */
  mk({
    id: 'classic-flame-burger', name: 'Classic Flame Burger', category: 'burgers',
    price: 95, oldPrice: 0, calories: 540, rating: 4.8, reviewsCount: 412, prepTime: 12,
    images: [u('1568901346375-23c9450c58cd'), u('1571091718767-18b5b1457add'), u('1550547660-d9450f859349')],
    description: 'Our signature char-grilled beef patty with melted cheddar, crisp lettuce, tomato and flame sauce in a toasted brioche bun.',
    ingredients: ['Beef patty', 'Cheddar', 'Lettuce', 'Tomato', 'Onion', 'Flame sauce', 'Brioche bun'],
    allergens: ['Gluten', 'Dairy', 'Egg'], tags: ['bestseller'], sizes: SZ_BURGER, extras: EX_BURGER
  }),
  mk({
    id: 'double-trouble-burger', name: 'Double Trouble Burger', category: 'burgers',
    price: 145, oldPrice: 175, calories: 860, rating: 4.9, reviewsCount: 289, prepTime: 15,
    images: [u('1553979459-d2229ba7433b'), u('1586190848861-99aa4a171e90')],
    description: 'Two juicy beef patties, double cheddar, smoky bacon and caramelised onions. For the seriously hungry.',
    ingredients: ['2x Beef patty', 'Cheddar', 'Beef bacon', 'Caramelised onion', 'Smoke sauce'],
    allergens: ['Gluten', 'Dairy'], tags: ['bestseller'], sizes: SZ_BURGER, extras: EX_BURGER
  }),
  mk({
    id: 'bacon-blaze-burger', name: 'Bacon Blaze Burger', category: 'burgers',
    price: 130, calories: 720, rating: 4.7, reviewsCount: 198, prepTime: 14,
    images: [u('1572802419224-296b0aeee0d9'), u('1594212699903-ec8a3eca50f5')],
    description: 'Flame-grilled patty topped with crispy bacon, smoked cheese and a fiery chipotle glaze.',
    ingredients: ['Beef patty', 'Beef bacon', 'Smoked cheese', 'Chipotle glaze'],
    allergens: ['Gluten', 'Dairy'], tags: ['spicy'], sizes: SZ_BURGER, extras: EX_BURGER
  }),
  mk({
    id: 'crispy-chicken-burger', name: 'Crispy Chicken Burger', category: 'burgers',
    price: 110, calories: 640, rating: 4.6, reviewsCount: 233, prepTime: 13,
    images: [u('1610614819513-58e34989848b'), u('1521305916504-4a1121188589')],
    description: 'Golden buttermilk-fried chicken fillet with slaw, pickles and creamy garlic mayo.',
    ingredients: ['Fried chicken fillet', 'Coleslaw', 'Pickles', 'Garlic mayo', 'Brioche bun'],
    allergens: ['Gluten', 'Dairy', 'Egg'], tags: [], sizes: SZ_BURGER, extras: EX_BURGER
  }),
  mk({
    id: 'mushroom-melt-burger', name: 'Mushroom Melt Burger', category: 'burgers',
    price: 125, calories: 690, rating: 4.5, reviewsCount: 141, prepTime: 14,
    images: [u('1550547660-d9450f859349'), u('1568901346375-23c9450c58cd')],
    description: 'Grilled beef patty smothered in sautéed mushrooms, Swiss cheese and truffle aioli.',
    ingredients: ['Beef patty', 'Mushrooms', 'Swiss cheese', 'Truffle aioli'],
    allergens: ['Gluten', 'Dairy', 'Egg'], tags: ['new'], sizes: SZ_BURGER, extras: EX_BURGER
  }),
  mk({
    id: 'jalapeno-fire-burger', name: 'Jalapeño Fire Burger', category: 'burgers',
    price: 120, calories: 700, rating: 4.6, reviewsCount: 176, prepTime: 14,
    images: [u('1508015287371-6fd1ed2a2cdb'), u('1553979459-d2229ba7433b')],
    description: 'A spicy patty loaded with fresh jalapeños, pepper jack cheese and habanero sauce. Approach with caution.',
    ingredients: ['Beef patty', 'Jalapeños', 'Pepper jack', 'Habanero sauce'],
    allergens: ['Gluten', 'Dairy'], tags: ['spicy'], sizes: SZ_BURGER, extras: EX_BURGER
  }),

  /* ---------------- Fried Chicken ---------------- */
  mk({
    id: 'golden-crispy-tenders', name: 'Golden Crispy Tenders', category: 'chicken',
    price: 85, calories: 480, rating: 4.7, reviewsCount: 305, prepTime: 12,
    images: [u('1562967914-608f82629710'), u('1569058242253-92a9c755a0ec')],
    description: 'Five hand-breaded chicken tenders fried to a shattering golden crunch. Served with two dips.',
    ingredients: ['Chicken breast', 'Seasoned breading', 'Dipping sauces'],
    allergens: ['Gluten', 'Egg'], tags: ['bestseller'], sizes: [], extras: EX_CHICKEN
  }),
  mk({
    id: 'bucket-of-flame', name: 'Bucket of Flame', category: 'chicken',
    price: 320, oldPrice: 380, calories: 1900, rating: 4.8, reviewsCount: 224, prepTime: 20,
    images: [u('1626645738196-c2a7c87a8f58'), u('1608039755401-742074f0548d')],
    description: 'A family-sized bucket of eight pieces of our secret-recipe fried chicken. Feeds up to four.',
    ingredients: ['8pc fried chicken', 'Secret spice blend'],
    allergens: ['Gluten', 'Egg'], tags: ['bestseller'], sizes: [], extras: EX_CHICKEN
  }),
  mk({
    id: 'spicy-hot-wings', name: 'Spicy Hot Wings', category: 'chicken',
    price: 95, calories: 560, rating: 4.6, reviewsCount: 271, prepTime: 14,
    images: [u('1608039755401-742074f0548d'), u('1513639776629-7b61b0ac49cb')],
    description: 'Crispy wings tossed in our signature hot honey buffalo glaze. Six pieces per order.',
    ingredients: ['Chicken wings', 'Hot honey buffalo sauce'],
    allergens: ['Gluten', 'Dairy'], tags: ['spicy'], sizes: [], extras: EX_CHICKEN
  }),
  mk({
    id: 'honey-glazed-strips', name: 'Honey Glazed Strips', category: 'chicken',
    price: 90, calories: 520, rating: 4.5, reviewsCount: 133, prepTime: 13,
    images: [u('1569058242253-92a9c755a0ec'), u('1562967914-608f82629710')],
    description: 'Chicken strips brushed with sticky honey mustard and sesame. Sweet meets savoury.',
    ingredients: ['Chicken strips', 'Honey mustard', 'Sesame'],
    allergens: ['Gluten', 'Egg', 'Sesame'], tags: ['new'], sizes: [], extras: EX_CHICKEN
  }),
  mk({
    id: 'buffalo-wings', name: 'Buffalo Wings', category: 'chicken',
    price: 100, calories: 580, rating: 4.6, reviewsCount: 189, prepTime: 14,
    images: [u('1513639776629-7b61b0ac49cb'), u('1608039755401-742074f0548d')],
    description: 'Classic buffalo wings with tangy hot sauce and a cool blue cheese dip.',
    ingredients: ['Chicken wings', 'Buffalo sauce', 'Blue cheese dip'],
    allergens: ['Gluten', 'Dairy'], tags: ['spicy'], sizes: [], extras: EX_CHICKEN
  }),
  mk({
    id: 'popcorn-chicken', name: 'Popcorn Chicken', category: 'chicken',
    price: 75, calories: 430, rating: 4.4, reviewsCount: 158, prepTime: 11,
    images: [u('1562967914-608f82629710'), u('1610614819513-58e34989848b')],
    description: 'Bite-sized crispy chicken pieces, perfect for sharing. Served with a tangy dip.',
    ingredients: ['Chicken breast', 'Seasoned breading'],
    allergens: ['Gluten', 'Egg'], tags: [], sizes: [], extras: EX_CHICKEN
  }),

  /* ---------------- Wraps & Sandwiches ---------------- */
  mk({
    id: 'flame-chicken-wrap', name: 'Flame Chicken Wrap', category: 'wraps',
    price: 95, calories: 520, rating: 4.7, reviewsCount: 210, prepTime: 11,
    images: [u('1626700051175-6818013e1d4f'), u('1600891964092-4316c288032e')],
    description: 'Grilled chicken, crisp lettuce, tomato and garlic sauce rolled in a warm tortilla.',
    ingredients: ['Grilled chicken', 'Lettuce', 'Tomato', 'Garlic sauce', 'Tortilla'],
    allergens: ['Gluten', 'Dairy'], tags: ['bestseller'], sizes: [], extras: EX_CHICKEN
  }),
  mk({
    id: 'beef-shawarma-wrap', name: 'Beef Shawarma Wrap', category: 'wraps',
    price: 105, calories: 610, rating: 4.8, reviewsCount: 342, prepTime: 12,
    images: [u('1600891964092-4316c288032e'), u('1594007654729-407eedc4be65')],
    description: 'Slow-roasted beef shawarma with tahini, pickles and fresh herbs in a soft pita.',
    ingredients: ['Beef shawarma', 'Tahini', 'Pickles', 'Parsley', 'Pita'],
    allergens: ['Gluten', 'Sesame'], tags: ['bestseller'], sizes: [], extras: EX_CHICKEN
  }),
  mk({
    id: 'crispy-zinger-wrap', name: 'Crispy Zinger Wrap', category: 'wraps',
    price: 90, calories: 580, rating: 4.5, reviewsCount: 167, prepTime: 11,
    images: [u('1552332386-f8dd00dc2f85'), u('1626700051175-6818013e1d4f')],
    description: 'Fiery crispy chicken strips with cheese, slaw and chipotle mayo in a toasted wrap.',
    ingredients: ['Crispy chicken', 'Cheese', 'Coleslaw', 'Chipotle mayo'],
    allergens: ['Gluten', 'Dairy', 'Egg'], tags: ['spicy'], sizes: [], extras: EX_CHICKEN
  }),
  mk({
    id: 'falafel-veggie-wrap', name: 'Falafel Veggie Wrap', category: 'wraps',
    price: 70, calories: 440, rating: 4.6, reviewsCount: 145, prepTime: 10,
    images: [u('1594007654729-407eedc4be65'), u('1552332386-f8dd00dc2f85')],
    description: 'Golden falafel, hummus, fresh salad and tahini wrapped in a soft flatbread. 100% plant based.',
    ingredients: ['Falafel', 'Hummus', 'Salad', 'Tahini', 'Flatbread'],
    allergens: ['Gluten', 'Sesame'], tags: ['vegetarian', 'vegan'], sizes: [], extras: EX_CHICKEN
  }),
  mk({
    id: 'garlic-chicken-pita', name: 'Garlic Chicken Pita', category: 'wraps',
    price: 88, calories: 540, rating: 4.4, reviewsCount: 121, prepTime: 11,
    images: [u('1626700051175-6818013e1d4f'), u('1552332386-f8dd00dc2f85')],
    description: 'Tender grilled chicken, creamy garlic toum and pickles in fresh pita bread.',
    ingredients: ['Grilled chicken', 'Garlic toum', 'Pickles', 'Pita'],
    allergens: ['Gluten', 'Egg'], tags: [], sizes: [], extras: EX_CHICKEN
  }),
  mk({
    id: 'halloumi-wrap', name: 'Grilled Halloumi Wrap', category: 'wraps',
    price: 80, calories: 500, rating: 4.5, reviewsCount: 98, prepTime: 10,
    images: [u('1552332386-f8dd00dc2f85'), u('1626700051175-6818013e1d4f')],
    description: 'Grilled halloumi with roasted peppers, rocket and lemon-herb dressing.',
    ingredients: ['Halloumi', 'Roasted peppers', 'Rocket', 'Lemon herb dressing'],
    allergens: ['Gluten', 'Dairy'], tags: ['vegetarian', 'new'], sizes: [], extras: EX_CHICKEN
  }),

  /* ---------------- Sides ---------------- */
  mk({
    id: 'golden-fries', name: 'Golden Fries', category: 'sides',
    price: 35, calories: 320, rating: 4.7, reviewsCount: 402, prepTime: 8,
    images: [u('1573080496219-bb080dd4f877'), u('1630384060421-cb20d0e0649d')],
    description: 'Skin-on fries fried to a golden crisp and dusted with our flame seasoning.',
    ingredients: ['Potatoes', 'Flame seasoning', 'Sunflower oil'],
    allergens: [], tags: ['bestseller'], sizes: [{ name: 'Regular', price: 35 }, { name: 'Large', price: 50 }], extras: EX_SIDE
  }),
  mk({
    id: 'loaded-cheese-fries', name: 'Loaded Cheese Fries', category: 'sides',
    price: 65, calories: 520, rating: 4.8, reviewsCount: 256, prepTime: 10,
    images: [u('1630384060421-cb20d0e0649d'), u('1518013431117-eb1465fa5752')],
    description: 'Fries buried under molten cheese sauce, jalapeños and crispy onions.',
    ingredients: ['Fries', 'Cheese sauce', 'Jalapeños', 'Crispy onion'],
    allergens: ['Dairy'], tags: ['spicy', 'bestseller'], sizes: [], extras: EX_SIDE
  }),
  mk({
    id: 'curly-fries', name: 'Curly Fries', category: 'sides',
    price: 45, calories: 380, rating: 4.5, reviewsCount: 142, prepTime: 9,
    images: [u('1518013431117-eb1465fa5752'), u('1573080496219-bb080dd4f877')],
    description: 'Spiral-cut curly fries with a smoky paprika kick. Endlessly snackable.',
    ingredients: ['Potatoes', 'Paprika', 'Spices'],
    allergens: [], tags: [], sizes: [], extras: EX_SIDE
  }),
  mk({
    id: 'onion-rings', name: 'Crispy Onion Rings', category: 'sides',
    price: 50, calories: 410, rating: 4.6, reviewsCount: 174, prepTime: 9,
    images: [u('1639024471283-03518883512d'), u('1541592106381-b31e9677c0e5')],
    description: 'Thick-cut onion rings in a crunchy golden batter with a smoky dip.',
    ingredients: ['Onion', 'Batter', 'Smoky dip'],
    allergens: ['Gluten', 'Egg'], tags: [], sizes: [], extras: EX_SIDE
  }),
  mk({
    id: 'coleslaw', name: 'Creamy Coleslaw', category: 'sides',
    price: 30, calories: 180, rating: 4.3, reviewsCount: 88, prepTime: 5,
    images: [u('1541592106381-b31e9677c0e5'), u('1630384060421-cb20d0e0649d')],
    description: 'Fresh cabbage and carrot slaw in a light creamy dressing.',
    ingredients: ['Cabbage', 'Carrot', 'Creamy dressing'],
    allergens: ['Egg', 'Dairy'], tags: ['vegetarian'], sizes: [], extras: EX_SIDE
  }),
  mk({
    id: 'mozzarella-sticks', name: 'Mozzarella Sticks', category: 'sides',
    price: 60, calories: 470, rating: 4.7, reviewsCount: 201, prepTime: 10,
    images: [u('1531749668029-257fe1f9f5d2'), u('1639024471283-03518883512d')],
    description: 'Gooey mozzarella in a crisp herbed crumb, with marinara for dipping.',
    ingredients: ['Mozzarella', 'Herb crumb', 'Marinara'],
    allergens: ['Gluten', 'Dairy', 'Egg'], tags: ['vegetarian', 'new'], sizes: [], extras: EX_SIDE
  }),

  /* ---------------- Drinks ---------------- */
  mk({
    id: 'classic-cola', name: 'Classic Cola', category: 'drinks',
    price: 30, calories: 140, rating: 4.5, reviewsCount: 320, prepTime: 2,
    images: [u('1554866585-cd94860890b7'), u('1544145945-f90425340c7e')],
    description: 'Ice-cold fizzy cola served in a chilled glass with lemon.',
    ingredients: ['Cola', 'Ice', 'Lemon'],
    allergens: [], tags: [], sizes: SZ_DRINK, extras: EX_DRINK
  }),
  mk({
    id: 'iced-lemonade', name: 'Fresh Iced Lemonade', category: 'drinks',
    price: 35, calories: 120, rating: 4.7, reviewsCount: 156, prepTime: 3,
    images: [u('1437418747212-8d9709afab22'), u('1554866585-cd94860890b7')],
    description: 'Hand-squeezed lemons with mint over crushed ice. Refreshingly tart.',
    ingredients: ['Lemon', 'Mint', 'Sugar', 'Ice'],
    allergens: [], tags: ['vegetarian', 'vegan'], sizes: SZ_DRINK, extras: EX_DRINK
  }),
  mk({
    id: 'mango-smoothie', name: 'Mango Smoothie', category: 'drinks',
    price: 45, calories: 210, rating: 4.8, reviewsCount: 187, prepTime: 4,
    images: [u('1572490122747-3968b75cc699'), u('1544145945-f90425340c7e')],
    description: 'Thick and creamy mango smoothie made with real fruit.',
    ingredients: ['Mango', 'Yogurt', 'Honey'],
    allergens: ['Dairy'], tags: ['vegetarian', 'bestseller'], sizes: SZ_DRINK, extras: EX_DRINK
  }),
  mk({
    id: 'chocolate-milkshake', name: 'Chocolate Milkshake', category: 'drinks',
    price: 50, calories: 420, rating: 4.9, reviewsCount: 265, prepTime: 5,
    images: [u('1544145945-f90425340c7e'), u('1572490122747-3968b75cc699')],
    description: 'Rich chocolate ice cream blended thick, topped with cream and cocoa.',
    ingredients: ['Chocolate ice cream', 'Milk', 'Whipped cream'],
    allergens: ['Dairy'], tags: ['bestseller'], sizes: SZ_DRINK, extras: EX_DRINK
  }),
  mk({
    id: 'vanilla-latte', name: 'Vanilla Latte', category: 'drinks',
    price: 45, calories: 190, rating: 4.5, reviewsCount: 112, prepTime: 5,
    images: [u('1541167760496-1628856ab772'), u('1461023058943-07fcbe16d735')],
    description: 'Smooth espresso with steamed milk and a hint of vanilla.',
    ingredients: ['Espresso', 'Milk', 'Vanilla'],
    allergens: ['Dairy'], tags: [], sizes: SZ_DRINK, extras: EX_DRINK
  }),
  mk({
    id: 'strawberry-milkshake', name: 'Strawberry Milkshake', category: 'drinks',
    price: 50, calories: 400, rating: 4.6, reviewsCount: 134, prepTime: 5,
    images: [u('1572490122747-3968b75cc699'), u('1544145945-f90425340c7e')],
    description: 'Sweet strawberries blended with creamy ice cream and topped with cream.',
    ingredients: ['Strawberry', 'Ice cream', 'Milk'],
    allergens: ['Dairy'], tags: ['new'], sizes: SZ_DRINK, extras: EX_DRINK
  }),

  /* ---------------- Desserts ---------------- */
  mk({
    id: 'molten-lava-cake', name: 'Molten Chocolate Lava', category: 'desserts',
    price: 65, calories: 480, rating: 4.9, reviewsCount: 298, prepTime: 12,
    images: [u('1606313564200-e75d5e30476c'), u('1551024506-0bccd828d307')],
    description: 'Warm chocolate cake with a gooey molten centre and vanilla ice cream.',
    ingredients: ['Chocolate', 'Butter', 'Eggs', 'Vanilla ice cream'],
    allergens: ['Gluten', 'Dairy', 'Egg'], tags: ['bestseller'], sizes: [], extras: []
  }),
  mk({
    id: 'ny-cheesecake', name: 'New York Cheesecake', category: 'desserts',
    price: 60, calories: 450, rating: 4.7, reviewsCount: 176, prepTime: 5,
    images: [u('1563805042-7684c019e1cb'), u('1488900128323-21503983a07e')],
    description: 'Creamy baked cheesecake on a buttery biscuit base with berry coulis.',
    ingredients: ['Cream cheese', 'Biscuit base', 'Berry coulis'],
    allergens: ['Gluten', 'Dairy', 'Egg'], tags: [], sizes: [], extras: []
  }),
  mk({
    id: 'apple-crumble', name: 'Apple Crumble', category: 'desserts',
    price: 55, calories: 420, rating: 4.5, reviewsCount: 103, prepTime: 8,
    images: [u('1567206563064-6f60f40a2b57'), u('1551024506-0bccd828d307')],
    description: 'Cinnamon-spiced apples under a golden oat crumble with warm custard.',
    ingredients: ['Apple', 'Oats', 'Cinnamon', 'Custard'],
    allergens: ['Gluten', 'Dairy'], tags: ['vegetarian'], sizes: [], extras: []
  }),
  mk({
    id: 'chocolate-brownie', name: 'Fudge Brownie', category: 'desserts',
    price: 50, calories: 400, rating: 4.8, reviewsCount: 189, prepTime: 6,
    images: [u('1607920591413-4ec007e70023'), u('1606313564200-e75d5e30476c')],
    description: 'Dense, fudgy brownie with walnuts and a rich chocolate ganache top.',
    ingredients: ['Chocolate', 'Butter', 'Walnuts', 'Ganache'],
    allergens: ['Gluten', 'Dairy', 'Nuts', 'Egg'], tags: ['bestseller'], sizes: [], extras: []
  }),
  mk({
    id: 'ice-cream-sundae', name: 'Ice Cream Sundae', category: 'desserts',
    price: 45, calories: 360, rating: 4.6, reviewsCount: 147, prepTime: 4,
    images: [u('1563805042-7684c019e1cb'), u('1567206563064-6f60f40a2b57')],
    description: 'Three scoops of ice cream with sauces, sprinkles and a wafer.',
    ingredients: ['Ice cream', 'Chocolate sauce', 'Sprinkles'],
    allergens: ['Dairy'], tags: ['vegetarian'], sizes: [], extras: []
  }),
  mk({
    id: 'churros', name: 'Churros & Chocolate', category: 'desserts',
    price: 50, calories: 430, rating: 4.7, reviewsCount: 121, prepTime: 8,
    images: [u('1626804475297-41608ea09aeb'), u('1488900128323-21503983a07e')],
    description: 'Cinnamon-sugar churros served with a warm dark chocolate dip.',
    ingredients: ['Churros', 'Cinnamon sugar', 'Dark chocolate'],
    allergens: ['Gluten', 'Dairy', 'Egg'], tags: ['vegetarian', 'new'], sizes: [], extras: []
  }),

  /* ---------------- Combo Meals ---------------- */
  mk({
    id: 'solo-flame-combo', name: 'Solo Flame Combo', category: 'combos',
    price: 130, oldPrice: 155, calories: 900, rating: 4.7, reviewsCount: 231, prepTime: 15,
    images: [u('1598515214211-89d3c73ae83b'), u('1568901346375-23c9450c58cd')],
    description: 'Classic Flame Burger + Golden Fries + a soft drink. The perfect solo feast.',
    ingredients: ['Classic Flame Burger', 'Golden Fries', 'Soft drink'],
    allergens: ['Gluten', 'Dairy', 'Egg'], tags: ['bestseller'], sizes: [], extras: []
  }),
  mk({
    id: 'duo-feast-combo', name: 'Duo Feast Combo', category: 'combos',
    price: 245, oldPrice: 300, calories: 1800, rating: 4.8, reviewsCount: 154, prepTime: 18,
    images: [u('1598515214211-89d3c73ae83b'), u('1610614819513-58e34989848b')],
    description: 'Two burgers, two fries and two drinks. Made for sharing with your favourite person.',
    ingredients: ['2x Burgers', '2x Fries', '2x Drinks'],
    allergens: ['Gluten', 'Dairy', 'Egg'], tags: ['bestseller'], sizes: [], extras: []
  }),
  mk({
    id: 'family-bucket-combo', name: 'Family Bucket Combo', category: 'combos',
    price: 420, oldPrice: 520, calories: 3600, rating: 4.9, reviewsCount: 98, prepTime: 22,
    images: [u('1626645738196-c2a7c87a8f58'), u('1608039755401-742074f0548d')],
    description: 'A whole bucket of fried chicken, four sides and four drinks. Feeds the whole family.',
    ingredients: ['8pc Chicken', '4x Sides', '4x Drinks'],
    allergens: ['Gluten', 'Dairy', 'Egg'], tags: ['bestseller'], sizes: [], extras: []
  }),
  mk({
    id: 'zinger-combo', name: 'Zinger Combo', category: 'combos',
    price: 140, oldPrice: 165, calories: 950, rating: 4.6, reviewsCount: 176, prepTime: 15,
    images: [u('1610614819513-58e34989848b'), u('1598515214211-89d3c73ae83b')],
    description: 'Crispy Chicken Burger + Loaded Cheese Fries + a soft drink.',
    ingredients: ['Crispy Chicken Burger', 'Loaded Fries', 'Soft drink'],
    allergens: ['Gluten', 'Dairy', 'Egg'], tags: ['spicy'], sizes: [], extras: []
  }),
  mk({
    id: 'veggie-combo', name: 'Veggie Combo', category: 'combos',
    price: 110, oldPrice: 130, calories: 780, rating: 4.5, reviewsCount: 87, prepTime: 14,
    images: [u('1594007654729-407eedc4be65'), u('1552332386-f8dd00dc2f85')],
    description: 'Falafel Veggie Wrap + Curly Fries + fresh lemonade. Fully plant based.',
    ingredients: ['Falafel Wrap', 'Curly Fries', 'Lemonade'],
    allergens: ['Gluten', 'Sesame'], tags: ['vegetarian', 'vegan'], sizes: [], extras: []
  }),
  mk({
    id: 'late-night-combo', name: 'Late Night Combo', category: 'combos',
    price: 165, oldPrice: 195, calories: 1200, rating: 4.7, reviewsCount: 112, prepTime: 16,
    images: [u('1553979459-d2229ba7433b'), u('1598515214211-89d3c73ae83b')],
    description: 'Double Trouble Burger + Spicy Hot Wings + a milkshake. For the midnight munchies.',
    ingredients: ['Double Burger', 'Hot Wings', 'Milkshake'],
    allergens: ['Gluten', 'Dairy', 'Egg'], tags: ['new', 'spicy'], sizes: [], extras: []
  })
];

export const byId = (id) => MENU.find((m) => m.id === id) || null;
export const byCategory = (cat) => MENU.filter((m) => m.category === cat);
export const bestSellers = () => MENU.filter((m) => m.isBestSeller);
export const newItems = () => MENU.filter((m) => m.isNew);
export const CATEGORY_ORDER = ['burgers', 'chicken', 'wraps', 'sides', 'drinks', 'desserts', 'combos'];
export const currency = () => CONFIG.currency;
export default MENU;
