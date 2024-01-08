# README

This script extracts the internal rewrites labelling the PDPs related to correct products (active sku and active product) as "notFoundProduct" pages instead of "product" pages.

## BRIEF SCRIPT DESCRIPTION

The logics of the script is:

- It checks if a file containing the list of all the internal rewrites already exists.
  The file should be located in the "results" folder, and named "itccInternalRewrites.json"
  - If so, then it uses the data contained in the file
  - Otherwise, it extracts the list of all the internal rewrites, consuming the OOTB GraphQL query listInternals from vtex.rewriter, and then saves the results in the specific file.  
    By default, the entire list of rewrites is obtained through batches with 1000 items.
- Then, it removes all the rewrites whose "type" field is different from "notFoundProduct", and separates all the rewrites based on the "binding" field value.  
  The result of this operation is saved in the file "routesPerBindings.json", located in the "results" folder.
- After that, it fetches the list of all the skus available in the catalog, then retrieves the details of each sku, and returns the DetailUrl and SalesChannels information only if both the sku and the related product are active.  
  Even in this case, the entire operation is performed through batches with 50 items.  
  The result of this operation is saved in the file "skuInfos.json", located in the "results" folder.
- Finally, the results of the previous two operations are compared, and for each "correct" PDP slug (active sku and active product), the slug is stored in a specific object if it is associated with a "wrong" rewrite (type notFoundProduct) and the related sku shall be available for a specific salesChannel.  
  The final results are stored in 4 different files, specific for each CC salesChannel (e.g. "wrongRoutes_EPP.json"), located in the "results" folder.

## RESULTS ANALYSIS

By default, the "wrongRoutes_X.json" files contain the value [].  
If some "wrong" rewrite is detected by the script, then it is added in the related file, based on the binding associated to the rewrite.  
If no "wrong" rewrite is detected, then all the files contain the value [].

## COMMAND TO BE EXECUTED

node getNotFoundRoutes.js {vtex_cookie}

{vtex_cookie}: This is the value of the cookie "VtexIdclientAutCookie", and it is required in order to correctly consume the rewriter's GraphQL query. It can be found in the session cookies of the browser.

## PRE-REQUIREMENTS

- Before executing the script, the "results" folder should be created, e.g.  
  &nb; | getNotFoundRoutes.js  
  &nb; | getInternalRoutesGraphQL.js  
  &nb; | results  
  &nb;&nb; | wrongRoutes_EPP.json  
  &nb;&nb; | ...

- Before executing the script, the "node-fetch" package should be installed.  
  npm i node-fetch@2

- Before executing the script, a valid "VtexIdclientAutCookie" should be retrieved from the browser session.
