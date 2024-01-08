# Promotional Offer

This app is used to show a link to a PDF inside the PDP that has an active offer (active collection)
There is only one component: `PromotionalOffer.tsx`
This component has three props:

### Props
```
type CollectionItem = {
  collectionId: string;
  label: string;
};
type PromotionProps = {
  collectionsList: Array<CollectionItem>;
  elementsToShow: number;
};
```
collectionsList: List of the collection to show and their related label which is a rich-text and can be set with markdown syntax;
elementsToShow: the number of label you want to show (by default is set to 1);

### Styles
if you want to style the link you'll have to create a whirlpoolemea.promotional-offer.css file and modify the ".link" class.

### How it works
This app check all the active promotions for the product of the PDP and confronts them with the one passed down as props.
If the collection ids matches they will be shown on the page.
There is also the elementToShow props that defines how many label will be displayed on the PDP.