import React, { useEffect, useState } from "react";
import type { Project } from "../types";
import { Loader2Icon, PlusIcon, TrashIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { dummyProjects } from "../assets/assets";
import api from "@/Confix/axios";
import Footer from "@/Componenets/Footer";

function Community() {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);

  const navigate = useNavigate();

  const fetchProject = async () => {
    //calling to  apis
    try {
      const { data } = await api.get('/api/project/publish')
      setProjects(data.projects)
      console.log("all Projects", data)
    } catch (error) {

    }
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    fetchProject();
  }, []);



  return (
    <>
      <div className="px-4 md:px-16 xl:px-32">
        {loading ? (
          <div className="flex justify-center items-center h-[80vh]">
            <Loader2Icon className=" animate-spin " />
          </div>
        ) : projects.length > 0 ? (
          <div className="min-h-[80vh] py-10">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-medium text-white">Published Projects</h1>

            </div>
            <div className="flex flex-wrap gap-3 mt-20">
              {projects.map((project) => (
                <Link
                  to={`/view/${project.id}`}
                  key={project.id}
                  target="_blank"
                  className="
                  relative group w-72 max-sm:max-auto cursor-pointer bg-gray-900/60
                  border border-b-gray-700 rounded-lg overflow-hidden shadow-md group hover:shadow-indigo-700/30 hover:border-indigo-800/80
                  transition-all duration-300  "
                >

                  <div className="relative w-full h-40 bg-gray-900 overflow-hidden border-b border-gray-800 ">
                    {project.current_code ? (
                      <iframe
                        srcDoc={project.current_code}
                        style={{ transform: "scale(0.25)" }}
                        className=" absolute top-0 left-0 w-[1200px] h-[800px]
                        origin-top-left pointer-events-none "
                        sandbox=" allow-scripts allow-same-origin "
                      />
                    ) : (
                      <div>No Privew Now</div>
                    )}
                  </div>
                  {/*  content  */}
                  <div className="p-4 text-white ng-linear-180 from-transparent group-hover:from-indigo-950 to-transparent transition-colors ">
                    <div className="flex items-center justify-between">
                      <h3 className=" text-lg font-medium line-clamp-2 ">
                        {project.name}
                      </h3>
                      <button className="text-sm border mt-1 ml-2  border-gray-700 text-gray-300 py-0 px-2.5  rounded-full bg-gray-800">
                        website
                      </button>
                    </div>
                    <p className="text-gray-400  ">{project.initial_prompt}</p>
                    <div
                      className="flex items-center justify-between bottom-0 
                    mt-6 "
                    >
                      <span className=" text-sm text-gray-500">
                        {new Date(project.createdAt).toLocaleDateString()}
                      </span>
                      <div className="flex gap-3  ">
                        <button
                          className="px-3 py-1.5 bg-white/10 hover:bg-white/15 rounded-md text-xs 
                          transition-colors flex items-center gap-2 "
                        >
                          <span className=" bg-gray-200 size-4.5 rounded-full text-black font-semibold flex
                          items-center justify-center ">
                            {project.user?.name?.slice(0, 1)}
                          </span>
                          {project.user?.name}
                        </button>
                      </div>

                    </div>
                  </div>

                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center h-[80vh]">
            <h1 className="text-3xl font-semibold text-gray-300">
              You have no project yet!{" "}
            </h1>
            <button
              className="flex mt-5  items-center justify-center gap-2 boarder text-sm bg-indigo-700 hover:bg-indigo-500 
              px-3 py-1.5 rounded transition-all active:scale-95 "
              onClick={() => navigate("/")}
            >
              <PlusIcon /> Create New
            </button>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default Community;
