export interface Product {
    ID: string;
    Title: string;
    Slug: string;
    Enabled: boolean;
    CatalogVisible: boolean;
    ProductCategories: string[];
    FeatureImageURL: string;
    ProductImageGallery: string[];
    ShortDescription: string;
    LongDescription: string;
    RegularPrice: string;
    SalePrice: string;
    Currency: string;
    DownloadURL?: string;
    DemoURL?: string;
  }
  