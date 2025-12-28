import { Request, Response } from "express";
import prisma from "../lib/prisma.js";
import openai from "../Config/OpenAi.js";

// controller function to make revison
export const makeRevision = async (req: Request, res: Response) => {
  const userId = req.userId;
  try {
    const { projectId } = req.params;
    const { message } = req.body;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!userId || !user)
      return res.status(401).json({ message: "Unauthorized" });

    if (user.credits < 5)
      return res.status(403).json({ message: "Credits are not enough" });

    if (!message || message.trim() === "")
      return res.status(400).json({ message: "Please enter a valid prompt" });

    const currProject = await prisma.websiteProject.findUnique({
      where: { id: projectId, userId },
      include: {
        versions: true,
      },
    });

    if (!currProject)
      return res.status(404).json({ message: "Project not found" });

    await prisma.conversation.create({
      data: { role: "user", content: message, projectId },
    });

    await prisma.user.update({
      where: { id: userId },
      data: { credits: { decrement: 5 } },
    });

    //enhance user prompt
    const promptEnhaceResponse = await openai.chat.completions.create({
      model: "kwaipilot/kat-coder-pro:free",
      messages: [
        {
          role: "system",
          content: ` You are a prompt enhancement  specialist. The user wants to make chages to their website.Enhance their request to be more specific and actionable for a web developer.
        
        Enhance this by:
        1. Being specific about what elements to chage
        2. Mentioning design details (colors, spacing,sizes)
        3. Clarifying the desired outcome
        4.Using clear teachnical terms
        
        Return ON;Y the enhanced request, nothing else.Kwwp it concise(1-2 sentences).`,
        },
        {
          role: "user",
          content: `
            User a request:"${message}"
            `,
        },
      ],
    });

    const enhancedPrompt = promptEnhaceResponse.choices[0].message.content;

    await prisma.conversation.create({
      data: {
        role: "assistant",
        content: `
            I have enhanced your prompt to : "${enhancedPrompt}"
        `,
        projectId,
      },
    });
    await prisma.conversation.create({
      data: {
        role: "assistant",
        content: `
           Now making change to your website ... 
        `,
        projectId,
      },
    });

    //generate website code
    const codeGenerationResponse = await openai.chat.completions.create({
      model: "kwaipilot/kat-coder-pro:free",
      messages: [
        {
          role: "system",
          content: `
        You are an expert web developer.

        CRITICAL REQUIREMENTS:
        - return ONLY the complete updated HTML code with the requested changes.
        - User Tailwind CSS for ALL styling (NO custom CSS).
        - User Tailwind utlity classes for all styling changes.
        -Include all Javascript in <script>tage befir closing </body>
        - Make sure it's a complete, standalone HTML document with Tailwind CSS
        - Return HTML Code Only , nothing else

        Apply the requested changes while maintaining the Tailwind CSS
        Styling approach.
        `,
        },
        {
          role: "user",
          content: `Here is the current website code : "${currProject.current_code}" The user wants this changes : "${enhancedPrompt}" `,
        },
      ],
    });

    const code = codeGenerationResponse.choices[0].message.content || "";

    if (!code) {
      await prisma.conversation.create({
        data: {
          role: "assistant",
          content: "Unable to generate the code, please try again",
          projectId,
        },
      });
      await prisma.user.update({
        where: { id: userId },
        data: { credits: { increment: 5 } },
      });
      return;
    }

    const version = await prisma.version.create({
      data: {
        code: code
          .replace(/```[a-z]*\n?/gi, "")
          .replace(/```$/g, "")
          .trim(),
        description: "changes made",
        projectId,
      },
    });

    await prisma.conversation.create({
      data: {
        role: "assistant",
        content:
          "I've made the changes to your website! You can now preview it",
        projectId,
      },
    });

    await prisma.websiteProject.update({
      where: { id: projectId, userId },
      data: {
        current_code: code
          .replace(/```[a-z]*\n?/gi, "")
          .replace(/```$/g, "")
          .trim(),

        current_version_index: version.id,
      },
    });

    res.json({ message: "changes made successfully" });
  } catch (error: any) {
    await prisma.user.update({
      where: { id: userId },
      data: { credits: { increment: 5 } },
    });
    console.log(error.code || error.message);
    res.status(500).json({ message: error.message });
  }
};

//controller function to rollback to specific version
export const rollbackToVersion = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { projectId, versionId } = req.params;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!userId || !user)
      return res.status(401).json({ message: "Unauthorized" });

    const project = await prisma.websiteProject.findUnique({
      where: { id: projectId, userId },
      include: {
        versions: true,
      },
    });

    if (!project) return res.status(404).json({ message: "Project not found" });

    const versio = project.versions.find((version) => version.id == versionId);

    if (!versio) {
      return res.status(404).json({ message: "Version not found" });
    }

    await prisma.websiteProject.update({
      where: { id: projectId, userId },
      data: { current_code: versio.code, current_version_index: versio.id },
    });

    await prisma.conversation.create({
      data: {
        role: "assistant",
        content: `I;ve rolled back your website to selected version . You can now preview it`,
        projectId,
      },
    });

    res.json({ message: "version rolled back" });
  } catch (error: any) {
    console.log(error.code || error.message);
    res.status(500).json({ message: error.message });
  }
};

//controller function to rollback to specific version
export const deleteProject = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { projectId } = req.params;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!userId || !user)
      return res.status(401).json({ message: "Unauthorized" });

    const project = await prisma.websiteProject.delete({
      where: { id: projectId, userId },
    });

    res.json({ message: "Project delete successfully" });
  } catch (error: any) {
    console.log(error.code || error.message);
    res.status(500).json({ message: error.message });
  }
};

//controller for gettting  project code for preview
export const getProjectPreview = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { projectId } = req.params;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const project = await prisma.websiteProject.findFirst({
      where: { id: projectId, userId },
      include: { versions: true },
    });

    if (!project) return res.status(404).json({ message: "Project not found" });

    res.json({ project });
  } catch (error: any) {
    console.log(error.code || error.message);
    res.status(500).json({ message: error.message });
  }
};

//controller for get all publish project
export const getPublisProject = async (req: Request, res: Response) => {
  try {
    const projects = await prisma.websiteProject.findMany({
      where: { isPublished: true },
      include: { user: true },
    }
    );
    res.json({ projects });
  } catch (error: any) {
    console.log(error.code || error.message);
    res.status(500).json({ message: error.message });
  }
};

//controller for get all  project by id
export const getProjectById = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.body;
    const project = await prisma.websiteProject.findFirst({
      where: { id: projectId },
    });

    if (!project || project.isPublished === false || !project?.current_code)
      return res.status(404).json({ message: "project not found" });

    res.json({ code: project.current_code });
  } catch (error: any) {
    console.log(error.code || error.message);
    res.status(500).json({ message: error.message });
  }
};

//controller for save  project code
export const saveProjectCode = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { projectId } = req.body;
    const { code } = req.body;

    if (!userId) return res.status(404).json({ message: "unathorized" });

    if (!code) return res.status(400).json({ message: "Code is required" });

    const project = await prisma.websiteProject.findUnique({
      where: { id: projectId, userId },
    });

    if (!project) return res.status(404).json({ message: "project not found" });

    await prisma.websiteProject.update({
      where: { id: projectId, userId },
      data: { current_code: code, current_version_index: "" },
    });

    res.json({ message: "Project saved successfully" });
  } catch (error: any) {
    console.log(error.code || error.message);
    res.status(500).json({ message: error.message });
  }
};
