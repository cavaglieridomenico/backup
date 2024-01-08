import React from 'react'
export interface InvitationConditionLayotInterface {
    valueToCheck: string
    propertyToCheck: string,
    Else?: React.ComponentType,
    Then?: React.ComponentType,
    children: any
}
export interface StateComponentInterface {
    resultCondition?: boolean
}