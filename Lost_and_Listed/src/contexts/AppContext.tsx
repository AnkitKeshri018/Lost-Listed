import React, { createContext, useContext, useState, useEffect } from 'react';

export type ItemType = 'lost' | 'found' | 'marketplace';
export type Category = 'electronics' | 'clothing' | 'books' | 'accessories' | 'furniture' | 'other';

export interface Item {
  id: string;
  title: string;
  description: string;
  category: Category;
  type: ItemType;
  price?: number;
  location: string;
  date: string;
  image: string;
  contactInfo: string;
  userId: string;
  status: 'active' | 'claimed' | 'sold';
}

export interface User {
  id: string;
  name: string;
  email: string;
  collegeId: string;
}

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  items: Item[];
  addItem: (item: Omit<Item, 'id'>) => void;
  updateItem: (id: string, item: Partial<Item>) => void;
  deleteItem: (id: string) => void;
  wishlist: string[];
  toggleWishlist: (itemId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Mock data for demonstration
const mockItems: Item[] = [
  {
    id: '1',
    title: 'Lost iPhone 13 Pro',
    description: 'Lost my iPhone 13 Pro in blue color near the library. Has a clear case with stickers.',
    category: 'electronics',
    type: 'lost',
    location: 'Main Library, 2nd Floor',
    date: '2024-01-15',
    image: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=400',
    contactInfo: 'john@college.edu',
    userId: '1',
    status: 'active',
  },
  {
    id: '2',
    title: 'Found Water Bottle',
    description: 'Found a Hydro Flask water bottle in the cafeteria. It has some stickers on it.',
    category: 'other',
    type: 'found',
    location: 'Student Cafeteria',
    date: '2024-01-14',
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400',
    contactInfo: 'sarah@college.edu',
    userId: '2',
    status: 'active',
  },
  {
    id: '3',
    title: 'MacBook Pro 2020',
    description: 'Selling my MacBook Pro 13" 2020. Great condition, comes with charger and case. Upgraded to a new model.',
    category: 'electronics',
    type: 'marketplace',
    price: 800,
    location: 'North Campus',
    date: '2024-01-16',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
    contactInfo: 'mike@college.edu',
    userId: '3',
    status: 'active',
  },
  {
    id: '4',
    title: 'Calculus Textbook',
    description: 'Calculus: Early Transcendentals, 8th Edition. Like new condition, barely used.',
    category: 'books',
    type: 'marketplace',
    price: 45,
    location: 'West Dormitory',
    date: '2024-01-15',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400',
    contactInfo: 'emma@college.edu',
    userId: '4',
    status: 'active',
  },
  {
    id: '5',
    title: 'Lost Backpack',
    description: 'Black North Face backpack with laptop inside. Left in classroom B204.',
    category: 'accessories',
    type: 'lost',
    location: 'Engineering Building, Room B204',
    date: '2024-01-17',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
    contactInfo: 'alex@college.edu',
    userId: '5',
    status: 'active',
  },
  {
    id: '6',
    title: 'Mini Fridge',
    description: 'Compact mini fridge, perfect for dorm rooms. Works perfectly, just don\'t need it anymore.',
    category: 'furniture',
    type: 'marketplace',
    price: 60,
    location: 'East Campus',
    date: '2024-01-16',
    image: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400',
    contactInfo: 'chris@college.edu',
    userId: '6',
    status: 'active',
  },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [items, setItems] = useState<Item[]>(mockItems);
  const [wishlist, setWishlist] = useState<string[]>([]);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Save user to localStorage when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const addItem = (item: Omit<Item, 'id'>) => {
    const newItem: Item = {
      ...item,
      id: Date.now().toString(),
    };
    setItems([newItem, ...items]);
  };

  const updateItem = (id: string, updatedItem: Partial<Item>) => {
    setItems(items.map(item => item.id === id ? { ...item, ...updatedItem } : item));
  };

  const deleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const toggleWishlist = (itemId: string) => {
    setWishlist(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  return (
    <AppContext.Provider value={{
      user,
      setUser,
      items,
      addItem,
      updateItem,
      deleteItem,
      wishlist,
      toggleWishlist,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
