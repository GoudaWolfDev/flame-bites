/** Menu categories with icon + accent for quick links and tabs. */
export const CATEGORIES = [
  { id: 'burgers', name: 'Burgers', nameAr: 'برجر', icon: 'fa-burger', emoji: '🍔', color: '#DA291C' },
  { id: 'chicken', name: 'Fried Chicken', nameAr: 'دجاج مقرمش', icon: 'fa-drumstick-bite', emoji: '🍗', color: '#B3001B' },
  { id: 'wraps', name: 'Wraps & Sandwiches', nameAr: 'راب وسندويتش', icon: 'fa-burrito', emoji: '🌯', color: '#FF8200' },
  { id: 'sides', name: 'Sides', nameAr: 'أطباق جانبية', icon: 'fa-bowl-food', emoji: '🍟', color: '#FFC72C' },
  { id: 'drinks', name: 'Drinks', nameAr: 'مشروبات', icon: 'fa-mug-hot', emoji: '🥤', color: '#00A0B0' },
  { id: 'desserts', name: 'Desserts', nameAr: 'حلويات', icon: 'fa-ice-cream', emoji: '🍨', color: '#E4002B' },
  { id: 'combos', name: 'Combo Meals', nameAr: 'وجبات كومبو', icon: 'fa-burger', emoji: '🍱', color: '#1A1A1A' }
];

export const categoryById = (id) => CATEGORIES.find((c) => c.id === id) || null;
export default CATEGORIES;
