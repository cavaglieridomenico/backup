import React, { useState } from 'react'
import { Dropdown } from 'vtex.styleguide'
import { useCssHandles } from 'vtex.css-handles'
import styles from './styles.css'
import {
    FormattedMessage,
    MessageDescriptor,
    useIntl,
    defineMessages
} from 'react-intl'
//import pixel message
import { usePixel } from 'vtex.pixel-manager'
/*
import cookers from "./images/cookers.png";
import dishwasher from "./images/dishwasher.png";
import placeholdermodel from "./images/placeholder-model.png";
*/
interface Barcode { }


interface selectedDrop {
    selectedOption: String;
}

const messages = defineMessages({
    SelectYourDevice: { id: 'store/countdown.SelectYourDevice' },
    Laundry: { id: 'store/countdown.Laundry' },
    Dishwasher: { id: 'store/countdown.Dishwasher' },
    Cooling: { id: 'store/countdown.Cooling' },
    Cooking: { id: 'store/countdown.Cooking' }
})

const Barcode: StorefrontFunctionComponent<Barcode> = ({ }) => {
    const { push } = usePixel()
    const intl = useIntl()
    const translateMessage = (message: MessageDescriptor) =>
        intl.formatMessage(message)

    const [selected, setSelected] = useState<selectedDrop>({
        selectedOption: translateMessage(messages.SelectYourDevice)
    })
    const CSS_HANDLES = ["barcodeMainDiv", "barcodeInnerDiv", "barcodeDropdown", "barcodeImages", "barcodeEndDiv", "barcodeEndLabel", "barcodeI"]
    const handles = useCssHandles(CSS_HANDLES)

    function selectedContactArea (){
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

    const analitycsPushEvent =()=>{
        //FUNREQSPARE15
        push({
            'event': 'barCodeSpare',
            'eventCategory': 'Barcode Model ID',
            'eventAction': selected.selectedOption,
            'eventLabel': selectedContactArea()
          });
    }
    return (<div className={styles.marginBarcodeContainer}>

        <div>
            {<Dropdown
                className={`${handles.barcodeDropdown}`}
                label={<FormattedMessage id="store/countdown.whereDoIFindMyModel">
                    {message => <p className={`${handles.footerLabels}`}>{message}</p>}
                </FormattedMessage>}
                placeholder={selected.selectedOption}
                size="regular"
                options={[
                    { value: translateMessage(messages.Laundry), label: translateMessage(messages.Laundry) },
                    { value: translateMessage(messages.Dishwasher), label: translateMessage(messages.Dishwasher) },
                    { value: translateMessage(messages.Cooling), label: translateMessage(messages.Cooling) },
                    { value: translateMessage(messages.Cooking), label: translateMessage(messages.Cooking) }
                ]}
                value={selected.selectedOption}
                onChange={(_: any, v: any) => { 
                    analitycsPushEvent()
                    setSelected((prevState) => ({ ...prevState, selectedOption: v })) 
                }}
            />}

            {/* Here is the switch case for rendering dropdown images */}

            <div>
                {(function () {
                    switch (selected.selectedOption) {
                        case translateMessage(messages.Laundry):
                            return (
                                <div>
                                    <img className={styles.barcodeImages} src="/arquivos/find-my-model-number-washing-machine.png" />
                                </div>
                            )
                            break;
                        case translateMessage(messages.Dishwasher):

                            return (
                                <div>
                                    <img className={styles.barcodeImages} src="/arquivos/find-my-model-number-dishwasher.png" />
                                </div>
                            )
                            break;
                        case translateMessage(messages.Cooling):

                            return (
                                <div>
                                    <img className={styles.barcodeImages} src="/arquivos/find-my-model-number-fridge-freezer.png" />
                                </div>
                            )
                            break;
                        case translateMessage(messages.Cooking):

                            return (
                                <div>
                                    <div>
                                        <img className={styles.barcodeImages} src="/arquivos/find-my-model-number-single-oven.png" />
                                    </div>
                                    <div>
                                        <img  className={styles.barcodeImages} src="/arquivos/find-my-model-number-double-oven.png" />
                                    </div>
                                </div>
                            )
                            break;

                        default:
                            return (
                                <div>
                                    <img className={`${handles.barcodeImages}`} src="/arquivos/find-my-model-number-washing-machine.png" />
                                </div>
                            )
                            break;
                    }
                })()}

            </div>

            <div className={`${handles.barcodeEndDiv}`}>

                <p className={`${handles.barcodeI}`}>ⓘ</p>
                <FormattedMessage id="store/countdown.modelNumberPlace">
                    {message => <p className={`${handles.barcodeEndLabel}`}>{message}</p>}
                </FormattedMessage>


            </div>

        </div>


    </div >)


}

export default Barcode