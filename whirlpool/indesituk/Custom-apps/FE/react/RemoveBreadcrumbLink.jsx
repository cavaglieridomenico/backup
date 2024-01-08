import React from "react";
import { canUseDOM } from 'vtex.render-runtime'

export default function RemoveBreadcrumbLink() {

    if (canUseDOM) {
        var LinkArray = document.querySelectorAll('.vtex-breadcrumb-1-x-link')
        LinkArray.forEach(element => {
            let href = element.getAttribute("href");
            href = href.substring(0, href.length -2);
            element.setAttribute("href", href)
        });
    }

    return (
        <>
        </>
    )
}