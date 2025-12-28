import api from "@/Confix/axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Priview = () => {
  const { projectId } = useParams();
  const [code, setCode] = useState("");
  const getPriver = async () => {
    try {
      const { data } = await api.get(`/api/project/preview/${projectId}`);
      setCode(data.current_code);
      console.log("get provire by", data);
    } catch (error) { }
  };

  useEffect(() => {
    if (!projectId) return;
    getPriver();
  }, []);
  return <div>Priview</div>;
};

export default Priview;
