# Janah E-commerce Frontend

A modern, responsive e-commerce frontend built with Next.js 14, TypeScript, Material UI, and Tailwind CSS. This application provides a complete shopping experience with user authentication, product browsing, cart management, and admin dashboard.

## 🚀 Features

### User Features
- **User Authentication**: Registration, login, phone verification, password reset
- **Product Browsing**: Search, filter, and browse products by categories
- **Shopping Cart**: Add/remove products, quantity management, persistent cart
- **User Profile**: Profile management, order history
- **Responsive Design**: Mobile-first approach with Material UI components
- **Real-time Search**: Auto-complete search with suggestions

### Admin Features
- **Admin Dashboard**: Analytics, user management, product management
- **Product Management**: CRUD operations for products
- **Category Management**: CRUD operations for categories
- **User Management**: Activate/deactivate users, bulk operations
- **Analytics**: Sales analytics, inventory management
- **Bulk Operations**: Import/export products, bulk price updates

### Technical Features
- **TypeScript**: Full type safety
- **Server-Side Rendering**: Next.js 14 with App Router
- **State Management**: Zustand for client-side state
- **API Integration**: React Query for server state management
- **Modern UI**: Material UI with Tailwind CSS
- **Form Handling**: React Hook Form with Yup validation
- **Notifications**: React Hot Toast for user feedback

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **UI Library**: Material UI (MUI)
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Server State**: TanStack React Query
- **Forms**: React Hook Form + Yup
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast
- **Icons**: Material UI Icons

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running (see backend README)

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone <repository-url>
cd janah-frontend
```

### 2. Install dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Configuration
Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

### 4. Run the development server
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   ├── products/          # Product pages
│   ├── admin/             # Admin dashboard
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable components
│   ├── layout/           # Layout components
│   ├── ui/               # UI components
│   ├── products/         # Product components
│   ├── auth/             # Auth components
│   └── admin/            # Admin components
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
├── services/             # API service functions
├── store/                # Zustand stores
├── types/                # TypeScript type definitions
└── utils/                # Utility functions
```

## 🔧 Configuration

### API Configuration
The frontend connects to the backend API. Update the API URL in your environment variables:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

### Material UI Theme
Customize the theme in `src/components/providers/Providers.tsx`:

```typescript
const theme = createTheme({
  palette: {
    primary: {
      main: '#0ea5e9', // Customize primary color
    },
    // ... other theme options
  },
});
```

### Tailwind CSS
Customize Tailwind configuration in `tailwind.config.ts`:

```typescript
theme: {
  extend: {
    colors: {
      primary: {
        // Custom color palette
      },
    },
  },
},
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
npm start
```

### Deploy to Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts

### Deploy to Netlify
1. Build the project: `npm run build`
2. Upload the `out` folder to Netlify
3. Configure environment variables in Netlify dashboard

### Environment Variables for Production
```env
NEXT_PUBLIC_API_URL=https://your-backend-api.com/api/v1
```

## 🔍 Key Components

### Authentication
- `src/app/auth/login/page.tsx` - Login page
- `src/app/auth/register/page.tsx` - Registration page
- `src/store/auth.store.ts` - Authentication state management

### Product Management
- `src/components/products/ProductCard.tsx` - Product display component
- `src/services/products.service.ts` - Product API calls
- `src/app/products/page.tsx` - Product listing page

### Shopping Cart
- `src/components/cart/CartDrawer.tsx` - Shopping cart sidebar
- `src/store/cart.store.ts` - Cart state management

### Admin Dashboard
- `src/app/admin/page.tsx` - Admin dashboard
- `src/services/admin.service.ts` - Admin API calls

## 🎨 Styling Guide

### Using Material UI
```tsx
import { Button, Typography, Box } from '@mui/material';

<Button variant="contained" color="primary">
  Click me
</Button>
```

### Using Tailwind CSS
```tsx
<div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
  <span className="text-lg font-semibold">Content</span>
</div>
```

### Combining Both
```tsx
<Button 
  variant="contained"
  className="bg-gradient-to-r from-blue-500 to-purple-600"
>
  Gradient Button
</Button>
```

## 📱 Responsive Design

The application is built mobile-first with responsive breakpoints:

- **xs**: 0px - 600px (Mobile)
- **sm**: 600px - 960px (Tablet)
- **md**: 960px - 1280px (Desktop)
- **lg**: 1280px - 1920px (Large Desktop)
- **xl**: 1920px+ (Extra Large)

## 🔐 Authentication Flow

1. **Registration**: User registers with phone number
2. **Phone Verification**: SMS verification code
3. **Admin Approval**: Admin activates the account
4. **Login**: User can now log in and shop

## 🛒 Shopping Experience

1. **Browse Products**: Filter by category, search, sort
2. **Product Details**: View detailed product information
3. **Add to Cart**: Manage quantities, persistent cart
4. **Checkout**: Complete purchase (to be implemented)

## 🎯 Admin Features

- **User Management**: View, activate, deactivate users
- **Product Management**: CRUD operations for products
- **Category Management**: Organize products into categories
- **Analytics**: View sales and inventory data
- **Bulk Operations**: Mass update products and prices

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Issues**
   - Check if backend is running
   - Verify API URL in environment variables
   - Check CORS settings on backend

2. **Build Errors**
   - Clear `.next` folder: `rm -rf .next`
   - Reinstall dependencies: `rm -rf node_modules && npm install`

3. **Type Errors**
   - Run type check: `npm run type-check`
   - Update type definitions in `src/types/`

### Development Tips

1. **Hot Reloading**: Changes auto-refresh the browser
2. **React Query DevTools**: Available in development mode
3. **Error Boundaries**: Wrap components for better error handling

## 📚 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Material UI Documentation](https://mui.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Zustand Documentation](https://github.com/pmndrs/zustand)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙋‍♂️ Support

For support and questions:
- Create an issue in the repository
- Contact: support@janah.com
- Phone: +964 773 300 2076

---

Built with ❤️ using Next.js, TypeScript, Material UI, and Tailwind CSS# janah-client
