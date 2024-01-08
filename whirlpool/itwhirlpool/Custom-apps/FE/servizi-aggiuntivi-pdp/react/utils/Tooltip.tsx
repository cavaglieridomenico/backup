import React, {useState} from 'react'
import {IconInfo} from 'vtex.styleguide'
import { Modal } from 'vtex.styleguide'
import { useDevice } from 'vtex.device-detector'

interface InfoTooltip {
	isOnLeft: boolean,
	description:string,
  isOnTop:boolean,
}

const InfoTooltip:StorefrontFunctionComponent<InfoTooltip> = ({isOnLeft, isOnTop, description}) => {
  const [visible, setVisible] = useState<Boolean>(false);
  const { isMobile } = useDevice()
  const positionLeft = isOnLeft ? '' :'-20%'
  const positionTop = isOnTop ? '-60%' : ''
  return (
    <>
    {!isMobile ?
        <div style={{position:'relative'}} onMouseLeave={()=>setVisible(false)}>
          <span className="c-on-base pointer" style={{display:'flex', alignContent:'center'}} onMouseEnter={()=>setVisible(true)} >
            <IconInfo  size={15}/>
          </span>
          <div style={{position:'absolute', width:'max-content',  left:(positionLeft), right:( isOnLeft ? '50%' :''), top:(positionTop), backgroundColor:'#FFF', maxWidth:'350px', zIndex:1,padding:'.5rem', borderRadius:'2px', boxShadow:'0px 0px 16px rgba(35, 31, 32, 0.05)', visibility:(!visible ? 'hidden': 'visible')}}>
            <p style={{fontSize:'1rem', color:'#353535'}}>{description}</p>
          </div>
        </div> :
        <>
          <span className="c-on-base pointer" style={{display:'flex', alignContent:'center'}}  onClick={()=>setVisible(true)}>
            <IconInfo  size={15}/>
          </span>
          <Modal isOpen={visible} onClose={()=>setVisible(false)} centered>
							<p style={{fontSize:'1rem',  color:'#353535'}}>{description}</p>
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
        description: 'isTooltip should be move on the left of icon',
        default: false,
        type: 'boolean',
      },
      isOnTop: {
        title: 'Top',
        description: 'isTooltip should be move on top of icon',
        default: false,
        type: 'boolean',
      },
    },
  }
export default InfoTooltip
