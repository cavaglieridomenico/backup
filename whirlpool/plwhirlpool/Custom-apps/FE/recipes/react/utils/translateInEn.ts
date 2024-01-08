//Function to translate in EN from PL for event "recipeFilters" sent to GA
const translateInEn = (polishWord: string, isFamilyFilter: boolean) => {
  switch(polishWord?.toLowerCase()) {
    case "kategorie": return isFamilyFilter ? "courses" : "Courses";
    case "rodzaj": return isFamilyFilter ? "type" : "Type";
    case "główne składniki": return isFamilyFilter ? "main-ingredients" : "Main Ingredients";
    case "resetowanie": return isFamilyFilter ? "reset" : "Reset";
    default: return "";
  }
}
export default translateInEn;