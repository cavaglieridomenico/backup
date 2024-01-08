interface reasonsProps {
  id: string
  value: string
  label: string
}
interface Reason extends Array<reasonsProps>{}

export const reasons: Reason = [
  { value: "", label: "Choisissez un sujet", id: "Choisissez un sujet" },
  { value: "Contrats de garantie", label: "Contrats de garantie", id: "Contrats de garantie" },
  { value: "Assistance technique", label: "Assistance technique", id: "Assistance technique" },
  { value: "Gestion de la confidentialitè", label: "Gestion de la confidentialitè", id: "Gestion de la confidentialitè" },
  { value: "Assistance appareils connectés", label: "Assistance appareils connectés", id: "Assistance appareils connectés" },
  { value: "Autre motifs", label: "Autre motifs", id: "Autre motifs" },
  { value: "Achat de produits (informations, conseils)", label: "ESHOP: Achat de produits (informations, conseils)", id: "Achat de produits (informations, conseils)"},
  { value: "Commande en cours (modification des informations ou des produits)", label: "ESHOP: Commande en cours (modification des informations ou des produits)", id: "Commande en cours (modification des informations ou des produits)"},
  { value: "Paiement", label: "ESHOP: Paiement", id: "Paiement"},
  { value: "Suivi de ma commande, livraison, installation", label: "ESHOP: Suivi de ma commande, livraison, installation", id: "Suivi de ma commande, livraison, installation"},
  { value: "Demande de rétractation", label: "ESHOP: Demande de rétractation", id: "Demande de rétractation"},
  { value: "Suivi de ma demande de rétractation (statut, remboursement)", label: "ESHOP: Suivi de ma demande de rétractation (statut, remboursement)", id: "Suivi de ma demande de rétractation (statut, remboursement)"},
  { value: "Autres demandes", label: "ESHOP: Autres demandes", id: "Autres demandes"}
]