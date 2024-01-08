import React, { useEffect, useState } from "react";
import { useDevice } from "vtex.device-detector";
import styles from "./styles";

interface ContainerFaqProps {
  visibility: any[];
  children: any;
}

const ContainerFaq: StorefrontFunctionComponent<ContainerFaqProps> = ({
  visibility,
  children,
}) => {
  const { isMobile, device } = useDevice();
  let initialState: any[] = [];
  const [newChildren, setNewChidlren] = useState(initialState);

  useEffect(() => {
    let temp: any[] = [];
    children.map((child: any, index: number) => {
      if (visibility[index].show) {
        temp.push(child);
      }
    });
    setNewChidlren(temp);
  });

  return (
    <React.Fragment>
      {isMobile && device == 'phone' && newChildren}

      {(!isMobile || (isMobile && device == 'tablet')) && (
        <div className={styles.faqContainerCustom}>
          {newChildren.map((child: any) => {
            return (
              <div className={styles.singleQuestionFaqCustom}>{child}</div>
            );
          })}
        </div>
      )}
    </React.Fragment>
  );
};

ContainerFaq.schema = {
  title: "ContainerFaq",
  description: "ContainerFaq permette di raggruppare molteplici faq",
  type: "object",
};

export default ContainerFaq;
