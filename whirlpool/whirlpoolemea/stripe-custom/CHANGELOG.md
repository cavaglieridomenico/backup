# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.0.5] - 2022-09-02

## [0.0.3] - 2022-08-23

## [0.0.1] - 2022-08-08
[RB-1026](https://whirlpoolgtm.atlassian.net/browse/RB-1026)
- First publish of the new stripe popup-custom component with sponsor account
- It saves its closing in cookies
- Import in the header to show it in every page

Example of usage: 
  ``` json
"stripe-custom#beta":{
    "title":"Stripe Banner",
    "children": ["rich-text#beta"]
  },
  "rich-text#beta":{
    "title": "Testo dello Stripe",
    "props": {
      "blockClass": "",
      "text": "TESTO DI PROVA DELLO STRIPE - POP UP CUSTOM IN HOMEPAGE",
      "textAlignment": "CENTER",
      "textPosition": "CENTER"
    }
  },
  ```