import React from 'react';
import { useRef, useEffect } from 'react';
import { canUseDOM } from 'vtex.render-runtime';

function FuncCloseMenuMouseoutCooling(ref) {
    if (canUseDOM) {
        useEffect(() => {
            const menu = document.getElementsByClassName("vtex-menu-2-x-submenu--menu")[2];
            function handleCloseMenu(event) {
                if (ref.current && !ref.current.contains(event.target)) {
                    const outerMenu = document.getElementsByClassName("vtex-menu-2-x-submenuWrapper--menu")[2];
                    outerMenu.classList.remove("vtex-menu-2-x-submenuWrapper--isOpen");
                    outerMenu.classList.remove("vtex-menu-2-x-submenuWrapper--menu--isOpen");
                    outerMenu.classList.add("vtex-menu-2-x-submenuWrapper--isClosed");
                    outerMenu.classList.add("vtex-menu-2-x-submenuWrapper--menu--isClosed");
                    document.querySelector(".styledLinkContent--linkMenu--lastHover").style.color = "#43525a";
                    document.querySelector(".styledLinkContent--linkMenu--lastHover").classList.remove("styledLinkContent--linkMenu--lastHover");
                }
            }
            menu.addEventListener("mouseleave", handleCloseMenu);
            return () => {
                menu.removeEventListener("mouseleave", handleCloseMenu);
            };
        }, [ref]);
    }
}

export default function CloseMenuMouseoutCooling(props) {
    const wrapperRef = useRef(null);
    FuncCloseMenuMouseoutCooling(wrapperRef);

    return <div ref={wrapperRef}>{props.children}</div>
}