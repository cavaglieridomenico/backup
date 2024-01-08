import React, {useState} from 'react'
import { ExtensionPoint } from 'vtex.render-runtime' 
import {IconHelp} from 'vtex.styleguide'
import { Modal } from 'vtex.styleguide'
import { useDevice } from 'vtex.device-detector'

interface InfoTooltip {
	isOnLeft: boolean
  isOnTop:boolean
}

const InfoTooltip:StorefrontFunctionComponent<InfoTooltip> = ({isOnLeft, isOnTop}) => {
  const [visible, setVisible] = useState<Boolean>(false);
  const { isMobile } = useDevice()
  const positionLeft = isOnLeft ? '' :'-20%' 
  const positionTop = isOnTop ? '-60%' : '' 
  return (
    <>
    {!isMobile ?
        <div style={{position:'relative', display: 'flex', alignItems: 'center'}} onMouseLeave={()=>setVisible(false)}>
          <span className="c-on-base pointer" onMouseEnter={()=>setVisible(true)} >
            <IconHelp  size={15}/>
          </span>
          <div style={{position:'absolute', width:'max-content',  left:(positionLeft), right:( isOnLeft ? '50%' :''), top:(positionTop), backgroundColor:'#FFF', maxWidth:'350px', zIndex:1,padding:'.5rem', borderRadius:'2px', boxShadow:'0px 0px 16px rgba(35, 31, 32, 0.05)', visibility:(!visible ? 'hidden': 'visible')}}>
            <ExtensionPoint id="rich-text" />
          </div>
        </div> :
        <>
          <span className="c-on-base pointer" onClick={()=>setVisible(true)} style={{width: 'fit-content', display: 'flex', alignItems: 'center'}}>
            <IconHelp  size={15}/>
          </span>
          <Modal isOpen={visible} onClose={()=>setVisible(false)} centered>
            <ExtensionPoint id="rich-text" />
          </Modal>
        </>
      }
      </>
    )
  }

  InfoTooltip.schema = {
    title: 'editor.tooltip.title',
    description: 'editor.tooltip.description',
    type: 'object',
    properties: {
      isOnLeft: {
        title: 'Left',
        description: 'Tooltip should be move on the left of icon',
        default: false,
        type: 'boolean'
      },
      isOnTop: {
        title: 'Top',
        description: 'Tooltip should be move on top of icon',
        default: false,
        type: 'boolean'
      }
    },
  }
export default InfoTooltip
