# Search Bar Custom

The _Search Bar Custom_ custom app let you render a search bar that will redirect you on a certain page adding as URL query parameter what you typed in the input search.

## Props

These are the props you can change for the search bar custom:

| Prop name           | Type      | Description                                                                           | Default value       |
| ------------------- | --------- | ------------------------------------------------------------------------------------- | ------------------- |
| `placeholder`       | `string`  | Placeholder text for the Search Input                                                 | `"Search service"`  |
| `hrefRedirect`      | `string`  | Href where you will be redirected after click 'Enter' key or search icon              | `"/service/search"` |
| `useVtexNavigation` | `boolean` | Choose to use or not the VTEX Runtime navigation function for the redirect navigation | `false`             |

> _useVtexNavigation_ was added in order to choose the redirect navigation as in Hotpoint UK Service project we need to use the standard window.location.href as the _navigate_ function change the URL but not the page content.

## Customization

The custom app uses CSS Handles, for this you can change the style directly from the css file <code>hotpointuk.search-bar-custom.css</code> in the StoreTheme, usually you can find it here:  
theme --> style --> css --> **hotpointuk.search-bar-custom.css**

| CSS Handles                |
| -------------------------- |
| <code>container</code>     |
| <code>iconContainer</code> |
