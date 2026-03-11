import { KeyboardEvent } from 'react'
import { TabsField } from './TabsField'

export const TabsView = ({
    onHandleKeyDown,
    customFieldsData,
    index,
    onAddCustomFieldsData,
    onSignatureClicked,
    selectedFillDataField,
}: {
    onHandleKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void
    index: number
    customFieldsData: any
    onAddCustomFieldsData: any
    onSignatureClicked: any
    selectedFillDataField?: any
}) => {
    return (
        <>
            {customFieldsData &&
                customFieldsData?.length > 0 &&
                customFieldsData?.map((fieldData: any) => (
                    <TabsField
                        onAddCustomFieldsData={onAddCustomFieldsData}
                        onHandleKeyDown={onHandleKeyDown}
                        onSignatureClicked={onSignatureClicked}
                        fieldData={fieldData}
                        outerIndex={index}
                        selectedFillDataField={selectedFillDataField}
                        allFields={customFieldsData}
                    />
                ))}
        </>
    )
}
