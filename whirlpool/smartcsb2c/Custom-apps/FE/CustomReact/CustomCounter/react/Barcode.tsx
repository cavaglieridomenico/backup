import React, {useState}  from 'react'
import { Dropdown } from 'vtex.styleguide'
import { useCssHandles } from 'vtex.css-handles'
import { FormattedMessage,
         MessageDescriptor,
         useIntl,
         defineMessages } from 'react-intl'
import cookers from "./images/cookers.png"
import dishwasher from "./images/dishwasher.png"
import freezer from "./images/freezer.png"
import fridge from "./images/fridge.png"
import hobs from "./images/hobs.png"
import oven from "./images/oven.png"
import tumbledryer from "./images/tumble-dryer.png"
import washerdryers from "./images/washer-dryers.png"
import washingmachine from "./images/washing-machine.png"
import placeholdermodel from "./images/placeholder-model.png" 
import cappa from "./images/cappa.png" 
import { usePixel } from 'vtex.pixel-manager'

interface Barcode {}


interface selectedDrop {
    selectedOption: String;
}

const messages = defineMessages({
    SelectYourDevice: { id: 'store/countdown.SelectYourDevice' },
    Stoves: { id: 'store/countdown.Stoves' },
    Dishwasher: { id: 'store/countdown.Dishwasher' },
    Freezers: { id: 'store/countdown.Freezers' },
    Refrigerators: { id: 'store/countdown.Refrigerators' },
    Fridges: { id: 'store/countdown.Fridges' },
    Hobs: { id: 'store/countdown.Hobs' },
    Ovens: { id: 'store/countdown.Ovens' },
    Dryer: { id: 'store/countdown.Dryer' },
    WasherDryer: { id: 'store/countdown.WasherDryer' },
    Washingmachines: { id: 'store/countdown.Washingmachines' },
    Cappe: { id: 'store/countdown.Cappe' }
  })

const Barcode: StorefrontFunctionComponent<Barcode> = ({}) => {
    const { push } = usePixel()
    
    const intl = useIntl()

    const translateMessage = (message: MessageDescriptor) =>
    intl.formatMessage(message)

    const [selected, setSelected] = useState<selectedDrop>({
            selectedOption: translateMessage(messages.SelectYourDevice)
           })
    const options = [  
        { value: 0, label: translateMessage(messages.Stoves) },
        { value: 1, label: translateMessage(messages.Dishwasher) },   
        { value: 2, label: translateMessage(messages.Freezers) },
        { value: 3, label: translateMessage(messages.Refrigerators) },
        { value: 4, label: translateMessage(messages.Hobs) },
        { value: 5, label: translateMessage(messages.Ovens) },
        { value: 6, label: translateMessage(messages.Dryer) },
        { value: 7, label: translateMessage(messages.WasherDryer) },
        { value: 8, label: translateMessage(messages.Washingmachines) },
        { value: 9, label: translateMessage(messages.Cappe) }
    ];
     
    const CSS_HANDLES = ["barcodeMainDiv","barcodeInnerDiv","barcodeDropdown","barcodeImages","barcodeEndDiv","barcodeEndLabel","barcodeI"]
    const handles = useCssHandles(CSS_HANDLES)

    function selectedContactArea () {
        let url = window.location.href;
        let categorySelected;
    
        if(url.indexOf('/p')) {
            categorySelected = 'Product page'
        }
        else {
            categorySelected ='Homepage'
        }
        return categorySelected + " - " + url
      }

    const analitycsPushEvent = (newOption: string) => {
        let action = "Stoves";
        switch (newOption) {
            case "1":
                action = "Dishwasher";
                break;
            case "2":
                action = "Freezers";
                break;
            case "3":
                action = "Refrigerators";
                break;
            case "4":
                action = "Hobs";
                break;
            case "5":
                action = "Ovens";
                break;
            case "6":
                action = "Dryer";
                break;
            case "7":
                action = "WasherDryer";
                break;
            case "8":
                action = "Washingmachines";
                break;
            case "9":
                action = "Cappe";
                break;
        }


        //FUNREQSPARE15
        push({
            'event': 'barCodeSpare',
            'eventCategory': 'Barcode Model ID',
            'eventAction': action,
            'eventLabel': selectedContactArea()
          });
    }

  return (<div className={`${handles.barcodeMainDiv}`}>
  
            <div className={`${handles.barcodeInnerDiv}`}>
               { <Dropdown
                className={`${handles.barcodeDropdown}`}
                label={<FormattedMessage id="store/countdown.whereDoIFindMyModel">
                {message => <p className={`${handles.footerLabels}`}>{message}</p> }
                </FormattedMessage>}
                placeholder={selected.selectedOption}
                size="regular"
                options={options}
                value={selected.selectedOption}
                onChange={(_: any, v: any) => {                    
                    setSelected((prevState) => ({ ...prevState, selectedOption: options[v].label })) 
                    analitycsPushEvent(v);
                }}
                />} 

                {/* Here is the switch case for rendering dropdown images */}

                <div>
                {(function() {
                    switch (selected.selectedOption) {
                        case translateMessage(messages.Stoves):   
                        return (
                            <div>
                                <img className={`${handles.barcodeImages}`} src={cookers} />
                            </div>
                        )
                        break;
                    case translateMessage(messages.Dishwasher):
                    
                        return (
                            <div>
                                <img className={`${handles.barcodeImages}`} src={dishwasher} />
                            </div>
                        )
                        break;
                    case translateMessage(messages.Freezers):   
                        return (
                            <div>
                                <img className={`${handles.barcodeImages}`} src={freezer} />
                            </div>
                        )
                        break;
                    case translateMessage(messages.Cappe):   
                    return (
                        <div>
                            <img className={`${handles.barcodeImages}`} src={cappa} />
                        </div>
                    )
                    break;
                    case translateMessage(messages.Refrigerators):
                    
                        return (
                            <div>
                                <img className={`${handles.barcodeImages}`} src={fridge} />
                            </div>
                        )
                        break;
                    case translateMessage(messages.Hobs):
                    
                        return (
                            <div>
                                <img className={`${handles.barcodeImages}`} src={hobs} />
                            </div>
                        )
                        break;
                    case translateMessage(messages.Ovens):   
                        return (
                            <div>
                                <img className={`${handles.barcodeImages}`} src={oven} />
                            </div>
                        )
                        break;
                    case translateMessage(messages.Dryer):
                    
                        return (
                            <div>
                                <img className={`${handles.barcodeImages}`} src={tumbledryer} />
                            </div>
                        )
                        break;
                    case translateMessage(messages.WasherDryer):   
                        return (
                            <div>
                                <img className={`${handles.barcodeImages}`} src={washerdryers} />
                            </div>
                        )
                        break;
                    case translateMessage(messages.Washingmachines):
                    
                        return (
                            <div>
                                <img className={`${handles.barcodeImages}`} src={washingmachine} />
                            </div>
                        )
                        break;
                    default : 
                        return (
                            <div>
                                <img className={`${handles.barcodeImages}`} src={placeholdermodel} />
                            </div>
                        )
                        break;
                    }
                })()}

                </div>

                <div className={`${handles.barcodeEndDiv}`}>

                    <p className={`${handles.barcodeI}`}>ⓘ</p>
                    <FormattedMessage id="store/countdown.modelNumberPlace">
                    {message => <p className={`${handles.barcodeEndLabel}`}>{message}</p> }
                    </FormattedMessage>
             

                 </div>

            </div>
            

        </div>)

    
} 
 
export default Barcode