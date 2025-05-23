export interface Category {
  _id?: string;
  name: string;
}
export interface Brand {
  _id?: string;
  name: string;
}

export interface Product {
  _id?: string;
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
  image: string[];
}

export interface Register {
  _id?: string;
  name: string;
  email: string;
  password: string;
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
