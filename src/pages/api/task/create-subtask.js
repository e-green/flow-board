import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { title, taskId, parentId, description, status, images, documents } =
      req.body;

    // Parse and validate taskId
    const taskIdInt = parseInt(taskId);
    if (isNaN(taskIdInt)) {
      return res.status(400).json({ error: "Invalid taskId" });
    }

    console.log('Request body:', req.body);

    try {
      const subtask = await prisma.subTask.create({
        data: {
          title,
          description: description || null,
          status: status || "Not Started", // Default to "Not Started"
          images: images || [], // Empty array if no images
          documents: documents || [], // Empty array if no documents
          taskId: taskIdInt, // Use the parsed taskId
          parentId: parentId ? parseInt(parentId) : null,
        },
      });
      res.status(200).json(subtask);
    } catch (error) {
      console.log('Request body:', req.body);
      console.error("Error creating subtask:", error);
      
      res.status(500).json({ error: "Error creating subtask" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} not allowed`);
  }
}
