const categorySeeds = [
  {
    name: 'Candles',
    description: 'Hand-poured soy candles infused with layered notes for mindful rituals and gifting.',
    image: 'https://images.pexels.com/photos/6101956/pexels-photo-6101956.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    name: 'Bouquets',
    description: 'Seasonal floral arrangements styled with designer wrapping and hydrating techniques.',
    image: 'https://images.pexels.com/photos/931162/pexels-photo-931162.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    name: 'Custom Gifting',
    description: 'Curated boxes that pair artisanal treats with branded stationery for VIP moments.',
    image: 'https://images.pexels.com/photos/5632406/pexels-photo-5632406.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    name: 'Hijabi Essentials',
    description: 'Premium chiffon and jersey hijabs, magnetic pins, and travel-friendly organizers.',
    image: 'https://images.pexels.com/photos/6311655/pexels-photo-6311655.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
];

const productSeeds = [
  {
    name: 'Amber Glow Candle',
    description:
      'A slow-burning soy candle with amber, vanilla bean, and smoked cedar to warm every corner of your living space.',
    categoryName: 'Candles',
    price: 32,
    brand: 'Eclora Signature',
    stock: 40,
    images: [
      'https://images.pexels.com/photos/5490966/pexels-photo-5490966.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/6101966/pexels-photo-6101966.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    featured: true,
  },
  {
    name: 'Midnight Oud Candle',
    description:
      'Luxurious oud anchored with saffron and fig for statement evenings. Presented in a reusable matte vessel.',
    categoryName: 'Candles',
    price: 38,
    brand: 'Botanical Atelier',
    stock: 28,
    images: [
      'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/6786735/pexels-photo-6786735.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    featured: false,
  },
  {
    name: 'Botanical Bloom Bouquet',
    description:
      'A lush bouquet featuring ranunculus, roses, and eucalyptus bundled in our signature mauve wrapping.',
    categoryName: 'Bouquets',
    price: 85,
    brand: 'Eclora Floral Studio',
    stock: 12,
    images: [
      'https://images.pexels.com/photos/931166/pexels-photo-931166.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/931162/pexels-photo-931162.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    featured: true,
  },
  {
    name: 'Pastel Meadow Bouquet',
    description:
      'Soft pastel blooms with dried accents and satin ribbon, perfect for intimate weddings and brunch gifting.',
    categoryName: 'Bouquets',
    price: 72,
    brand: 'Eclora Floral Studio',
    stock: 15,
    images: [
      'https://images.pexels.com/photos/2072165/pexels-photo-2072165.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/931162/pexels-photo-931162.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    featured: false,
  },
  {
    name: 'Executive Gratitude Box',
    description:
      'A bespoke gifting experience with a candle, artisanal chocolate, brass wick trimmer, and personalized note.',
    categoryName: 'Custom Gifting',
    price: 120,
    brand: 'Eclora Bespoke',
    stock: 18,
    images: [
      'https://images.pexels.com/photos/5632406/pexels-photo-5632406.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/5649687/pexels-photo-5649687.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    featured: true,
  },
  {
    name: 'Celebration Dessert Hamper',
    description:
      'Hand-curated hamper with mini cupcakes, rose jam, honey sticks, and a travel candle to celebrate milestones.',
    categoryName: 'Custom Gifting',
    price: 98,
    brand: 'Eclora Bespoke',
    stock: 20,
    images: [
      'https://images.pexels.com/photos/3184185/pexels-photo-3184185.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/5632409/pexels-photo-5632409.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    featured: false,
  },
  {
    name: 'Everyday Chiffon Hijab Set',
    description:
      'Set of three breathable chiffon hijabs in neutral tones with matching travel pouch for effortless styling.',
    categoryName: 'Hijabi Essentials',
    price: 54,
    brand: 'Eclora Modest',
    stock: 35,
    images: [
      'https://images.pexels.com/photos/6311655/pexels-photo-6311655.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/6311645/pexels-photo-6311645.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    featured: true,
  },
  {
    name: 'Luxe Magnetic Pin Duo',
    description:
      'Scratch-free magnetic hijab pins with velvet pouch. Designed to secure delicate fabrics without snags.',
    categoryName: 'Hijabi Essentials',
    price: 18,
    brand: 'Eclora Modest',
    stock: 60,
    images: [
      'https://images.pexels.com/photos/6311634/pexels-photo-6311634.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/6311650/pexels-photo-6311650.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    featured: false,
  },
];

module.exports = {
  categorySeeds,
  productSeeds,
};

