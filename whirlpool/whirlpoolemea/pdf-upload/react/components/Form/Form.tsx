import React, { FC, useEffect, useState } from 'react'
import { Dropzone, Button } from 'vtex.styleguide'
import { FormattedMessage } from 'react-intl'
import { canUseDOM } from 'vtex.render-runtime'

const FormUpload: FC = () => {
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState<any>()
  const [pdfLink, setPdfLink] = useState('')
  const [copiedLink, setCopiedLink] = useState(false)
  const [url, setUrl] = useState('')
  useEffect(() => {
    if (canUseDOM) {
      setUrl(window.location.origin + '/_v/pdfupload')
    }
  }, [])
  const handleDrop = (fileDropped: any) => {
    setFile(fileDropped)
  }
  const handleReset = () => {
    setFile(null)
    setPdfLink('')
    setCopiedLink(false)
  }
  const handleCopy = () => {
    navigator.clipboard.writeText(pdfLink)
    setCopiedLink(true)
  }
  const uploadFile = async (event?: any) => {
    try {
      event.preventDefault()
      setLoading(true)
      const formData = new FormData()
      formData.append('file', file[0])
      formData.append('fileName', file[0].name)
      fetch(url, {
        method: 'POST',
        body: formData,
      })
        .then((response) => response.json())
        .then((response) => {
          setPdfLink(response?.url)
          setLoading(false)
        })
    } catch (error) {
      setLoading(false)
    }
  }

  return (
    <form className="flex flex-column mv3" id="form" onSubmit={uploadFile}>
      <Dropzone
        isLoading={loading}
        onDropAccepted={handleDrop}
        onFileReset={handleReset}
        accept=".pdf"
      >
        <div className="pt7">
          <div>
            <span className="f4">
              <FormattedMessage id="admin.dropzone.text1" />
            </span>
            <span className="f4 c-link" style={{ cursor: 'pointer' }}>
              <FormattedMessage id="admin.dropzone.text2" />
            </span>
            <p className="f6 c-muted-2 tc">
              <FormattedMessage id="admin.dropzone.filesize" />
            </p>
          </div>
        </div>
      </Dropzone>
      {!pdfLink && file && (
        <span className="mv3 tc">
          <Button type="submit">
            <FormattedMessage id="admin.button.send" />
          </Button>
        </span>
      )}
      {pdfLink && (
        <div className="flex flex-column mv3">
          <span className="mb3 tc b">
            <FormattedMessage id="admin.label.success" />
          </span>
          <div className="flex flex-row items-center justify-between mb3">
            <a href={pdfLink} target="blank" className="w-60 truncate">
              {pdfLink}
            </a>
            <Button className="w-30" onClick={handleCopy}>
              {copiedLink ? (
                <FormattedMessage id="admin.button.copied" />
              ) : (
                <FormattedMessage id="admin.button.copy" />
              )}
            </Button>
          </div>
        </div>
      )}
    </form>
  )
}

export default FormUpload
