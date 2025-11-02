// Mock Database - Simulates backend data
export const dbRoles = ['Admin', 'Inscrito', 'Formação 1', 'Núcleo', 'user'];

export const dbUsers = [
  {
    id: 0,
    name: 'Admin',
    email: 'admin@apostolado.com',
    password: 'admin123',
    roles: ['Admin', 'user', 'Inscrito', 'Formação 1', 'Núcleo']
  },
  {
    id: 1,
    name: 'Membro Novo',
    email: 'membro@apostolado.com',
    password: 'membro123',
    roles: ['Inscrito', 'user']
  },
  {
    id: 2,
    name: 'Formando',
    email: 'formando@apostolado.com',
    password: 'formando123',
    roles: ['Inscrito', 'Formação 1', 'user']
  }
];

export const dbCourses = [
  {
    id: 'c1',
    title: 'O Segredo do Rosário',
    category: 'MARIOLOGIA',
    description: 'Descubra os mistérios e a profundidade da oração do Santo Rosário através dos ensinamentos de São Luís de Montfort.',
    image: 'https://placehold.co/600x400/2C1810/FDB913?text=O+Segredo+do+Rosário',
    rating: 5.0,
    reviews: 1779,
    requiredRoles: ['Inscrito'],
    lessons: [
      { id: 'l1', title: 'O Segredo Admirável do Santíssimo Rosário', duration: '16:47', requiredRoles: ['Inscrito'] },
      { id: 'l2', title: 'O Rosário, uma oração para todos', duration: '10:10', requiredRoles: ['Inscrito'] },
      { id: 'l3', title: 'A origem do Rosário', duration: '15:30', requiredRoles: ['Formação 1'] }
    ]
  },
  {
    id: 'c2',
    title: 'Esto Vir: Seja Homem',
    category: 'FORMAÇÃO MASCULINA',
    description: 'Um curso de formação para homens que desejam viver a masculinidade autêntica segundo o plano de Deus.',
    image: 'https://placehold.co/600x400/2C1810/FDB913?text=Esto+Vir',
    rating: 4.9,
    reviews: 856,
    requiredRoles: ['Formação 1'],
    badge: 'Lançamento',
    lessons: [
      { id: 'l1', title: 'Aula de lançamento do curso "Esto Vir"', duration: '18:45', requiredRoles: ['Formação 1'] },
      { id: 'l2', title: 'A identidade masculina', duration: '22:15', requiredRoles: ['Formação 1'] }
    ]
  },
  {
    id: 'c3',
    title: 'O Mistério da Mulher',
    category: 'FORMAÇÃO FEMININA',
    description: 'Compreenda a beleza e a missão da feminilidade à luz da doutrina católica.',
    image: 'https://placehold.co/600x400/2C1810/FDB913?text=O+Mistério+da+Mulher',
    rating: 5.0,
    reviews: 1245,
    requiredRoles: ['Inscrito'],
    lessons: [
      { id: 'l1', title: 'A vocação da mulher', duration: '20:30', requiredRoles: ['Inscrito'] },
      { id: 'l2', title: 'Maria, modelo de feminilidade', duration: '19:15', requiredRoles: ['Inscrito'] }
    ]
  },
  {
    id: 'c4',
    title: 'Teologia do Corpo',
    category: 'ANTROPOLOGIA',
    description: 'As catequeses de João Paulo II sobre o significado do corpo humano e da sexualidade.',
    image: 'https://placehold.co/600x400/2C1810/FDB913?text=Teologia+do+Corpo',
    rating: 4.8,
    reviews: 623,
    requiredRoles: [],
    lessons: [
      { id: 'l1', title: 'Introdução à Teologia do Corpo', duration: '25:00', requiredRoles: [] },
      { id: 'l2', title: 'O princípio', duration: '30:20', requiredRoles: [] }
    ]
  }
];

export const dbPosts = [
  {
    id: 'p1',
    title: 'Newman, o Doutor da Igreja que se "rendeu" à verdade',
    category: 'SANTOS & MÁRTIRES',
    date: '31.out.2025',
    excerpt: 'Newman trilhou um caminho original para a santidade: o do pensador que crê, do homem que reflete, duvida e busca, mas que finalmente se rende à verdade com lucidez e coragem.',
    image: 'https://placehold.co/600x400/2C1810/FDB913?text=Newman',
    requiredRoles: []
  },
  {
    id: 'p2',
    title: 'São John Henry Newman, "Doutor da Consciência"',
    category: 'FÉ E RAZÃO',
    date: '30.out.2025',
    excerpt: 'A trajetória intelectual e espiritual de Newman revela um homem profundamente comprometido com a busca da verdade.',
    image: 'https://placehold.co/600x400/2C1810/FDB913?text=Newman+Doutor',
    requiredRoles: ['Inscrito']
  },
  {
    id: 'p3',
    title: 'A importância da liturgia na vida espiritual',
    category: 'LITURGIA',
    date: '29.out.2025',
    excerpt: 'Entenda como a participação consciente na liturgia transforma nossa relação com Deus.',
    image: 'https://placehold.co/600x400/2C1810/FDB913?text=Liturgia',
    requiredRoles: ['Formação 1']
  }
];

export const dbEvents = [
  {
    id: 'e1',
    date: '2025-11-05',
    title: 'Retiro Espiritual - Homens',
    description: 'Retiro de silêncio e oração para homens',
    time: '09:00',
    requiredRoles: ['Inscrito']
  },
  {
    id: 'e2',
    date: '2025-11-10',
    title: 'Palestra: A família cristã hoje',
    description: 'Reflexão sobre os desafios da família no mundo contemporâneo',
    time: '19:30',
    requiredRoles: []
  },
  {
    id: 'e3',
    date: '2025-11-15',
    title: 'Formação - Núcleo de Estudo',
    description: 'Encontro mensal do núcleo de estudos avançados',
    time: '20:00',
    requiredRoles: ['Núcleo']
  },
  {
    id: 'e4',
    date: '2025-11-20',
    title: 'Missa Solene',
    description: 'Celebração eucarística mensal do apostolado',
    time: '18:00',
    requiredRoles: []
  },
  {
    id: 'e5',
    date: '2025-11-25',
    title: 'Círculo de Oração',
    description: 'Momento de oração comunitária',
    time: '19:00',
    requiredRoles: ['Inscrito']
  }
];

export const dbComments = [
  {
    id: 'com1',
    courseId: 'c1',
    userId: 1,
    userName: 'Membro Novo',
    date: '2025-10-28',
    text: 'Curso maravilhoso! Estou aprendendo muito sobre o Santo Rosário.'
  },
  {
    id: 'com2',
    courseId: 'c1',
    userId: 2,
    userName: 'Formando',
    date: '2025-10-30',
    text: 'As aulas são muito bem explicadas. Recomendo!'
  }
];
