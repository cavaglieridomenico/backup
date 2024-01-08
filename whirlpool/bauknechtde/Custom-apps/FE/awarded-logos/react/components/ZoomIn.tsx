import React from 'react'
import style from '../style.css'

interface ZoomInProps {
  zoomFactor?: number
}

const ZoomIn: React.FC<ZoomInProps> = ({ children }) => {
  // old approach
  // const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className={style.zoomInContainer}
      // old approach
      // onMouseEnter={() => setIsHovered(true)}
      // onMouseLeave={() => setIsHovered(false)}
    >
      {children}

      {/* old approach
      {isHovered && (
        <div
          className={style.isHovered}
          style={{ transform: `scale(${zoomFactor})` }}
        >
          {children}
        </div>
      )} */}
    </div>
  )
}

export default ZoomIn
