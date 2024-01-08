# Support Video

Application for response videos related to product.

## How use API

► Method: GET - smartukb2c.myvtex.com/v1/category-videos?productId=1

####Response:

  ```
  [
    "https://youtu.be/ekZMbEP6ZF0",
    "https://youtu.be/2983nwGonJw",
    "https://youtu.be/MI1LoV7r8o8",
    "https://youtu.be/zJesAxQ7ZBM",
    "https://youtu.be/rMZ4PgBtFJU",
    "https://youtu.be/4m4AHD6SQl8",
    "https://youtu.be/2983nwGonJw",
    "https://youtu.be/cg-eWm51QCc",
    "https://youtu.be/s4cXEatJJGI",
    "https://youtu.be/cg-eWm51QCc"
  ]
  ```

####Errors:

1. Missing parameter: productId - check the parameter productId is correct given 

```
{
  "errorMessage": "Missing Parameter: productId"
}
```

2. Not found category tree for this product, or productId is incorrect - product not have category tree or productId is not valid or product for this id not exist

```
{
  "errorMessage": "Not found category tree for this product, or productId is incorrect"
}
```
