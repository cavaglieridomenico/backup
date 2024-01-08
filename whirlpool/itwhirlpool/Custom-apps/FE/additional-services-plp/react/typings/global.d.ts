export interface AdditionalServicesPlpProps {
  children?: React.ReactNode;
  servicesFromTheme?: AdditionalService[]
 }

export interface ProductContextState {
  product: {
    specificationGroups: SpecificationGroups[]
  }
}

export interface Specifications {
  name: string;
  originalName: string;
}

export interface SpecificationGroups extends Specifications {
  specifications: SpecificationItem[]
} 

export interface SpecificationItem extends Specifications {
  values: string[]
}

export interface AdditionalService {
    name: string;
    price: number;
    image?: string;
    imgWidth: number; // pixels
    imgHeight: number; // pixels
}