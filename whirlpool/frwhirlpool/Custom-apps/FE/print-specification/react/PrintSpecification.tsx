import React, { useEffect, useState } from "react";
import { useProduct } from "vtex.product-context";
import style from "./style.css";

interface specification {
  specGroup: string;
  specAttribute: string;
  measureUnit?: string;
}

interface PrintSpecificationProps {
  specificationToPrint: [specification];
  label: string;
  aggregate: boolean;
  aggregateSymbol: string;
}

const filterGroup = (el: any, spec: [specification]) => {
  for (let i = 0; i < spec.length; i++) {
    if (el.name == spec[i].specGroup) return true;
  }
  return false;
};
const findAttribute = (specGroupName: string, spec: [specification]) => {
  const result = spec.filter(
    (e: specification) => e.specGroup == specGroupName
  );
  if (result.length == 1) {
    return [
      { value: result[0].specAttribute, measure: result[0].measureUnit },
    ];
  } else {
    let attributes: any = [];
    for (let i = 0; i < result.length; i++) {
      attributes.push({
        value: result[i].specAttribute,
        measure: result[0].measureUnit,
      });
    }
    return attributes;
  }
};

const findIndex = (attribute: any, attributes: any) => {
  for (let i = 0; i < attributes.length; i++) {
    if (attribute == attributes[i].value) {
      return i;
    }
  }
  return -1;
};

const getAttributes = (els: any, spec: [specification]) => {
  let values: any = [];
  for (let i = 0; i < els.length; i++) {
    let attributes = findAttribute(els[i].name, spec);
    let groupSpecifications = els[i].specifications;
    for (let j = 0; j < groupSpecifications.length; j++) {
      let index = findIndex(groupSpecifications[j].name, attributes);
      if (index !== -1) {
        values.push({
          attribute: attributes[index].value,
          value: groupSpecifications[j].values[0],
          measure: attributes[index].measure
        });
      }
    }
  }
  return values;
};

const filterForSpec = (groupsToFind: [specification], groupsToFilter: any) => {
  var resultGroup = groupsToFilter.filter((e: any) =>
    filterGroup(e, groupsToFind)
  );
  return getAttributes(resultGroup, groupsToFind);
};

const getAggregateValue = (values: any, aggregateSymbol: string) => {
  var toPrint = values[0].value + aggregateSymbol;
  for (let i = 1; i < values.length; i++) {
    if (i == values.length - 1) {
      toPrint = toPrint + values[i].value;
    } else {
      toPrint = toPrint + values[i].value + aggregateSymbol;
    }
    console.log(toPrint);
  }
  return toPrint+values[0].measure;
};

const PrintSpecification: StorefrontFunctionComponent<
  PrintSpecificationProps
> = ({
  specificationToPrint,
  label,
  aggregate = false,
  aggregateSymbol = "x",
}: PrintSpecificationProps) => {
  const [render, setRender] = useState(<></>);
  const productContextValue = useProduct();

  useEffect(() => {
    if (productContextValue.product == undefined) {
      return;
    }
    let values = filterForSpec(
      specificationToPrint,
      productContextValue.product.specificationGroups
    );
    if (values.length == 0) {
      return;
    }
    if (values.length == 1 && aggregate == true) {
      aggregate = false;
    }
    let toRender = <></>;
    if (aggregate) {
      toRender = (
        <div className={style.container}>
          <p className={style.attribute}>
            {label + " "}
            <span className={style.value}>
              {getAggregateValue(values, aggregateSymbol)}
            </span>
          </p>
        </div>
      );
    } else {
      toRender = values.map((e: any) => (
        <div className={style.container}>
          <p className={style.attribute}>
            {values.length == 1 ? label : e.attribute + ": "}
            <span className={style.value}>{e.measure == undefined? e.value:e.value.concat(" ",e.measure)}</span>
          </p>
        </div>
      ));
    }
    setRender(toRender);
  }, []);

  return render;
};

PrintSpecification.schema = {
  title: "Print specification",
  description: "Print one or more specification",
  type: "object",
  properties: {
    specificationToPrint: {
      title: "List of spec to print",
      description: "",
      default: undefined,
      type: "specification",
    },
    label: {
      title: "Label to assign a specification",
      description: "",
      default: "",
      type: "string",
    },
    aggregate: {
      title: "Are aggregate values?",
      description: "",
      type: "boolean",
      default: "false",
    },
    aggregateSymbol: {
      title: "Aggregate symbol to use",
      description: "",
      type: "string",
      default: "x",
    },
  },
};

export default PrintSpecification;
