
import React, { useEffect, useState } from 'react'

interface EditorPanelProps {
    selectedElement: {
        tagName: String;
        className: String,
        text: String,
        styles: {
            padding: string,
            margin: string,
            backgroundColor: string,
            color: string,
            fintSize: string,
        }
    } | null,
    onUpdate: (updates: any) => void,
    onClose: () => void
}


const EditorPanel = ({ selectedElement, onUpdate, onClose }: EditorPanelProps) => {
    const [values, setValues] = useState(selectedElement)
    useEffect(() => {
        setValues(selectedElement)
    }, [selectedElement])

    if (!selectedElement || !values)
        return null


    return (
        <div className='absolute top-4 right-4 w-80 bg-white rounded-lg shadow' >

        </div>
    )
}

export default EditorPanel
