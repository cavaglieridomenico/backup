import { AvailableContext, getMappingFn } from './mappings'

interface Params {
  link: string
  namespace?: string
  context?: Record<string, any>
  contextType: AvailableContext
  escapeLinkRegex?: RegExp
  replaceEscapedValue?: string,
}

export default function interpolateLink(params: Params) {
  const { link, namespace, context, contextType, escapeLinkRegex, replaceEscapedValue } = params

  const mapValues = getMappingFn(contextType)
  const variables = mapValues(context)

  let resolvedLink = link

  for (const key of Object.keys(variables)) {
    let newKey = key
    if (escapeLinkRegex) {
      if (replaceEscapedValue) {
        newKey = key.replace(escapeLinkRegex, replaceEscapedValue)
      } else {
        newKey = key.replace(escapeLinkRegex, '')
      }
    }


    // we slugify the context value so we don't end up with invalid characters on the URL
    try {

      const regex = new RegExp(
        `{${namespace ? `${namespace}.${newKey}` : newKey}}`,
        'g'
      )
      if (!replaceEscapedValue) {
        resolvedLink = escapeLinkRegex ? resolvedLink = resolvedLink.replace(regex, variables[key].replace(escapeLinkRegex, "")) : resolvedLink.replace(regex, variables[key])
      } else {
        resolvedLink = escapeLinkRegex ? resolvedLink = resolvedLink.replace(regex, variables[key].replace(escapeLinkRegex, replaceEscapedValue)) : resolvedLink.replace(regex, variables[key])
      }

    } catch (exc) {
      console.log("ERROR Creating Regex with pattern", `{${namespace ? `${namespace}.${newKey}` : newKey}}`)
    }
  }
  // Replace not found variables with empty string
  if (namespace) {
    const missingKeys = new RegExp(`{${namespace}.(.*)}`)
    resolvedLink = resolvedLink.replace(missingKeys, () => '')
  }

  return resolvedLink
}
