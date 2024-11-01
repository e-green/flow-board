// pages/api/task/delete-subtask.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "DELETE") {
    const { id } = req.body; // Get the ID of the subtask to delete

    if (!id) {
      return res.status(400).json({ error: "Subtask ID is required." });
    }

    try {
      // Delete the subtask using Prisma
      const deletedSubTask = await prisma.subTask.delete({
        where: { id: Number(id) },
      });

      // Return the deleted subtask details
      return res.status(200).json(deletedSubTask);
    } catch (error) {
      console.error("Error deleting subtask:", error);
      return res.status(500).json({ error: "Failed to delete subtask." });
    }
  } else {
    // Method Not Allowed
    res.setHeader("Allow", ["DELETE"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
