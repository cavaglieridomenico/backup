Doc link: https://reply-my.sharepoint.com/:w:/g/personal/g_monitillo_reply_it/EWaOrIZxFjBFj_JncfKcKcsBUXXgXAqk-2gYPu6FykVIPw?e=9vQRcp

# Page rewriter

This app can be used to create or update VTEX internals. If It already exist and 
there are fields in the request different than those already existing, update the internal,
otherwise it does nothing.
Moreover, there are other services to manage the internal related to pages that need redirect.

There are constraints to create/delete/listInternal in order to avoid the modification of existing internal and limit the visibility of this information.

Constraints:
  In the app setting we can specify the allowed page type, for this reason there is an array of object that contain the path of from string and the relative
  resolveAs path associated to it (could be more than one => array of string). 
  
  In the creation of the internal we will consider valid the internal that has:
    - the from string that contain one of the page type in the app settings
    - the resolveAs string that is equal to one of the possible value related to from string, specified in the app settings

  About the delete service, we will consider valid the internal that has:

    - the from string that contain one of the page type in the app settings

  About the list of internals present in Vtex We will return only the internal related to page redirect, so there is a filer based on the allowed page type.

  Has been added an appSetting (enable VBase) in order to save query parameters in VBase, this is done to avoid problem related to the length of characters of query parameters.

## Body request

### createInternal

  ```json
  {
  "from": "/test/prova",
  "resolveAs": "/test",
  "query": {
    "metaTitle": {
      "type": "TITLE",
      "value": "myTitle"
    },
    "metaDescription": {
      "type": "LEGACY",
      "name": "metaDesc_root",
      "content": "myDescription"
    }
  }
  ```

There is a parser that consider valid only the From string composed in this way: "/{allowedPageType}/text" 
and resolveAs: "/{allowedPageType (resolveAs string array)}".
If the payload doesn't match with this rule, the request will be rejected as bad request - 400

### deleteInternal: 
  ```json 
  {
    "from": "/test/prova"
  }
  ```

  There is a parser that consider valid only the From string composed in this way: "/{allowedPageType}/text".
  If the payload doesn't match with this rule, the request will be rejected as bad request - 400

### listInternals: 
  ```
  {
    "next": "" (mandatory, for the first instance send - "")
  }
  ```
                  
###  checkInternal: 
```json  
  {
    "from": "/test/prova"
  }
```

## Query parameter types allowed

```json
{
    "type": "LEGACY",
    "name": "name",
    "content": "content"
  },
  {
    "type": "OG",
    "property": "og:prop",
    "content": "content"
  },
   {
    "type": "TITLE",
    "value": "My title"
  },
  {
    "type": "HTTP",
    "http_equiv": "http equiv",
    "content": "content"
  },
{
    "type": "LINK",
    "rel": "rel",
    "href": "href",
    "sizes": "sizes",
    "type": "type",
    "media": "media",
    "crossOrigin": "cross origin",
    "title": "title",
    "as": "as"
  },
   {
    "type": "CHARSET",
    "charSet": "charset"
  },
  {
    "type": "STRUCTURED_DATA",
    "data": "{}"
  }
```

## App setting

Tool used to encode in sha256 the appKey and appToken:
- https://codebeautify.org/sha256-hash-generator

# Master Data Entity
No one

# Rest services exposed

- "/page-rewriter/deleteInternal": Service that delete an internal link by passing <from>. There are
                                    specific rules to create an internal through this service, in order to avoid the modification of existing ones;

- "/page-rewriter/createInternal": Service that create an internal link by passing <from, resolveAs, queryParameter(optional)>. There are
                                    specific rules to create an internal through this service, in order to avoid the modification of existing ones;

- "/page-rewriter/checkInternal": Service that check if an internal link exist according to <from>,
                                     if not returns the "from" string;

- "/page-rewriter/listInternals": Service that returns a list of internal link, but it isn't the complete list therefore it returns also
                                    the "next" string in order to retrieve other pages. Will be returned only the internal related to
                                    the page redirected. This filter is based on the allowed page type.

# GraphQL query and mutation exposed

Query:
  - getVBaseQueryParam(from: String!): String @cacheControl(scope: PUBLIC, maxAge: LONG) -> useful to retrieve query parameters by VBase, passing the from string 
