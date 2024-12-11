import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { title, taskId, status, images = [], documents = [], comments, assignees = [] } = req.body;

      // Validate taskId
      const numericTaskId = parseInt(taskId, 10);
      if (isNaN(numericTaskId)) {
        return res.status(400).json({ error: "Invalid taskId" });
      }

      // Validate assignee emails
      const validAssignees = await prisma.user.findMany({
        where: {
          email: { in: assignees },
        },
        select: { id: true },
      });

      if (validAssignees.length !== assignees.length) {
        const invalidEmails = assignees.filter(
          email => !validAssignees.some(user => user.email === email)
        );
        return res.status(400).json({
          error: `The following emails are not valid: ${invalidEmails.join(", ")}`,
        });
      }

      // Create subtask
      const newSubtask = await prisma.subTask.create({
        data: {
          title,
          taskId: numericTaskId,
          status,
          images,
          documents,
          comments,
          assignees: {
            connect: validAssignees.map(assignee => ({ id: assignee.id })),
          },
        },
      });

      res.status(201).json({ subtask: newSubtask });
    } catch (error) {
      console.error("Error creating subtask:", error);
      res.status(500).json({ error: "Error creating subtask" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}