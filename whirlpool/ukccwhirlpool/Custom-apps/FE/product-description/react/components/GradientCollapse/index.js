import React, { useState, useRef, useLayoutEffect } from "react";
import PropTypes from "prop-types";
import { Transition } from "react-transition-group";
import debounce from "debounce";
import classNames from "classnames";
import { usePixel } from 'vtex.pixel-manager'

import styles from "./styles.css";

const transitionStyle = (transitionTime) => ({
  transition: `${transitionTime}ms ease-in-out`,
});

const fadeBottomClasses = (state) =>
  classNames(styles.fadeBottom, { "o-0": state === "entered" }, "w-100 h-50");

const pointerEventsAutoClasses = (state) =>
  classNames(
    styles.pointerEventsAuto,
    {
      "bg-transparent": state === "entered",
      "bg-base": state !== "entered",
    },
    "tc w-100"
  );

/**
 * @deprecated This component is deprecated.
 */
function GradientCollapse(props) {
  const {
    children,
    collapseHeight,
    onCollapsedChange,
    productName,
    productCode,
    collapsed: collapsedProp,
    showMoreLabel,
    showLessLabel,
  } = props;

  const [collapsed, setCollapsed] = useState(collapsedProp);
  const [prevCollapsedProp, setPrevCollapsedProp] = useState(collapsedProp);
  const [maxHeight, setMaxHeight] = useState("auto");
  const [collapseVisible, setCollapseVisible] = useState(true);
  const wrapper = useRef();
	const { push } = usePixel()

  if (prevCollapsedProp !== collapsedProp) {
    setCollapsed(collapsedProp);
    setPrevCollapsedProp(collapsedProp);
  }

  const calcMaxHeight = () => {
    const wrapperEl = wrapper.current;

    // check if the content is smaller than the passed
    // height to collapse
    if (wrapperEl.scrollHeight > collapseHeight) {
      setMaxHeight(wrapperEl.scrollHeight + 60);
      setCollapseVisible(true);
    } else {
      setCollapseVisible(false);
      setMaxHeight("auto");
    }
  };

  const handleCollapsedChange = (e, newValue) => {
    if (collapsed) {
      push({
        event: 'extendedDescription',
        productCode: productCode,
        productName: productName
      })
    }
    setCollapsed(newValue);
    setPrevCollapsedProp(collapsedProp);

    if (onCollapsedChange) {
      onCollapsedChange(e, newValue);
    }
  };

  const debouncedCalcMaxHeight = debounce(calcMaxHeight, 500);

  useLayoutEffect(() => {
    window.addEventListener("resize", debouncedCalcMaxHeight);
    calcMaxHeight();

    return () => {
      window.removeEventListener("resize", debouncedCalcMaxHeight);
    };
  });

  const height = collapseVisible && collapsed ? collapseHeight : maxHeight;
  const transitionTime = 600;
  const fadeOutTime = 400;

  const pointerEventsNoneClasses = classNames(
    styles.pointerEventsNone,
    { flex: collapseVisible, dn: !collapseVisible },
    "absolute bottom-0 w-100 h-100 flex-column justify-end"
  );

  return (
    <Transition timeout={transitionTime} in={!collapsed}>
      {(state) => (
        <div
          style={{
            ...transitionStyle(transitionTime),
            height,
            overflow: "hidden",
            display: "block",
          }}
          onTransitionEnd={calcMaxHeight}
          className={`${styles.container} relative`}
        >
          <div ref={wrapper} className={`${styles.content} h-auto`}>
            {children}
          </div>
          <div className={pointerEventsNoneClasses}>
            <div
              style={transitionStyle(fadeOutTime)}
              className={fadeBottomClasses(state)}
            />
            <div className={pointerEventsAutoClasses(state)}>
              <button
                onClick={(e) => handleCollapsedChange(e, !collapsed)}
                className={`${styles.showMoreButton} c-action-primary t-action pointer ma5 bn outline-0`}
              >
                {state === "entered" || (collapsed && state !== "exited")
                  ? showLessLabel
                  : showMoreLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </Transition>
  );
}

GradientCollapse.propTypes = {
  /** Maximum height collapsed */
  collapseHeight: PropTypes.number.isRequired,
  collapsed: PropTypes.bool,
  children: PropTypes.node,
  onCollapsedChange: PropTypes.func,
};

GradientCollapse.defaultProps = {
  collapsed: true,
};

export default GradientCollapse;
