import React, { useEffect, useState } from 'react'
import { usePixel } from "vtex.pixel-manager";

import styles from './styles.css'
interface item {
  label: string,
  imageTopFirst: string,
  imageTopSecond: string,
  imageBottom: string,
  group: any

}
interface DropdownProps {
  items: item[]
  placeholder: string
}

const Dropdown: StorefrontFunctionComponent<DropdownProps> = ({
  items = [],
  placeholder = "My placeholder"
}) => {
  const [selectedItem, setSelectedItem] = useState({ imageTopFirst: "", imageTopSecond: "", label: "", imageBottom: "" })
  const [listActive, setListActive] = useState(false);
  const { push } = usePixel();

  const [groupedItems, setGroupedItems]: any = useState({});

  useEffect(() => {
    if (items && items.length > 0) {
      let grouped: any = {};
      items.map((item: item) => {

        if (!grouped[item.group]) {
          grouped[item.group] = [];
        }
        grouped[item.group].push(item);
      })
      setGroupedItems(grouped);
    }
  }, [items])

    return (
    <div className={styles.dropdown}>

      {selectedItem.imageTopFirst && (
        <img className={styles.dropdown_image_top} src={selectedItem.imageTopFirst} />
      )}{selectedItem.imageTopSecond && (
        <img className={styles.dropdown_image_top} src={selectedItem.imageTopSecond} />
      )}
      <div className={styles.dropdown_container} onClick={() => {setListActive(!listActive)}}>
        <div className={styles.dropdown_placeholder}>
          {selectedItem.label ? selectedItem.label : placeholder}
        </div>
        <div className={[styles.dropdown_list, listActive ? styles.dropdown_list_active : ""].join(" ")}>
          {groupedItems && Object.keys(groupedItems).map((key: any) => {
            return <div className={styles.dropdown_list_group}>
              <span className={styles.dropdown_list_group_title}>{key}</span>
              {groupedItems[key].map((item: any, index: number) => {
                return <div className={styles.dropdown_listItem}
                  onClick={() => {
                    setSelectedItem(groupedItems[key][index])

                    push({
                      'event': "funnelStepSpareUK",
                      'eventCategory': 'Spare Parts LP Funnel',
                      'eventAction': "Where do I find my code pop-up",
                      'eventLabel': groupedItems[key][index]["label"]
                    });

                    push({
                      'event': 'barCodeSpare',
                      'eventCategory': 'Barcode Model ID',
                      'eventAction': groupedItems[key][index]['group'],
                      'url': window.location.href
                    });
                  }}>
                  {item.label}
                </div>
              })}
            </div>
          })}
        </div>
        {selectedItem.imageBottom && (
          <img className={styles.dropdown_image} src={selectedItem.imageBottom} />
        )}
      </div>
    </div>
  )
}
Dropdown.schema = {
  title: "DropDownShowImages",
  description: "A custom drop down that shows an image on selection",
  type: "object",
  properties: {
    placeholder: {
      title: "Dropdown placeholder",
      description: "Dropdown placeholder",
      default: undefined,
      type: "string",
    },
    items: {
      label: "Select options",
      description: "",
      type: "array",
      uniqueItems: true,
      items: {
        properties: {
          label: {
            type: "string",
          },
          group: {
            type: "string",
          },
          imageTopFirst: {
            type: "string",
            widget: { //here you can choose a file in your computer
              "ui:widget": "image-uploader"
            },
            title: "First image top"
          },
          imageTopSecond: {
            type: "string",
            widget: { //here you can choose a file in your computer
              "ui:widget": "image-uploader"
            },
            title: "Second image top"
          },
          imageBottom: {
            type: "string",
            widget: { //here you can choose a file in your computer
              "ui:widget": "image-uploader"
            },
            title: "Bottom image"
          }
        },
      },
    },
  },
};
export default Dropdown
