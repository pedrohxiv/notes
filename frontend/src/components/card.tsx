import { formatDate } from "date-fns";
import { Pen, Pin, Trash } from "lucide-react";

import { cn } from "../lib/utils";

interface Props {
  title: string;
  date: Date;
  content: string;
  tags: string[];
  isPinned: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onPin: () => void;
}

export const Card = ({
  title,
  date,
  content,
  tags,
  isPinned,
  onEdit,
  onDelete,
  onPin,
}: Props) => {
  return (
    <div className="border rounded p-4 bg-white hover:shadow-xl transition-all ease-in-out">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h6 className="text-sm font-medium">{title}</h6>
          <span className="text-xs text-slate-500 mt-1">
            {formatDate(date, "d MMM yyyy")}
          </span>
        </div>
        <Pin
          className={cn(
            "size-5 text-slate-300 cursor-pointer hover:text-primary",
            isPinned && "text-primary fill-primary"
          )}
          onClick={onPin}
        />
      </div>
      <p className="text-xs text-slate-600 mt-2">
        {content.length > 60 ? `${content.slice(0, 58)}...` : content}
      </p>
      <div className="flex text-center justify-between mt-2">
        {tags.map((tag, i) => (
          <span
            key={i}
            className="flex items-center gap-2 text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded"
          >
            # {tag}
          </span>
        ))}
        <div className="flex items-center gap-2">
          <Pen
            className="size-4 text-slate-300 cursor-pointer hover:text-slate-600"
            onClick={onEdit}
          />
          <Trash
            className="size-4 text-slate-300 cursor-pointer hover:text-red-500"
            onClick={onDelete}
          />
        </div>
      </div>
    </div>
  );
};
