export interface Category {
  _id?: string;
  name: string;
}
export interface Brand {
  _id?: string;
  name: string;
}

export interface Product {
  _id?: string | undefined;
  name: string;
  shortDescription: string;
  description: string;
  categoryId: {
    _id?: string;
    name: string;
  };

  brandId: {
    _id?: string;
    name: string;
  };
  price: number;
  discount: number;
  isFeatured: boolean;
  isNewProduct: boolean;
  images: string[];
}

export interface Register {
  _id?: string;
  name: string;
  email: string;
  password: string;

  address: {
    address1: string;
    address2: string;
    city: string;
    state: string;
    country: string;
    pincode: Number;
    contact: Number;
  };
}
export interface Login {
  _id?: string;
  email: string;
  password: string;
}
export interface CartItem {
  quantity: number;
  productId: Product;
}
export enum OrderStatus {
  Pending = 'pending',
  Confirmed = 'confirmed',
  Shipped = 'shipped',
  Delivered = 'delivered',
  Cancelled = 'cancelled',
}
export interface Order {
  userId: string;
  items: CartItem[];
  paymentType: string;
  coupon: string | null;
  totalAmount: number;
  discount: number;
  finalAmount: number;
  _id?: String;
  status: OrderStatus;
  orderDate: Date;
  deliveryDate: Date;
}
export interface newAddress {
  userId: string;
  address: {
    address1: string;
    address2: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
    contact: string;
  };
}
