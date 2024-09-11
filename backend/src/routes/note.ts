import express from "express";

import {
  addNote,
  deleteNote,
  editNote,
  getNotes,
  searchNotes,
  updateNotePinned,
} from "../controllers/note";
import { verifyToken } from "../middleware/verify-token";

const router = express.Router();

router.get("/get-notes", verifyToken, getNotes);

router.post("/add-note", verifyToken, addNote);

router.put("/edit-note/:noteId", verifyToken, editNote);

router.put("/update-note-pinned/:noteId", verifyToken, updateNotePinned);

router.delete("/delete-note/:noteId", verifyToken, deleteNote);

router.get("/search-notes", verifyToken, searchNotes);

export default router;
