import { createContext } from "react";

const NewsletterContext = createContext<{ automatic: boolean }>({
  automatic: false,
});

export default NewsletterContext;
