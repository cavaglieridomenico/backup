/* eslint-env jest */
import React from 'react'
import { render } from '@vtex/test-tools/react'
import ProductAvailability from '../components/ProductAvailability'

describe('Product Availability component', () => {
  it('should not render with availability 0 or null', () => {
    const { queryByText } = render(
      <ProductAvailability availability={"0"} lowStockMessage={'Only {quantity} left!'} highStockMessage={'High stock'} threshold={0} />
    )
    expect(queryByText('Only')).toBeNull()
    expect(queryByText('left!')).toBeNull()
    expect(queryByText('High stock')).toBeNull()
  })

  it('should not render with low stock message', () => {
    const { getByText, queryByText } = render(
      <ProductAvailability availability={"10"} lowStockMessage={'Only {quantity} left!'} highStockMessage={'High stock'} threshold={100} />
    )
    expect(getByText('Only')).toBeDefined()
    expect(getByText('left!')).toBeDefined()
    expect(getByText('10')).toBeDefined()

    // High stock message should not be visible
    expect(queryByText('High stock')).toBeNull()
  })

  it('should not render with high stock message', () => {
    const { getByText, queryByText } = render(
      <ProductAvailability availability={"105"} lowStockMessage={'Only {quantity} left!'} highStockMessage={'In stock!'} threshold={100} />
    )

    expect(getByText('In stock!')).toBeDefined()

    // low stock message should not be visible
    expect(queryByText('Only')).toBeNull()
  })
})