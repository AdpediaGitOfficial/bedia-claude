import { SideNavInterface } from '../../interfaces/side-nav.type';
export const ROUTES: SideNavInterface[] = [
  {
    path: '',
    title: 'Dashboard',
    iconType: 'nzIcon',
    iconTheme: 'outline',
    icon: 'dashboard',
    submenu: [],
  },

  {
    path: '',
    title: 'Workshop Categories',
    iconType: 'nzIcon',
    iconTheme: 'outline',
    icon: 'appstore',
    submenu: [
      {
        path: '/admin/categories',
        title: 'All Categories',
        iconType: 'nzIcon',
        iconTheme: 'outline',
        icon: '',
        submenu: [],
      },
      {
        path: '/admin/category-add',
        title: 'Add Category',
        iconType: 'nzIcon',
        iconTheme: 'outline',
        icon: '',
        submenu: [],
      },
    ],
  },

  {
    path: '',
    title: 'Workshops',
    iconType: 'nzIcon',
    iconTheme: 'outline',
    icon: 'schedule',
    submenu: [
      {
        path: '/admin/workshops',
        title: 'All Workshops',
        iconType: 'nzIcon',
        iconTheme: 'outline',
        icon: '',
        submenu: [],
      },
      {
        path: '/admin/workshop-add',
        title: 'Add Workshop',
        iconType: 'nzIcon',
        iconTheme: 'outline',
        icon: '',
        submenu: [],
      },
    ],
  },
  // {
  //   path: '',
  //   title: 'Gallery',
  //   iconType: 'nzIcon',
  //   iconTheme: 'outline',
  //   icon: 'picture',
  //   submenu: [
  //     {
  //       path: '/admin/gallery',
  //       title: 'Gallery',
  //       iconType: 'nzIcon',
  //       iconTheme: 'outline',
  //       icon: '',
  //       submenu: [],
  //     },
  //     {
  //       path: '/admin/gallery-add',
  //       title: 'Add Gallery',
  //       iconType: 'nzIcon',
  //       iconTheme: 'outline',
  //       icon: '',
  //       submenu: [],
  //     },
  //   ],
  // },

  {
    path: '',
    title: 'Terms & Conditions',
    iconType: 'nzIcon',
    iconTheme: 'outline',
    icon: 'file-text',
    submenu: [
      {
        path: '/admin/termsAndConditions',
        title: 'Terms & Conditions',
        iconType: 'nzIcon',
        iconTheme: 'outline',
        icon: '',
        submenu: [],
      },
      {
        path: '/admin/termsAndConditions-add',
        title: 'Add Terms & Conditions',
        iconType: 'nzIcon',
        iconTheme: 'outline',
        icon: '',
        submenu: [],
      },
    ],
  },
  {
    path: '',
    title: 'FAQ',
    iconType: 'nzIcon',
    iconTheme: 'outline',
    icon: 'question-circle',
    submenu: [
      {
        path: '/admin/faqs',
        title: 'FAQ',
        iconType: 'nzIcon',
        iconTheme: 'outline',
        icon: '',
        submenu: [],
      },
      {
        path: '/admin/faq-add',
        title: 'Add FAQ',
        iconType: 'nzIcon',
        iconTheme: 'outline',
        icon: '',
        submenu: [],
      },
    ],
  },
  {
    path: '/admin/reviews',
    title: 'Reviews',
    iconType: 'nzIcon',
    iconTheme: 'outline',
    icon: 'star',
    submenu: [],
  },
  {
    path: '/admin/bookings',
    title: 'All Bookings',
    iconType: 'nzIcon',
    iconTheme: 'outline',
    icon: 'calendar',
    submenu: [],
  },
  {
    path: '/admin/opening-hours',
    title: 'Opening Hours',
    iconType: 'nzIcon',
    iconTheme: 'outline',
    icon: 'clock-circle',
    submenu: [],
  },
  // {
  //     path: '/admin/users',
  //     title: 'All Users',
  //     iconType: 'nzIcon',
  //     iconTheme: 'outline',
  //     icon: 'user',
  //     submenu: []
  // },

  // {
  //     path: '/admin/users',
  //     title: 'Users',
  //     iconType: 'nzIcon',
  //     iconTheme: 'outline',
  //     icon: 'user',
  //     submenu: [
  //         {
  //             path: '/admin/users',
  //             title: 'All Users',
  //             iconType: 'nzIcon',
  //             iconTheme: 'outline',
  //             icon: '',
  //             submenu: []
  //         },
  //         // {
  //     path: '/admin/users/upcoming',
  //     title: 'Upcoming Expiry',
  //     iconType: 'nzIcon',
  //     iconTheme: 'outline',
  //     icon: '',
  //     submenu: []
  // }  ,
  // {
  //     path: '/admin/users/expired',
  //     title: 'Expired Subscriptions',
  //     iconType: 'nzIcon',
  //     iconTheme: 'outline',
  //     icon: '',
  //     submenu: []
  // }
  //     ]
  //   },

  // {
  //     path: '/admin/offlinepayments',
  //     title: 'Offline Payments',
  //     iconType: 'nzIcon',
  //     iconTheme: 'outline',
  //     icon: 'wallet',
  //     submenu: []
  // },
  // {
  //     path: '/admin/onlinepayments',
  //     title: 'Online Payments',
  //     iconType: 'nzIcon',
  //     iconTheme: 'outline',
  //     icon: 'wallet',
  //     submenu: []
  // },
];
