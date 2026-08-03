export interface CommonContentItem {
  _id?: string;
  id?: string;
  title: string;
  content: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FaqItemApi {
  _id?: string;
  id?: string;
  question: string;
  answer: string;
  category?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PartnerItemApi {
  _id?: string;
  id?: string;
  name: string;
  link: string;
  logo?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SliderItemApi {
  _id?: string;
  id?: string;
  title: string;
  description: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}
