import { Request, Response } from "express";
import prisma from "../lib/prisma.js";
import openai from "../Config/OpenAi.js";

// get user Credits
export const userCredist = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    res.json({ credits: user?.credits });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};

//controller function for create a new Project
export const createUserProject = async (req: Request, res: Response) => {
  const userId = req.userId;
  try {
    const { initial_prompt } = req.body;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (user && user.credits < 5) {
      return res
        .status(403)
        .json({ message: "add credits to create more project" });
    }
    //creating project in db
    const project = await prisma.websiteProject.create({
      data: {
        name:
          initial_prompt.length > 50
            ? initial_prompt.substring(0, 47) + "..."
            : initial_prompt,
        userId,
        initial_prompt,
      },
    });

    //update user total creation
    await prisma.user.update({
      where: { id: userId },
      data: { totalCreation: { increment: 1 } },
    });

    //creating converstion
    await prisma.conversation.create({
      data: {
        role: "user",
        content: initial_prompt,
        projectId: project.id,
      },
    });

    //update user credits means reduce by 5
    await prisma.user.update({
      where: { id: userId },
      data: { credits: { decrement: 5 } },
    });

    res.json({ projectId: project.id });

    //enhanve user prompt
    const promotEnhanceResponse = await openai.chat.completions.create({
      model: "z-ai/glm-4.5-air:free",
      messages: [
        {
          role: "system",
          content: `
        You are a prompt enhancement specialist.Take the user's website request and expand it intp a detailed,
        comprehensice prompt that will help create the best possible website.
        Enhance this prompt by:
        1.Adding specific design details (layout , color scheme,typography)
        2.Specifying key sections and features
        3.Describing the user experience and interactins
        4.Including modern web design best practices
        5.Mentioning responsive design requirements
        6.Adding andy missing but important elements
        `,
        },
        {
          role: "user",
          content: initial_prompt,
        },
      ],
    });

    const enhancePrompt = promotEnhanceResponse.choices[0].message.content;
    await prisma.conversation.create({
      data: {
        role: "assistant",
        content: `I've enhance your prompt to : "${enhancePrompt}"`,
        projectId: project.id,
      },
    });

    await prisma.conversation.create({
      data: {
        role: "assistant",
        content: `now generating your website.. `,
        projectId: project.id,
      },
    });

    //generate website code
    const codeGenerationResponse = await openai.chat.completions.create({
      model: "z-ai/glm-4.5-air:free",
      messages: [
        {
          role: "system",
          content: `You are an expert web developer. Create a compete. production-ready, single-page website base on this request :${enhancePrompt}
        
        CRITICAL REQUIREMENTS:
        -you must output valid html only
        -Use Tailwind CSS for ALL styling
        -Include this EXACT script in the <head>:<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
        -Use Tailwind utility classes extensilvy for styling , animations, and responsiveness
        -Make it fully functional and interactive with Javasceript in <script>tag before closing </body>
        `,
        },
        {
          role: "user",
          content: enhancePrompt || "",
        },
      ],
    });

    const code = codeGenerationResponse.choices[0].message.content || "";

    //create version for the project
    const version = await prisma.version.create({
      data: {
        code: code
          .replace(/```[a-z]*\n?/gi, "")
          .replace(/```$/g, "")
          .trim(),
        description: "Initial version",
        projectId: project.id,
      },
    });

    await prisma.conversation.create({
      data: {
        role: "assistant",
        content:
          "I have created your website! You can now preview it and request and changes",
        projectId: project.id,
      },
    });

    await prisma.websiteProject.update({
      where: { id: project.id },
      data: {
        current_code: code
          .replace(/```[a-z]*\n?/gi, "")
          .replace(/```$/g, "")
          .trim(),
        current_version_index: version.id,
      },
    });
  } catch (error: any) {
    await prisma.user.update({
      where: { id: userId },
      data: { credits: { increment: 5 } },
    });
    console.log(error);
    res.status(500).json({ message: error });
  }
};

//controller function to get single user Project
export const getUserProject = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { projectId } = req.params;

    const project = await prisma.websiteProject.findUnique({
      where: { id: projectId, userId },
      include: {
        conversation: {
          orderBy: { timestamp: "asc" },
        },
        versions: { orderBy: { timestamp: "asc" } },
      },
    });

    res.json({ project });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};

//controller function to get  all  user Project
export const getUserProjects = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const projects = await prisma.websiteProject.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
    });

    res.json({ projects });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};

//controller function to Toggle Project publish
export const togglePublish = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { projectId } = req.params;

    const project = await prisma.websiteProject.findUnique({
      where: { id: projectId, userId },
    });
    if (!project)
      return res.status(401).json({ message: "this type project not exist" });

    await prisma.websiteProject.update({
      where: { id: projectId, userId },
      data: { isPublished: !project.isPublished },
    });

    res.json({
      project,
      message: project.isPublished ? "publish Poject " : "Project Unpublish",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};

//controller function to Purchess credits
export const purchessCredits = async (req: Request, res: Response) => {
  try {
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};
