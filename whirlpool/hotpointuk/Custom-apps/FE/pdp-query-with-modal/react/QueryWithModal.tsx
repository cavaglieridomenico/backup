import React, { useState, useEffect } from 'react'
//import React, { useEffect } from 'react'
import { useQuery } from 'react-apollo'
import customQuery from './graphql/customQuery.graphql'
import { useProduct } from "vtex.product-context";
import styles from './styles.css'

interface QueryWithModalProps {
  /*urlStructure: string,
  labelStructure: string*/
  titleModal: string,
  modalLabel: string,
  placeholderSearchbarModal: string,
  modalTrigger: string
}
//https://api-cms.tps-cloud.com/apicms/apis/aa208b30-257d-11e9-b03f-b5666fec9770/d98b0640-ba5b-11ec-b8e2-dd92ddd7ac9e
const QueryWithModal: StorefrontFunctionComponent<QueryWithModalProps> = ({
  /*urlStructure, labelStructure,*/ modalLabel = "Also suitable for the following models", titleModal = "List of models", placeholderSearchbarModal = "Search model", modalTrigger = "List of models" }
) => {
  const [array, setArray] = useState([])
  const [filteredArray, setFilteredArray] = useState([])

  // const [cat, setCat]: any = useState({})
  const [showModal, setModalShow] = useState(false);
  // const [showCategoriesModal, setShowCategoriesModal] = useState([]);
  // const [nameShowedCategory, setNameShowedCategory] = useState("");
  const [inputValue, setInputValue] = useState("");
  //const [filterCategory, setFilterCategory]: any = useState([])

  const product = useProduct();
  const { data } = useQuery(customQuery, {
    variables: {
      sparePartId: product.product.productReference.toString()
    }
  })
  useEffect(() => {
    if (data) {
      setArray(data["getFitsIn"])
      setFilteredArray(data["getFitsIn"])
    }
  }, [data])




  const buildUrl = (obj: any) => {
    /*let url = urlStructure;
    Object.keys(obj).map((key) => {
      console.log(key)
      console.log(obj[key])
      url = url.replace(`${key}`, obj[key].replace(/\s+/g, '-'))
    })
    return url;*/
    let url = obj["modelNumber"] ? `/spare-parts/bom/${obj["modelNumber"].replace(/\s+/g, '').replace(/\//g, '').replace(/\(/g, '').replace(/\)/g, '').toLowerCase()}-${obj["industrialCode"]}` : `/spare-parts/bom/${obj["industrialCode"]}`;
    return url
  }
  const buildLabel = (obj: any) => {
    /*let label = labelStructure;
    Object.keys(obj).map((key) => {
      label = label.replace(`${key}`, obj[key])
    })*/
    console.log(obj)
    let label =  obj["modelNumber"] && obj["twelveNc"] ? `${obj["twelveNc"]} | ${obj["modelNumber"]} | ${obj["industrialCode"]}` : obj["modelNumber"] ? `${obj["modelNumber"]} | ${obj["industrialCode"]}` : obj["industrialCode"];

    return label;
  }


  /*useEffect(() => {
    let categories: any = {}
    array.map((arr: any) => {
      if (categories[arr.categoryName]) {
        categories[arr.categoryName].push(arr)
        setCat(categories)
      } else {
        categories[arr.categoryName] = [];
        categories[arr.categoryName].push(arr)
        setCat(categories)
      }
    })

  }, [array])

  useEffect(() => {

    if (inputValue && inputValue.length > 0) {
      setFilterCategory(filterIt(showCategoriesModal, inputValue))
    }
    else {
      setFilterCategory(showCategoriesModal)
    }
  }, [inputValue]);

  function filterIt(a:any, searchKey:any) {
    return a.filter(function(obj:any) {
      return Object.keys(obj).some(function(key) {
        console.log(obj[key])
        return obj[key].toLowerCase().includes(searchKey.toLowerCase());
      })
    });
  }
*/
  useEffect(() => {

    if (inputValue && inputValue.length > 0) {
      setFilteredArray(filterIt(array, inputValue))
    }
  }, [inputValue]);

  function filterIt(a:any, searchKey:any) {
    return a.filter(function(obj:any) {
      return Object.keys(obj).some(function(key) {
        console.log(obj[key] + " " + searchKey)
        if(obj[key] !== null)
        return obj[key].toLowerCase().includes(searchKey.toLowerCase());
      })
    });
  }

  return (
    <div>


      <p className={styles.titleModal}>{modalLabel}</p>
      <div className={styles.categoryContainer}>
        {/*Object.keys(cat).map((key) => {
          return <div className={styles.categoryTrigger} onClick={() => {
            setShowCategoriesModal(cat[key]);
            setFilterCategory(cat[key])
            setNameShowedCategory(key);
            setModalShow(true)
          }}>
            {key} ({cat[key].length})
          </div>
        })*/
        }

        <div className={styles.categoryTrigger} onClick={() => { setModalShow(true) }}>
          {modalTrigger} ({array.length})
        </div>

      </div>


        {showModal === true && (
           <div className={styles.containerModal}>
           <div className={styles.modalOverlay}></div>
           <div className={styles.modalWrapper}>
             <div className={styles.modal}>
               <div className={styles.closeModal} onClick={() => setModalShow(false)}>&times;</div>


               <p className={styles.titleModal}>{titleModal}</p>
               <input className={styles.modal_custom_search_input}
                 value={inputValue}
                 placeholder={placeholderSearchbarModal}
                 onChange={(e) => {
                   setInputValue(e.currentTarget.value)
                 }} />
               <div className={styles.containerModal}>
                 {filteredArray.map((model: any) => {
                   return (
                     <a className={styles.modelLink} href={buildUrl(model)}>{buildLabel(model)}</a>
                   )
                 })
                 }
               </div>
             </div>
           </div>

      </div>
        )}
    </div>
  )
};
QueryWithModal.schema = {
  title: "Query with modal",
  description: "A custom query with modal",
  type: "object",
  properties: {
    modalLabel: {
      title: "modalLabel",
      description: "modalLabel",
      default: undefined,
      type: "string",
    },
    titleModal: {
      title: "titleModal",
      description: "titleModal",
      default: undefined,
      type: "string",
    },
    placeholderSearchbarModal: {
      title: "Placeholder for the modal searchbar",
      description: "Placeholder for the modal searchbar",
      default: undefined,
      type: "string",
    },
    modalTrigger: {
      title: "Label of the modal trigger",
      description: "Label of the modal trigger",
      default: undefined,
      type: "string",
    }
  }
};
export default QueryWithModal
