interface reasonsProps {
  id: string
  value: string
  label: string
}
interface Reason extends Array<reasonsProps>{}

export const reasons: Reason = [
  { value: "", label: "Choisissez un sujet", id: "Choisissez un sujet" },
  { value: "france@fr.whirlpool.eu", label: "Contrats de garantie", id: "Contrats de garantie" },
  { value: "france@fr.whirlpool.eu", label: "Assistance technique", id: "Assistance technique" },
  { value: "eshop@whirlpool.com", label: "Gestion de la confidentialitè", id: "Gestion de la confidentialitè" },
  { value: "france@fr.whirlpool.eu", label: "Assistance appareils connectés", id: "Assistance appareils connectés" },
  { value: "france@fr.whirlpool.eu", label: "Autre motifs", id: "Autre motifs" },
  { value: "eshop@whirlpool.com", label: "ESHOP: Achat de produits (informations, conseils)", id: "Achat de produits (informations, conseils)"},
  { value: "eshop@whirlpool.com", label: "ESHOP: Commande en cours (modification des informations ou des produits)", id: "Commande en cours (modification des informations ou des produits)"},
  { value: "eshop@whirlpool.com", label: "ESHOP: Paiement", id: "Paiement"},
  { value: "eshop@whirlpool.com", label: "ESHOP: Suivi de ma commande, livraison, installation", id: "Suivi de ma commande, livraison, installation"},
  { value: "eshop@whirlpool.com", label: "ESHOP: Demande de rétractation", id: "Demande de rétractation"},
  { value: "eshop@whirlpool.com", label: "ESHOP: Suivi de ma demande de rétractation (statut, remboursement)", id: "Suivi de ma demande de rétractation (statut, remboursement)"},
  { value: "eshop@whirlpool.com", label: "ESHOP: Autres demandes", id: "Autres demandes"}
]