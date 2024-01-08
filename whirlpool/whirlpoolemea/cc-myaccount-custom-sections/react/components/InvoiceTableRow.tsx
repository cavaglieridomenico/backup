import React, { FC } from 'react'
import style from './style.css'
import { FormattedMessage } from "react-intl";
import { Button } from 'vtex.styleguide'

interface TableRow {
    date: string,
    price: string,
    orderId: string,
    invoices: Array<any>,
    path: string
}

const InvoiceTableRow: FC<TableRow>  = ({ date, price, orderId, invoices, path }) => {
   
    return(
    <div className={`${style.containerTableRow}`}>
    <div className={`${style.childContainerTableRow} ${style.tableRowHeader}`}>
        <div>
            <div className={`${style.colTitle}`}><FormattedMessage id="store/invoice-section.invoice-date" /></div>
            <div className={`${style.colDescr}`}>{date}</div>
        </div>
        <div>
            <div className={`${style.colTitle}`}><FormattedMessage id="store/invoice-section.invoice-orderid" /></div>
            <div className={`${style.colDescr}`}>
               <a 
               className={`${style.invoiceLink}`}
               href={path}>
                    {orderId}
               </a> 
            </div>
        </div>
        <div>
            <div className={`${style.colTitle}`}><FormattedMessage id="store/invoice-section.invoice-price" /></div>
            <div className={`${style.colDescr}`}>{price}</div>
        </div>
    </div>
    <div>
        <div  className={`${style.childContainerTableRow} ${style.tableRowEntites}`}>
            {invoices?.length>0 ? 
            <>
            {invoices.map((item,index)=>{
            return (<div className={`${style.invoiceWrapper}`} key={index}>
                <div className={`${style.pdfIconWrapper}`}>
                    <img 
                    alt="pdf icon" 
                    className={`${style.pdfIconImage}`}
                    src="https://whirlpoolemea.vtexassets.com/arquivos/PDF_file_icon.svg"/>
                </div>
                <div>
                   <span  className={`${style.pdfFileName}`}> {item.name}</span>
                </div>
                <div
                className={`${style.downloadButton}`}
                >
                    <Button
                        variation="tertiary"
                        noUpperCase={true}
                        href={item.path}
                        >
                        <FormattedMessage id="store/invoice-section.invoice-download" /> 
                    </Button>
                </div>
            </div>)
            })}

            </>
            : <>
               <div className={`${style.colTitle2}`}><FormattedMessage id="store/invoice-section.invoice-nodownload" /></div>
            </>
            }
        </div>
    </div>
    </div>)
}

export default InvoiceTableRow