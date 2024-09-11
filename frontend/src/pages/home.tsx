import { FilePlus2, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Card } from "../components/card";
import { Dialog } from "../components/dialog";
import { Navbar } from "../components/navbar";
import { apiRequest } from "../lib/request";
import { Note } from "../types";

export const Home = () => {
  const [openModal, setOpenModal] = useState<{
    isShown: boolean;
    type: "add" | "edit";
    data: Note | null;
  }>({
    isShown: false,
    type: "add",
    data: null,
  });
  const [notes, setNotes] = useState<Note[] | null>(null);

  const navigate = useNavigate();

  const handleDelete = async (noteId: string) => {
    await apiRequest("DELETE", `/notes/delete-note/${noteId}`);

    navigate(0);
  };

  const handlePin = async (noteId: string, isPinned: boolean) => {
    await apiRequest("PUT", `/notes/update-note-pinned/${noteId}`, {
      isPinned: !isPinned,
    });

    navigate(0);
  };

  const handleSearch = async (query: string) => {
    const response = await apiRequest(
      "GET",
      `/notes/search-notes?query=${query}`
    );

    if (response.success && response.data) {
      setNotes(response.data as Note[]);
    }
  };

  const handleClearSearch = async () => {
    const response = await apiRequest("GET", "/notes/get-notes");

    if (response.success && response.data) {
      setNotes(response.data as Note[]);
    }
  };

  useEffect(() => {
    (async () => {
      const response = await apiRequest("GET", "/notes/get-notes");

      if (response.success && response.data) {
        setNotes(response.data as Note[]);
      }
    })();
  }, []);

  return (
    <>
      <Navbar onSearch={handleSearch} onClearSearch={handleClearSearch} />
      <div className="container mx-auto">
        {!notes ? (
          <div className="grid grid-cols-3 gap-4 mt-8">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="w-full h-32 bg-slate-200 animate-pulse rounded"
              />
            ))}
          </div>
        ) : notes.length > 0 ? (
          <div className="grid grid-cols-3 gap-4 mt-8">
            {notes.map((note) => (
              <Card
                key={note.id}
                title={note.title}
                date={note.createdAt}
                content={note.content}
                tags={note.tags}
                isPinned={note.isPinned}
                onEdit={() =>
                  setOpenModal({ isShown: true, type: "edit", data: note })
                }
                onDelete={() => handleDelete(note.id)}
                onPin={() => handlePin(note.id, note.isPinned)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-56px)]">
            <div className="w-fit">
              <FilePlus2 className="size-60 text-primary" />
            </div>
            <p className="w-1/2 text-sm font-medium text-black text-center leading-7 mt-5">
              Start creating your first note! Click the 'Add' button to jot down
              your thoughts, ideas and reminders. Let&apos;s get started!
            </p>
          </div>
        )}
      </div>
      <button
        className="size-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-primary/80 absolute right-10 bottom-10"
        onClick={() => setOpenModal({ isShown: true, type: "add", data: null })}
      >
        <Plus className="size-8 text-white" />
      </button>
      <Dialog
        isOpen={openModal.isShown}
        onClose={() =>
          setOpenModal({ isShown: false, type: "add", data: null })
        }
        data={openModal.data}
        type={openModal.type}
      />
    </>
  );
};
