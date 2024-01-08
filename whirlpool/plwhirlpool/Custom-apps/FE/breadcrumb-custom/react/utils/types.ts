export interface NavigationItem {
    name: string;
    href: string;
    __typename: string;
};

export interface BreadcrumbProps {
    firstLevelName: string;
    showFirstLevel: boolean;
    secondLevelName: string;
    showSecondLevel: boolean;
    thirdLevelName: string;
    showThirdLevel: boolean;
};
export interface Route {
    route: string;
    type: string;
}
export interface CategoryData {
    internal: {
        routes: Route[];
    }
}
export interface CategoryVars {
    categoryId: string;
    type: string;
}

export interface StructuredDataProps {
    breadcrumb?: NavigationItem[]
}