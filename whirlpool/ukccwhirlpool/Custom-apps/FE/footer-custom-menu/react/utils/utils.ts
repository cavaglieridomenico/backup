interface WindowOptanon extends Window {
  Optanon: any;
}

let optanon = ((window as unknown) as WindowOptanon).Optanon;

export const handleClick = (
  push: any,
  isOneTrustLink: boolean,
  isExternalLink: boolean,
  itemLink: string,
  analyticsDatas: any
) => {
  if (isOneTrustLink) {
    optanon.ToggleInfoDisplay();
  }
  if (isExternalLink) {
    push({
      event: "outbound",
      url: window.location.origin + itemLink,
    });
  }
  push({ event: "menu_footer_click", ...analyticsDatas });
};
