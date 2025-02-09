interface Task {
    _id: string;
    title: string;
    description: string;
    status: string;
    dueDate: string;
    priority: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL
console.log(API_BASE_URL)

export const taskService = {
    async getAllTasks(): Promise<Task[]> {
        const response =  await fetch(`${API_BASE_URL}/tasks`)
        if(!response.ok) {
            throw new Error("Faild to fetch tasks")
        }
        const data =  await response.json();
        return data.data.tasks;
    },
    async getTask(id: string): Promise<Task> {
        const response =  await fetch(`${API_BASE_URL}/tasks/${id}`)
        if(!response.ok) {
            throw new Error("Failed to fetch task")
        }
        const data = await response.json()
        return data.data.task
    },
    async createTask(task: Omit<Task, '_id'>): Promise<Task> {
        const response =  await fetch(`${API_BASE_URL}/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(task)
        });
        if(!response.ok) {
            throw new Error("Failed to create task")
        }
        const data =  await response.json();
        return data.task
    },
    async updateTask(id: string, task: Partial<Task>): Promise<Task> {
        const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(task)
        });
        if(!response.ok) {
            throw new Error("Failed to update task")
        }
        const data =  await response.json();
        return data.data.updatedTask
    },
    async deleteTask(id: string): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
            method: 'DELETE'
        })
        if(!response.ok) {
            throw new Error("Failed to delete task")
        }
    }
}