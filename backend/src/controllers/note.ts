import type { Request, Response } from "express";

import { db } from "../lib/db";

export const addNote = async (req: Request, res: Response) => {
  try {
    const { title, content, tags } = req.body;

    if (!title || !content) {
      return res
        .status(400)
        .send("All fields (title and content) are required.");
    }

    const note = await db.note.create({
      data: {
        title,
        content,
        tags: tags || [],
        userId: (req as Request & { userId: string }).userId,
      },
    });

    return res.status(200).json({ ...note });
  } catch (error) {
    console.error(error);

    return res
      .status(500)
      .send("An error occurred while processing your request.");
  }
};

export const editNote = async (req: Request, res: Response) => {
  try {
    const { title, content, tags } = req.body;
    const { noteId } = req.params;

    if (!title && !content && !tags) {
      return res.status(400).send("No changes provided.");
    }

    const existingNote = await db.note.findUnique({
      where: {
        id: noteId,
        userId: (req as Request & { userId: string }).userId,
      },
    });

    if (!existingNote) {
      return res.status(404).send("Note not found.");
    }

    const data: {
      title?: string;
      content?: string;
      tags?: string[];
      isPinned?: boolean;
    } = {};

    if (title) data.title = title;
    if (content) data.content = content;
    if (tags) data.tags = tags;

    const note = await db.note.update({
      where: {
        id: existingNote.id,
        userId: (req as Request & { userId: string }).userId,
      },
      data,
    });

    return res.status(200).json({ ...note });
  } catch (error) {
    console.error(error);

    return res
      .status(500)
      .send("An error occurred while processing your request.");
  }
};

export const getNotes = async (req: Request, res: Response) => {
  try {
    const notes = await db.note.findMany({
      where: {
        userId: (req as Request & { userId: string }).userId,
      },
      orderBy: {
        isPinned: "desc",
      },
    });

    return res.status(200).json(notes);
  } catch (error) {
    console.error(error);

    return res
      .status(500)
      .send("An error occurred while processing your request.");
  }
};

export const deleteNote = async (req: Request, res: Response) => {
  try {
    const { noteId } = req.params;

    const existingNote = await db.note.findUnique({
      where: {
        id: noteId,
        userId: (req as Request & { userId: string }).userId,
      },
    });

    if (!existingNote) {
      return res.status(400).send("Note not found.");
    }

    await db.note.delete({
      where: {
        id: existingNote.id,
        userId: (req as Request & { userId: string }).userId,
      },
    });

    return res.status(200).send("Note deleted successfully.");
  } catch (error) {
    console.error(error);

    return res
      .status(500)
      .send("An error occurred while processing your request.");
  }
};

export const updateNotePinned = async (req: Request, res: Response) => {
  try {
    const { isPinned } = req.body;
    const { noteId } = req.params;

    const existingNote = await db.note.findUnique({
      where: {
        id: noteId,
        userId: (req as Request & { userId: string }).userId,
      },
    });

    if (!existingNote) {
      return res.status(400).send("Note not found.");
    }

    const data: { isPinned?: boolean } = {};

    data.isPinned = isPinned;

    const note = await db.note.update({
      where: {
        id: existingNote.id,
        userId: (req as Request & { userId: string }).userId,
      },
      data,
    });

    return res.status(200).json({ ...note });
  } catch (error) {
    console.error(error);

    return res
      .status(500)
      .send("An error occurred while processing your request.");
  }
};

export const searchNotes = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).send("Search query is required.");
    }

    const notes = await db.note.findMany({
      where: {
        userId: (req as Request & { userId: string }).userId,
        OR: [
          { title: { contains: query as string, mode: "insensitive" } },
          { content: { contains: query as string, mode: "insensitive" } },
        ],
      },
    });

    return res.status(200).json(notes);
  } catch (error) {
    console.error(error);

    return res
      .status(500)
      .send("An error occurred while processing your request.");
  }
};
