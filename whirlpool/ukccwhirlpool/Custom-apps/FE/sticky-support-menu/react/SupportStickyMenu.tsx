import React, {useEffect} from 'react'

interface SupportStickyMenuProps {}

const SupportStickyMenu: StorefrontFunctionComponent<SupportStickyMenuProps> = ({}) => {
  useEffect(() => {
    function isInViewport(element:HTMLElement) {
      const rect = element.getBoundingClientRect();
      return (
          rect.top >= -3000 &&
          // rect.left >= 0 &&
          rect.bottom - 250 <= (window.innerHeight || document.documentElement.clientHeight)
          // rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      );
  }
      const sliderMenuSticky = document.querySelector('.vtex-slider-layout-0-x-sliderTrackContainer--carouselStuck') as HTMLElement;
      const sliderMenu = document.querySelector('.vtex-slider-layout-0-x-sliderTrackContainer--carouselSlider') as HTMLElement;
          document.addEventListener("scroll", () => {
            // const top = sliderMenu.getBoundingClientRect().top as number;
            if (isInViewport(sliderMenu)){
        
          sliderMenuSticky.style.display = 'none';
            }else{
              sliderMenuSticky.style.display = 'unset';
            }
          });
  },[])

  return <div />
}

SupportStickyMenu.schema = {
  title: 'editor.supportStickyMenu.title',
  description: 'editor.supportStickyMenu.description',
  type: 'object',
  properties: {},
}

export default SupportStickyMenu
