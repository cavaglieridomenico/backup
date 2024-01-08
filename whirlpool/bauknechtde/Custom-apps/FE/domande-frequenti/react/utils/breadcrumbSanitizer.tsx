const breadcrumbSanitizer = (s: any) => {
    var r = s?.toLowerCase();

    if (r == "q&a online kauf") {
        r = "online-kauf"
    } else {
        r = r?.replace(new RegExp(/[ü]/g), "ue"); ////
        r = r?.replace(new RegExp(/[ä]/g), "ae"); ////
        r = r?.replace(new RegExp(/[ö]/g), "oe"); ////
    }

    return r;
};
export default breadcrumbSanitizer