//Utils functions
export const correctFormat = (recipeName) => {
  return recipeName.toLowerCase().replace(/ /g, "-")
}