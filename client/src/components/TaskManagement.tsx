"use client";

import React, { useState, useRef, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import TaskDialog from "./TaskDialog";
import { taskService } from "@/services/taskService";

interface Task {
  _id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate: string;
}

export default function TaskManagement() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const toast = useRef<Toast>(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const fetchedTasks = await taskService.getAllTasks();
      setTasks(fetchedTasks);
    } catch (error) {
      showError("Faild to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const showSuccess = (message: string) => {
    toast.current?.show({
      severity: "success",
      summary: "Success",
      detail: message,
      life: 3000,
    });
  };

  const showError = (message: string) => {
    toast.current?.show({
      severity: "error",
      summary: "Error",
      detail: message,
      life: 3000,
    });
  };

  const openNew = () => {
    setSelectedTask(null);
    setDialogVisible(true);
  };

  const hideDialog = () => {
    setDialogVisible(false);
  };

  const saveTask = async (taskData: Omit<Task, "_id">) => {
    try {
      if (selectedTask) {
        const updateTask = await taskService.updateTask(
          selectedTask._id,
          taskData
        );
        setTasks(
          tasks.map((t) => (t._id === selectedTask._id ? updateTask : t))
        );
        showSuccess("Task Updated");
      } else {
        const newTask = await taskService.createTask(taskData);
        setTasks([...tasks, newTask]);
        showSuccess("Task Created");
      }
      setDialogVisible(false);
    } catch (error) {
      showError("Faild to save task");
    }
  };

  const editTask = (task: Task) => {
    setSelectedTask({ ...task });
    setDialogVisible(true);
  };

  const confirmDeleteTask = (task: Task) => {
    confirmDialog({
      message: "Are you sure you want to delete this task?",
      header: "Confirm",
      icon: "pi pi-exclamation-triangle",
      accept: () => deleteTask(task),
    });
  };

  const deleteTask = async (task: Task) => {
    try {
      await taskService.deleteTask(task._id);
      setTasks(tasks.filter((t) => t._id !== task._id))
      showSuccess("Task Deleted")
    } catch (error) {
        showError("Failed to delete task")
    }
  };

  const actionBodyTemplate = (rowData: Task) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-pencil"
          rounded
          outlined
          className="mr-2"
          onClick={() => editTask(rowData)}
        />
        <Button
          icon="pi pi-trash"
          rounded
          outlined
          severity="danger"
          onClick={() => confirmDeleteTask(rowData)}
        />
      </React.Fragment>
    );
  };

  return (
    <div className="card">
      <Toast ref={toast} />
      <ConfirmDialog />

      <div className="mb-4">
        <Button
          label="New Task"
          icon="pi pi-plus"
          className="p-button-success mr-2"
          onClick={openNew}
        />
      </div>

      <DataTable
        value={tasks}
        paginator
        rows={10}
        dataKey="_id"
        filterDisplay="row"
        loading={loading}
      >
        <Column
          field="_id"
          header="ID"
          sortable
          filter
          style={{ width: "10%" }}
        />
        <Column
          field="title"
          header="Title"
          sortable
          filter
          style={{ width: "20%" }}
        />
        <Column
          field="description"
          header="Description"
          sortable
          filter
          style={{ width: "30%" }}
        />
        <Column
          field="status"
          header="Status"
          sortable
          filter
          style={{ width: "10%" }}
        />
        <Column
          field="priority"
          header="Priority"
          sortable
          filter
          style={{ width: "10%" }}
        />
        <Column
          field="dueDate"
          header="Due Date"
          sortable
          filter
          style={{ width: "10%" }}
        //   body={(rowData) => rowData.dueDate.toLocaleDateString()}
        />
        <Column
          body={actionBodyTemplate}
          exportable={false}
          style={{ width: "10%" }}
        />
      </DataTable>

      <TaskDialog
        visible={dialogVisible}
        task={selectedTask}
        onHide={hideDialog}
        onSave={saveTask}
      />
    </div>
  );
}
