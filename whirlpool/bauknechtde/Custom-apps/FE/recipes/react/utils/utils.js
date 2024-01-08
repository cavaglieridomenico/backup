//Utils functions
export const correctFormat = recipeName => {
  return recipeName
    .toLowerCase()
    .replaceAll(/ /g, '-')
    .replaceAll('ä', 'ae')
    .replaceAll('ö', 'oe')
    .replaceAll('ü', 'ue')
    .replaceAll('ß', 'ss')
}
