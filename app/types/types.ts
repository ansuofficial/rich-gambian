export type CategoryDataType = {
  name: string;
  value: number;
};

export interface ProductsTypes {
  id: number;
  name: string;
  price: number;
  category: string;
  emoji: string;
  image: string;
}

export type PurchaseItem = ProductsTypes & { quantity: number };

export interface ReceiptData {
  balance: number;
  totalSpent: number;
  percentSpent: number;
  totalQuantity: number;
  purchases: PurchaseItem[];
  categoryData: CategoryDataType[];
  generatedAt: number;
}

export interface SpendingState {
  balance: number;
  purchases: PurchaseItem[];
  totalSpent: number;
  percentSpent: number;
  totalQuantity: number;
  categoryData: CategoryDataType[];
}