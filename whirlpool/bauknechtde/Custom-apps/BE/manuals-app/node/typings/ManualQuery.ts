export interface ManualSuggestionsQuery {
  query: {
    code: string
  }
}

export interface ManualDocumentsQuery {
  query: {
    code: string,
    languages: [string]
  }
}

