import { Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";

import { apiRequest } from "../lib/request";
import { Note } from "../types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  data: Note | null;
  type: "add" | "edit";
}

export const Dialog = ({ onClose, isOpen, data, type }: Props) => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [tag, setTag] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const addNewTag = () => {
    if (tag.trim() !== "") {
      setTags([...tags, tag.trim()]);

      setTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Please enter the title.");

      return;
    }

    if (!content.trim()) {
      setError("Please enter the content.");

      return;
    }

    const response = await apiRequest(
      type === "edit" ? "PUT" : "POST",
      type === "edit" ? `/notes/edit-note/${data?.id}` : "/notes/add-note",
      {
        title,
        content,
        tags,
      }
    );

    if (response.success) {
      onClose();

      navigate(0);
    } else {
      console.error(response.error);

      if (type === "edit") {
        if (response.status === 400) {
          toast.error("No changes provided.");
        } else if (response.status) {
          toast.error("Note not found.");
        } else {
          toast.error(
            "Something went wrong! There was a problem with your request."
          );
        }
      }

      if (type === "add") {
        if (response.status === 400) {
          toast.error("All fields (title and content) are required.");
        } else {
          toast.error(
            "Something went wrong! There was a problem with your request."
          );
        }
      }
    }

    setError(null);
  };

  useEffect(() => {
    if (type === "edit" && data) {
      setTitle(data.title || "");
      setContent(data.content || "");
      setTags(data.tags || []);
    } else if (type === "add") {
      setTitle("");
      setContent("");
      setTags([]);
    }
  }, [data, type]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      ariaHideApp={false}
      style={{ overlay: { backgroundColor: "rgba(0,0,0,0.8)" } }}
      className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5"
    >
      <form className="relative" onSubmit={handleSubmit}>
        <button
          className="size-10 rounded-full flex items-center justify-center absolute -top-3 -right-3"
          onClick={onClose}
        >
          <X className="size-5 text-slate-700" />
        </button>
        <div className="flex flex-col gap-2">
          <label className="text-xs text-slate-700">TITLE</label>
          <input
            type="text"
            value={title || ""}
            onChange={(e) => setTitle(e.target.value)}
            className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded"
          />
        </div>
        <div className="flex flex-col gap-2 mt-4">
          <label className="text-xs text-slate-700">CONTENT</label>
          <textarea
            value={content || ""}
            onChange={(e) => setContent(e.target.value)}
            className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded resize-none"
            rows={5}
          />
        </div>
        <div className="mt-3">
          <label className="text-xs text-slate-700">TAGS</label>
          <div>
            {tags.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap mt-2">
                {tags.map((tag, i) => (
                  <span
                    className="flex items-center gap-2 text-sm text-slate-900 bg-slate-100 px-3 py-1 rounded"
                    key={i}
                  >
                    # {tag}
                    <button onClick={() => removeTag(tag)}>
                      <X className="size-5 text-slate-700" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            <div className="flex items-center gap-4 mt-3">
              <input
                type="text"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addNewTag();
                  }
                }}
                className="text-sm text-slate-950 outline-none bg-slate-50 rounded px-3 py-2 w-full"
              />
              <button
                onClick={() => addNewTag()}
                className="size-8 flex items-center justify-center rounded border border-primary hover:bg-primary"
              >
                <Plus className="size-6 text-primary hover:text-white" />
              </button>
            </div>
          </div>
        </div>
        {error && <p className="text-red-500 text-xs pt-4">{error}</p>}
        <button
          className="w-full text-sm bg-primary text-white p-3 rounded mt-5 hover:bg-primary/80 transition-opacity cursor-pointer"
          onClick={handleSubmit}
        >
          {type === "edit" ? "Edit" : "Add"}
        </button>
      </form>
    </Modal>
  );
};
