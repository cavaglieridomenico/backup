STEPS:

1) Cambiare tutte le specification del gruppo Endeca (sono le sole che devono comparire come filtri) e mettere ":" alla fine del nome. Questo passaggio serve per evitare che le facet desiderate non compaiano come filtri per via di specification omonime nascoste. !NEW: Dal prossimo export del catalogo MEP (16/07/21) questo step non sarà più necessario.

2) Listare le specification da nascondere:

	- per ricostruire situazione VTex si lancia lo script 4.2-getSpecificationByCategory.js (modificare solo id categorie prima di eseguire script) che genera file specificationList.json.
	
	- poi si usa lo script 3.1-specsToHide.js per lavorare con file specificationList.json e produrre file specsToHide.json.

3) Agire sulle facets da admin graphQL IDE, usando app admin-search. Utilizzare la Query e le Query Variables seguenti modificando solo la option "attributeFilterSearch" delle Query Variables (sostituendo i valori attualmente presenti con i nomi delle facet presenti nel file specsToHide.json):

Query:

```
mutation ($updateSearchSettings: SearchSettingsInput, $reindex: Boolean) {
  updateSearchSettings(searchSettings: $updateSearchSettings, reindex: $reindex) {
    status,
    data {
      body {
        options {
          attributeFilterSearch
        }
      }
    }
  }
}
```



Query Variables:

```
{
  "updateSearchSettings": {
    "vtexSettings": {
      "newReleasesThreshold": 30
    },
    "indexOptions": {
      "metadataAttributesWhitelist": [],
      "metadataFromKeywords": false,
      "productSplitAttribute": null
    },
    "options": {
      "suggestionAttributes": [
        "categoria-principal",
        "categoria",
        "subcategoria",
        "Category 1",
        "Category 2",
        "Category 3"
      ],
      "attributeFilterSearch": [
        "new-release",
        "sellername",
        "rv",
        "subcategory"
      ],
      "attributeSort": [
        {
          "key": "stock-availability-",
          "value": 0
        },
        {
          "key": "installation-type-",
          "value": 1
        },
        {
          "key": "type-",
          "value": 2
        },
        {
          "key": "type-of-appliance-",
          "value": 3
        },
        {
          "key": "wash-capacity--kg--",
          "value": 4
        },
        {
          "key": "washing-capacity--kg--",
          "value": 5
        },
        {
          "key": "drying-type-",
          "value": 6
        },
        {
          "key": "drying-capacity--kg--",
          "value": 7
        },
        {
          "key": "spin-speed-",
          "value": 8
        },
        {
          "key": "width--cm--",
          "value": 9
        },
        {
          "key": "height--cm--",
          "value": 10
        },
        {
          "key": "capacity--l--",
          "value": 11
        },
        {
          "key": "frost-free-",
          "value": 12
        },
        {
          "key": "energy-rating-",
          "value": 13
        },
        {
          "key": "colour-",
          "value": 14
        },
        {
          "key": "special-features-",
          "value": 15
        }
      ],
      "attributeRename": [
        {
          "key": "stockavailability",
          "value": "stock availability:"
        }
      ]
    }
  }
}
```



4) Controllare:
	
	- specification in più da nascondere dalle facet (inserite già in coda nel file specsToHide.json, quindi dovrebbero essere già ok): category-1, category-2, category-3, brand, new-release, sellername, promotion, loading-type-, depth-, ventilator-inside-. Se dovessero essere ancora visibili nei filtri verificare da admin/Catalog/Categories/{nomeCategoria1Livello}/{nomeCategoria2Livello}/{nomeCategoria3Livello}/Actions/Field(Product) che il nome della specification non sia variato, se si rimuovere dalla sezione "Hide facet" admin/Store Setup/Search/Search configuration il vecchio nome della specification e aggiure il nuovo.
	
	- specification da far vedere a FE (non come filtri nelle facet, ma nella PDP): specification del gruppo "RatingGroupAttrLogo", se a FE non arrivano correttamente i loro valori eseguire lo script 4.3-modifySpecificationNames.js (lo script dovrebbe essere già ok => modifica di specification.Name, specification.IsActive=true, specification.IsFilter=false) per aggiungere i ":" alla fine dei nomi di queste specification.
	
	- se ci sono filtri/valori di specification mancanti a FE effettuare le seguenti verifiche (andando sulla pagina admin/Catalog/Categories/{nomeCategoria1Livello}/{nomeCategoria2Livello}/{nomeCategoria3Livello}/Actions/Field(Product)):
		1) assicurarsi che le specification in questione risultino attive => flag "Active" -> Yes.
		2) se si tratta di filtri, assicurarsi che le specification in questione risultino dei filtri => flag "Filter" -> Yes.
		3) assicurarsi che le specification abbiano un valore.
		
		Per risolvere i problemi ai punti 1 e 2 dovrebbe essere sufficiente eseguire lo script 4.3-modifySpecificationNames.js dopo le opportune modifiche (considerare il gruppo di specification da modificare e modificare il campo corretto IsActive/IsFilter).
		Il problema al punto 3 deriva da un caricamento del catalogo non corretto, quindi da un errore lato MEP/GCP.
		Considerare il fatto che per vedere sul FE le modifiche fatte sulle facet potrebbe essere necessario cancellare la cache.
		Dopo aver effettuato delle modifiche sul nome delle specification potrebbe essere necessario effettuare un reindex dei prodotti a catalogo (con le nostre numeriche di circa 1600 prodotti dura all'incirca 30 min) cliccando su "Reindex Base" dalla pagina admin/Site/fullcleanup.aspx. L'unica persona che può effettuare questa operazione al momento è Karla Medina.