export interface RecipeQuery {
  query: {
    facets: [Facet];
    pageSize: number;
    pageNumber: number;
  };
}

export interface Facet {
  name: string;
  values: string[];
}

export type FacetsId = Array<{ name: string; id: string }>;
