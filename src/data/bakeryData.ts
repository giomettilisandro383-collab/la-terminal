export const BAKERY_INFO = {
  brandName: 'La Terminal',
  ownerLine: 'de Rebeca Morón',
  tagline: 'Panadería & Confitería Artesanal',
  address: 'Neuquén 1450',
  postalCode: 'CP S2919',
  city: 'Villa Constitución',
  province: 'Santa Fe, Argentina',
  fullAddress: 'Neuquén 1450, Villa Constitución, Santa Fe, Argentina',
  instagramHandle: '@laterminal_panaderia',
  instagramUrl: 'https://www.instagram.com/laterminal_panaderia/',
  googleMapsUrl:
    'https://www.google.com/maps/search/?api=1&query=Neuqu%C3%A9n+1450,+Villa+Constituci%C3%B3n,+Santa+Fe,+Argentina',
  googleMapsEmbedUrl:
    'https://www.google.com/maps?q=Neuqu%C3%A9n+1450,+Villa+Constituci%C3%B3n,+Santa+Fe,+Argentina&t=&z=16&ie=UTF8&iwloc=&output=embed',
  hours: [
    { days: 'Lunes a Lunes', time: '07:00 a 23:00 hs' },
    { days: 'Abierto', time: 'Todo el año' },
  ],
  logoImageUrl: '/assets/aistudio/sdfsd_fed6f9c2.png',
  heroImage:
    '/assets/aistudio/841544856_18113043980130849_1944840226934503889_n__1__b4ee9c45.webp',
} as const;

export interface CraftPillar {
  index: string;
  title: string;
  detail: string;
}

export const CRAFT_PILLARS: CraftPillar[] = [
  {
    index: '01',
    title: 'Pastelería y tortas de autor',
    detail:
      'Tortas artesanales terminadas a mano con crema chantilly, ganache de chocolate, dulce de leche repostero y fruta fresca de estación.',
  },
  {
    index: '02',
    title: 'Panadería y facturas del día',
    detail:
      'Horneado continuo desde primera hora en Neuquén 1450: panes frescos, medialunas y facturas para acompañar cada mañana en Villa Constitución.',
  },
  {
    index: '03',
    title: 'Confitería por encargo',
    detail:
      'Preparamos tortas para cumpleaños, celebraciones y mesas dulces familiares con rellenos clásicos y decoración artesanal.',
  },
];

export type InstagramCategory = 'Todo' | 'Chocolate' | 'Crema Chantilly';

export interface InstagramPost {
  id: string;
  title: string;
  caption: string;
  category: Exclude<InstagramCategory, 'Todo'>;
  dateLabel: string;
  imageSrc: string;
  imageAlt: string;
  permalink: string;
}

export const INSTAGRAM_POSTS: InstagramPost[] = [
  {
    id: 'ig-1',
    title: 'Torta Chantilly, Frutos Rojos y Oreo',
    caption:
      'Base de bizcochuelo húmedo cubierta en crema chantilly peinada, copos de dulce de leche, centro de frutos rojos, cerezas y galletitas Oreo.',
    category: 'Crema Chantilly',
    dateLabel: 'Vitrina de confitería',
    imageSrc:
      '/assets/aistudio/843073993_18113044001130849_896904780093246451_n_dbb67ce2.webp',
    imageAlt:
      'Torta artesanal de crema chantilly blanca con copos de dulce de leche, frutos rojos, cerezas y galletitas Oreo',
    permalink: 'https://www.instagram.com/laterminal_panaderia/',
  },
  {
    id: 'ig-2',
    title: 'Torta Bañada en Chocolate y Frutillas',
    caption:
      'Cobertura intensa de chocolate semiamargo decorada con frutillas frescas glaseadas, crema chantilly, dulce de leche y cerezas al marrasquino.',
    category: 'Chocolate',
    dateLabel: 'Especialidad de la casa',
    imageSrc:
      '/assets/aistudio/841544856_18113043980130849_1944840226934503889_n__1__b4ee9c45.webp',
    imageAlt:
      'Torta artesanal cubierta de chocolate con frutillas frescas, crema chantilly, dulce de leche y cerezas',
    permalink: 'https://www.instagram.com/laterminal_panaderia/',
  },
  {
    id: 'ig-3',
    title: 'Torta Chantilly, Frutillas y Oreo',
    caption:
      'Combinación fresca y liviana: crema chantilly batida a punto, frutillas seleccionadas de estación y galletitas Oreo enteras.',
    category: 'Crema Chantilly',
    dateLabel: 'Pedidos y cumpleaños',
    imageSrc:
      '/assets/aistudio/842915549_18113043956130849_1707834955177675881_n_8e327b19.webp',
    imageAlt:
      'Torta blanca de crema chantilly decorada en corona con frutillas frescas y galletitas Oreo',
    permalink: 'https://www.instagram.com/laterminal_panaderia/',
  },
  {
    id: 'ig-4',
    title: 'Torta Chocolate, Crema y Cerezas',
    caption:
      'Clásica torta de chocolate rayada artesanalmente, coronada con rosetas de crema chantilly, cerezas y frutillas glaseadas.',
    category: 'Chocolate',
    dateLabel: 'Clásico de La Terminal',
    imageSrc:
      '/assets/aistudio/840205489_18113043965130849_265706614614237961_n_47700bc1.webp',
    imageAlt:
      'Torta artesanal de chocolate decorada con rosetas de crema chantilly, cerezas rojas y frutilla central',
    permalink: 'https://www.instagram.com/laterminal_panaderia/',
  },
];

export interface GoogleReview {
  id: string;
  author: string;
  context: string;
  rating: number;
  relativeDate: string;
  comment: string;
}

export const GOOGLE_REVIEWS_SUMMARY = {
  averageRating: 4.8,
  totalReviews: 184,
  reviews: [
    {
      id: 'rev-1',
      author: 'Mariana Gómez',
      context: 'Vecina de Villa Constitución',
      rating: 5,
      relativeDate: 'Hace 2 semanas',
      comment:
        'Las tortas de confitería son espectaculares, siempre frescas y súper abundantes. Encargamos para cumpleaños y nunca falla.',
    },
    {
      id: 'rev-2',
      author: 'Luciano Ferreyra',
      context: 'Guía Local',
      rating: 5,
      relativeDate: 'Hace 1 mes',
      comment:
        'Parada obligada por Neuquén 1450. Excelente atención, facturas recién salidas y la torta de chocolate con frutillas es increíble.',
    },
    {
      id: 'rev-3',
      author: 'Carolina Benítez',
      context: 'Cliente frecuente',
      rating: 4,
      relativeDate: 'Hace 1 mes',
      comment:
        'Muy buena calidad en pastelería, tortas y panificados del día. Los fines de semana conviene pasar temprano porque la vitrina vuela.',
    },
  ] satisfies GoogleReview[],
};
