import api from "@/Confix/axios";
import { authClient } from "@/lib/auth-client";
import type { Project } from "@/types";
import { DownloadIcon, EyeIcon, EyeOffIcon, Fullscreen, Laptop2Icon, LaptopIcon, Loader2Icon, MessageSquare, SaveIcon, Smartphone, TabletIcon, XIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const Projects = () => {
  const { projectId } = useParams();
  const navigate = useNavigate()

  const { data: session, isPending } = authClient.useSession();

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(true);
  const [device, setDevice] = useState<'desktop' | 'phone' | 'tablet'>("desktop");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  //const previewRef = useRef<null>(null);

  const fetchProject = async () => {
    try {
      const { data } = await api.get(`/api/user/project/${projectId}`);
      // if (setTimeout(() => {
      //   if (project) {
      setProject(data.project);
      setIsGenerating(!data.project.current_code ? true : false);
      setLoading(false);
      //   }
      // }, 2000))

      console.log("data for specific project id", data);
    } catch (error: any) {
      toast.error(error.message);
      console.log(error.message);
    }
  };

  const saveProject = async () => { };

  //download code (index.html)
  const downloadCode = () => {
    // const code = previewRef.current?.getCode() || project?.current_code;
    // if (!code) return;
    // if (isGenerating) return;

    // const element = document.createElement("a");
    // const file = new Blob([code], { type: "text/html" });
    // element.href = URL.createObjectURL(file);
    // element.download = "index.html";
    // document.body.appendChild(element);
    // element.click();
  };

  const togglePublish = async () => { };

  useEffect(() => {
    if (session?.user) fetchProject();
    else if (!isPending && !session?.user) {
      navigate("/");
      toast("/Please login in to view your project");
    }
  }, [projectId, session?.user]);

  useEffect(() => {
    if (project && !project.current_code) {
      const intervalId = setInterval(fetchProject, 100000);
      return () => clearInterval(intervalId);
    }
    //fetchProject();
  }, [project]);

  if (loading) {
    return (
      <>
        <div className="flex items-center justify-center h-screen">
          <Loader2Icon className="size-7 animate-spin text-violet-200 " />
        </div>
      </>
    );
  }

  return project ? (
    <div className="flex  flex-col h-screen w-full bg-gray-900 text-white " >
      {/* builder navbar */}
      <div className=" flex max-sm:flex-col sm:items-center gap-4 px-4 py-2 no-scrollbar " >
        {/* left column */}
        <div className="flex items-center gap-2 sm:min-w-90 text-nowrap ">
          <img src='/favicon.svg' className="h-6 cursor-pointer " onClick={() => navigate("/")} alt="" />
          <div className=" max-w-64 sm:max-w-xs">
            <p className="text-sm text-medium capitalize truncate ">{project.name}</p>
            <p className=" text-xs text-gray-400 -mt-0.5 ">Previewing last saved version</p>
          </div>
          <div className=" sm:hidden flex-1 flex justify-end">
            {isMenuOpen ? <MessageSquare className="size-6 cursor-pointer " onClick={() => setIsMenuOpen(false)} /> :
              <XIcon className="size-6 cursor-pointer " onClick={() => setIsMenuOpen(true)} />}

          </div>
        </div>

        {/* middle */}
        <div className="flex sm:flex gap-2 bg-gray-950 p-1.5 rounded-md " >
          <Smartphone onClick={() => setDevice("phone")}
            className={`size-6 p-1 rounded cursor-pointer ${device === 'phone' ? ' bg-gray-700' : ""} `} />

          <TabletIcon onClick={() => setDevice("tablet")}
            className={`size-6 p-1 rounded cursor-pointer ${device === 'tablet' ? ' bg-gray-700' : ""} `} />

          <LaptopIcon onClick={() => setDevice("desktop")}
            className={`size-6 p-1 rounded cursor-pointer ${device === 'desktop' ? ' bg-gray-700' : ""} `} />
        </div>

        {/* right */}
        <div className="flex items-center justify-end gap-3 flex-1 text-xs ">

          <button disabled={isSaving} className="flex items-center justify-center bg-gray-800 rounded-md px-3 py-1.5 gap-2 " >

            {
              isSaving ?
                <Loader2Icon className="animate-spin" size={16} />
                :
                <SaveIcon size={16} />
            }
            Save
          </button>
          <Link target="_blank" to={`/preview/${projectId}`} className="flex items-center justify-center bg-gray-800 rounded-md px-3 py-1.5 gap-2 " >

            <Fullscreen size={16} />
            Preview</Link>
          <button
            className="flex items-center justify-center bg-gray-800 rounded-md px-3 py-1.5 gap-2 ">
            <DownloadIcon size={16} />
            Download</button>
          <button

            className="flex items-center justify-center bg-gray-800 rounded-md px-3 py-1.5 gap-2 "
          >
            {
              project.isPublished ?
                <EyeOffIcon size={16} />
                : <EyeIcon size={16} />
            }

            {project.isPublished ? "Unpublish" : "Publish"}</button>


        </div>

      </div>
    </div>
  ) :
    (
      <div className="flex items-center justify-center h-screen " >
        <p className="text-2xl font-medium text-gray-200" >Unable to load project!</p>

      </div>
    )
};

export default Projects;
