export interface CreateBlindBoxDTO {
  name: string;
  description: string;
  imageUrl: string;
  stock: number;
  price: number;
  items: CreateBlindBoxItemDTO[];
}

export interface UpdateBlindBoxDTO extends CreateBlindBoxDTO {
  id: number;
}

export interface CreateBlindBoxItemDTO {
  name: string;
  description: string;
  imageUrl: string;
  quantity: number;
}

export interface UpdateBlindBoxItemDTO extends CreateBlindBoxItemDTO {
  id?: number;
  boxId?: number;
}

export interface PurchaseBlindBoxDTO {
  userId: number;
  boxId: number;
}

export interface RevealBlindBoxDTO {
  orderId: number;
}

export interface UpdateOrderStatusDTO {
  orderId: number;
  status: number; // 订单状态：0-未发货，1-待收货，2-已完成
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}