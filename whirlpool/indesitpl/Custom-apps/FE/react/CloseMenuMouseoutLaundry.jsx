import React from 'react';
import { useRef, useEffect } from 'react';
import { canUseDOM } from 'vtex.render-runtime';

function FuncCloseMenuMouseoutLaundry(ref) {
    if (canUseDOM) {
        document.addEventListener("mouseout", e => {
            let cursorPosition = document.elementFromPoint(e.clientX, e.clientY);
            /*if (cursorPosition.classList.contains("vtex-menu-2-x-styledLinkContent--label-header-item") && cursorPosition.parentElement.nodeName == "SPAN") {
                document.querySelectorAll(".vtex-menu-2-x-menuItem--label-header-item").forEach(function(element) {
                    if (!(element.classList.contains("styledLinkContent--linkMenu--lastHover")) && document.querySelectorAll(".styledLinkContent--linkMenu--lastHover").length < 1) {
                        if (element.classList.contains("vtex-menu-2-x-menuItem--label-header-item--isOpen")) {
                            element.childNodes[0].childNodes[0].childNodes[0].style.color = "#f5f5f5";
                        }
                    } else if (!(element.classList.contains("styledLinkContent--linkMenu--lastHover")) && document.querySelectorAll(".styledLinkContent--linkMenu--lastHover").length >= 1) {
                        element.classList.add("styledLinkContent--linkMenu--lastHover--active");
                        element.classList.add("styledLinkContent--linkMenu--lastHover");
                        element.childNodes[0].childNodes[0].childNodes[0].style.color = "#f5f5f5";
                        document.querySelectorAll(".styledLinkContent--linkMenu--lastHover").forEach(function(elementx) {
                            if (!elementx.classList.contains("styledLinkContent--linkMenu--lastHover--active")) {
                                elementx.classList.remove("styledLinkContent--linkMenu--lastHover");
                                elementx.style.color = "#43525a";
                            }
                        })
                        document.querySelector(".styledLinkContent--linkMenu--lastHover--active").classList.remove("styledLinkContent--linkMenu--lastHover--active");
                    }
                })
            }*/
            if (cursorPosition.classList.contains("vtex-menu-2-x-styledLinkContent--label-header-item") && cursorPosition.parentElement.nodeName == "SPAN") {
                if (!(cursorPosition.classList.contains("styledLinkContent--linkMenu--lastHover")) && document.querySelectorAll(".styledLinkContent--linkMenu--lastHover").length < 1) {
                    cursorPosition.style.color = "#005c92";
                    cursorPosition.classList.add("styledLinkContent--linkMenu--lastHover");
                } else if (!(cursorPosition.classList.contains("styledLinkContent--linkMenu--lastHover")) && document.querySelectorAll(".styledLinkContent--linkMenu--lastHover").length >= 1) {
                    cursorPosition.classList.add("styledLinkContent--linkMenu--lastHover--active");
                    cursorPosition.classList.add("styledLinkContent--linkMenu--lastHover");
                    cursorPosition.style.color = "#005c92";
                    document.querySelectorAll(".styledLinkContent--linkMenu--lastHover").forEach(function(element) {
                        if (!element.classList.contains("styledLinkContent--linkMenu--lastHover--active")) {
                            element.classList.remove("styledLinkContent--linkMenu--lastHover");
                            element.style.color = "#43525a";
                        }
                    })
                    document.querySelector(".styledLinkContent--linkMenu--lastHover--active").classList.remove("styledLinkContent--linkMenu--lastHover--active");
                }
            } else if ((cursorPosition.classList.contains("vtex-menu-2-x-styledLinkContent--label-header-item") && cursorPosition.parentElement.nodeName == "A") || (cursorPosition.classList.contains("vtex-menu-2-x-menuItem--label-header-item")) || (cursorPosition.classList.contains("vtex-modal-layout-0-x-triggerContainer"))) {
                document.querySelectorAll(".styledLinkContent--linkMenu--lastHover").forEach(function(element) {
                    if (!(element.parentElement.nodeName == "A")) {
                        element.classList.remove("styledLinkContent--linkMenu--lastHover");
                        element.style.color = "#43525a";
                    }
                })
            }
        })
        /**/
        useEffect(() => {
            const menu = document.getElementsByClassName("vtex-menu-2-x-submenu--menu")[0];
            function handleCloseMenu(event) {
                if (ref.current && !ref.current.contains(event.target)) {
                    const outerMenu = document.getElementsByClassName("vtex-menu-2-x-submenuWrapper--menu")[0];
                    outerMenu.classList.remove("vtex-menu-2-x-submenuWrapper--isOpen");
                    outerMenu.classList.remove("vtex-menu-2-x-submenuWrapper--menu--isOpen");
                    outerMenu.classList.add("vtex-menu-2-x-submenuWrapper--isClosed");
                    outerMenu.classList.add("vtex-menu-2-x-submenuWrapper--menu--isClosed");
                }
            }
            menu.addEventListener("mouseleave", handleCloseMenu);
            return () => {
                menu.removeEventListener("mouseleave", handleCloseMenu);
            };
        }, [ref]);
    }
}

export default function CloseMenuMouseoutLaundry(props) {
    const wrapperRef = useRef(null);
    FuncCloseMenuMouseoutLaundry(wrapperRef);

    return <div ref={wrapperRef}>{props.children}</div>
}