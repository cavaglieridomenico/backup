import React, { useEffect, useState } from "react";
import { useCssHandles } from "vtex.css-handles";
//typings
import {
  InvitationConditionLayotInterface,
  StateComponentInterface,
} from "./typings/global";

const CSS_HANDLES = ["wrapper"] as const;

const InvitationConditionLayout: StorefrontFunctionComponent<InvitationConditionLayotInterface> = ({
  propertyToCheck,
  valueToCheck = "true",
  Then,
  Else,
  children,
}) => {
  const handles = useCssHandles(CSS_HANDLES);
  const [stateComponent, setstateComponent] = useState<StateComponentInterface>(
    {
      resultCondition: false,
    }
  );

  //mount
  useEffect(() => {
    setstateComponent({
      ...stateComponent,
      resultCondition: window.sessionStorage.getItem(propertyToCheck) == valueToCheck.toLowerCase() ? true : false,
    });
  }, []);


  if (stateComponent.resultCondition) {
    if (Then) {
      return (
        <div className={handles.wrapper}>
          <Then />
        </div>
      );
    }
    return <>{children}</>;
  } else if (!stateComponent.resultCondition) {
    if (Else) {
      return (
        <div className={handles.wrapper}>
          <Else />
        </div>
      );
    }
    return null;
  }
  return null;
};

InvitationConditionLayout.schema = {
  title: "editor.InvitationConditionLayot.title",
  description: "editor.InvitationConditionLayot.description",
  type: "object",
  properties: {
    propertyToCheck: {
      title: "Property",
      type: "string",
      description: "this is the property that will be checked",
      default: "invitations",
    },
    valueToCheck: {
      title: "Value",
      description: "this is the property's value that will be checked",
      enum: ["false", "true"],
      enumName: ["False", "True"],
      widget: {
        "ui:widget": "radio",
      },
      default: "true",
    }
  },
};

export default InvitationConditionLayout;
