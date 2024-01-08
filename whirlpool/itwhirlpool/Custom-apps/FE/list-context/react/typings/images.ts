export interface Link {
  url: string;
  attributeNofollow: boolean;
  attributeTitle?: string;
  /**
   * These two properties need to both exist because
   * there was a mismatch in the API defined by this component,
   * which exposes a openNewTab prop, and the native link type
   * from vtex.native-types, which expects a newTab property
   * instead of openNewTab.
   */
  openNewTab?: boolean;
  newTab?: boolean;
}

export type ImagesSchema = Array<{
  image: string;
  mobileImage: string;
  link?: Link;
  title?: string;
  description: string;
  experimentalPreventLayoutShift?: boolean;
  width?: number | string;
  analyticsProperties?: "none" | "provide";
  promotionId?: string;
  promotionName?: string;
  promotionPosition?: string;
}>;
