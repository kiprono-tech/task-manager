"use client";
import React, { useState, useEffect, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import { Calendar, CalendarViewChangeEvent } from "primereact/calendar";
import { Toast } from "primereact/toast";

interface Task {
  _id?: string;
  title: string;
  description: string;
  status: string;
  dueDate: string;
  priority: string;
}

interface TaskDialogProps {
  visible: boolean;
  task: Task | null;
  onHide: () => void;
  onSave: (task: Task) => void;
}

const statusOptions = ["TODO", "IN_PROGRESS", "DONE"];
const priorityOptions = ["LOW", "MEDIUM", "HIGH"];

export default function TaskDialog({
  visible,
  task,
  onHide,
  onSave,
}: TaskDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [priority, setPriority] = useState("");
  const toast = useRef<Toast>(null);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setStatus(task.status);
      if (task.dueDate) {
        const [day, month, year] = task.dueDate.split('/').map(Number);
        setDueDate(new Date(year, month - 1, day));
      }
      setPriority(task.priority);
    } else {
      setTitle("");
      setDescription("");
      setStatus("TODO");
      setDueDate(null);
      setPriority("MEDIUM");
    }
  }, [task]);

  const handleSave = () => {
    if (title.trim() && description.trim() && status && dueDate && priority) {
      const formattedDate = `${dueDate
        .getDate()
        .toString()
        .padStart(2, "0")}/${(dueDate.getMonth() + 1)
        .toString()
        .padStart(2, "0")}/${dueDate.getFullYear()}`;

      onSave({
        title: title.trim(),
        description: description.trim(),
        status,
        dueDate: formattedDate,
        priority,
      });
      onHide();
    } else {
      toast.current?.show({
        severity: "error",
        summary: "Validation Error",
        detail: "Please fill all fields correctly",
        life: 3000,
      });
    }
  };

  const dialogFooter = (
    <React.Fragment>
      <Button label="Cancel" icon="pi pi-times" outlined onClick={onHide} />
      <Button label="Save" icon="pi pi-check" onClick={handleSave} />
    </React.Fragment>
  );

  return (
    <div>
      <Toast ref={toast} />
      <Dialog
        visible={visible}
        style={{ width: "450px" }}
        header={task ? "Edit Task" : "New Task"}
        modal
        className="p-fluid"
        footer={dialogFooter}
        onHide={onHide}
      >
        <div className="field">
          <label htmlFor="title">Title</label>
          <InputText
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            autoFocus
          />
        </div>
        <div className="field">
          <label htmlFor="description">Description</label>
          <InputTextarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={5}
            maxLength={500}
          />
          <small>{description.length}/500</small>
        </div>
        <div className="field">
          <label htmlFor="status">Status</label>
          <Dropdown
            id="status"
            value={status}
            onChange={(e) => setStatus(e.value)}
            options={statusOptions}
            placeholder="Select Status"
            required
          />
        </div>
        <div className="field">
          <label htmlFor="priority">Priority</label>
          <Dropdown
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.value)}
            options={priorityOptions}
            placeholder="Select Priority"
            required
          />
        </div>
        <div className="field">
          <label htmlFor="dueDate">Due Date</label>
          <Calendar
            id="dueDate"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value as Date)}
            showIcon
            required
            dateFormat="dd/mm/yy"
          />
        </div>
      </Dialog>
    </div>
  );
}
