import { NavigationItem } from "./types";

export const homeLabel = 'Strona główna';
export const productLabel = 'PRODUITS';
export let breadcrumbObject: NavigationItem = {
    name: '',
    href: '',
    __typename: "SearchBreadcrumb"
};
//Style
export const CSS_HANDLES = [
    'sliderContainer',
    'container',
    'link',
    'arrow',
    'term',
    'termArrow',
] as const

export const linkBaseClasses = 'dib pv1 link  c-muted-2 hover-c-link v-mid';
export const spanBaseClasses = 'dib pv1 link ph2 c-muted-2 v-mid';

