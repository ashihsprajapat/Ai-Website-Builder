import { iframeScript } from "@/assets/assets";
import type { Project } from "@/types"
import { Loader2Icon } from "lucide-react";
import { forwardRef, useRef } from "react"

export interface ProjectPreviewRef {
    getCode: () => string | undefined;

}
export interface ProjectPreviewProops {
    project: Project,
    isGenerating: boolean,
    device: "desktop" | "phone" | "tablet";
    showEditorPanel?: boolean

}

const ProjectPreview = forwardRef<ProjectPreviewRef, ProjectPreviewProops>(({ project, isGenerating, device = "desktop", showEditorPanel = true }, ref) => {

    const iframeRef = useRef<HTMLIFrameElement>(null)

    const injectPreview = (html: string) => {
        if (!html)
            return ""
        if (!showEditorPanel)
            return html
        if (html.includes('</body>')) {
            return html.replace('</body>', iframeScript + '</body>')
        } else {
            return html + iframeScript
        }
    }

    const resolutions = {
        phone: ' w-[412px] ',
        tablet: 'w-[768px]',
        desktop:'w-full'
    }


    return (
        <div className={`relative h-full bg-gray-900 flex-1 rounded-xl overflow-hidden max-sm:ml-2 `}>
            {
                project.current_code ? (
                    <>
                        <iframe src="" ref={iframeRef} srcDoc={injectPreview(project.current_code)}
                            className={`h-full max-sm:w-full ${resolutions[device]  } mx-auto transition-all `}
                        />
                    </>
                ) : (
                    isGenerating && (
                        <div>
                            Loading....
                        </div>
                    )
                )
            }

        </div>
    )
})


export default ProjectPreview
