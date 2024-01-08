import React, { FC, useEffect, useState } from 'react'
import InvoiceTableRow from "./components/InvoiceTableRow"
import style from './components/style.css'
import { Spinner, Pagination } from 'vtex.styleguide'
import { useIntl, FormattedMessage } from 'react-intl'


interface Order {
  orders: Array<any>,
  totalOrders: number ,
  currentPage: number ,
  ordersPerPage: number ,
  totalPages: number
}

const InvoiceTable: FC = ({  }) => {

    const [orderData, setOrderData] = useState<null | Order>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [startPagination, setStartPagination] = useState<number>(1)
    const [endPagination, setEndPagination] = useState<number>(15)

    const intl = useIntl()

    async function getOrders(page:number) {
        let response = await fetch(`/_v/wrapper/api/invoices?page=${page}`, {
          method: "GET",
          headers: {},
        })
        let responseJson = await response.json().catch((err)=>console.error(err))
        setOrderData(responseJson)
        if(responseJson.totalOrders < responseJson.ordersPerPage)
          setEndPagination(responseJson.totalOrders)
        setLoading(false)
        return responseJson
      }

      function onNextPage(orders:Order){
          setLoading(true)
          setStartPagination(startPagination + orders.ordersPerPage)
          setEndPagination(endPagination + orders.ordersPerPage)
          setCurrentPage(currentPage + 1)
          window?.scrollTo(0, 0)
      }

      function onPreviousPage (orders:Order){
          setLoading(true)
          setStartPagination(startPagination - orders.ordersPerPage)
          setEndPagination(endPagination - orders.ordersPerPage)
          setCurrentPage(currentPage - 1)
          window?.scrollTo(0, 0)
      }

      useEffect(() => {
          getOrders(currentPage)
      },[currentPage])

    return(
    <>
    {loading? (
        <div className={`${style.rowWrapperLoader}`}>
          <Spinner
          size={80}
          />
        </div>
      ):
    <>
    {orderData?
        <div className={`${style.rowWrapper}`}>
        {orderData.orders.map((item, index)=>{
          return <InvoiceTableRow
                  key={index}
                  date={item.creationDate}
                  price={item.total}
                  orderId={item.id}
                  invoices={item.invoices}
                  path={item.path}
          />})}
          {orderData.orders.length > 0 &&
              <div className={`${style.paginationWrapper}`}>
                    <Pagination
                    textShowRows=""
                    currentItemFrom={startPagination}
                    currentItemTo={endPagination}
                    textOf={intl.formatMessage({ id: "store/invoice-section.invoice-pagination"})}
                    totalItems={orderData.totalOrders}
                    onNextClick={() => onNextPage(orderData)}
                    onPrevClick={() => onPreviousPage(orderData)}

                />
              </div>
          }
        { orderData.totalOrders === 0 &&
            <div className={`${style.colTitleNoOrders}`}><FormattedMessage id="store/invoice-section.invoice-noorders" /></div>
        }
        </div> : (null)}
    </>
        }
    </>)
}

export default InvoiceTable
