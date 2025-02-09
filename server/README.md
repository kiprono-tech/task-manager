## Run Project
- Configure environment variables using example.env

>

- Install dependencies
```bash
 npm install
```
- seed database with test records
```bash
 npm run seed
```

- run in devlopment
```bash
 npm run start:dev
```

- run in production
```bash
 npm run start
```


## BASE_URL 
> http://localhost:3001

## API URLS
Create Task
> HTTP POST http://localhost:3001/api/v1/tasks

Get All TASKS
> HTTP GET  http://localhost:3001/api/v1/tasks

Get Specific Task
> HTTP GET  http://localhost:3001/api/v1/tasks/${taskId}

Update Task
> HTTP PUT | PATCH  http://localhost:3001/api/v1/tasks/${taskId}

Delete Task 
> HTTP DELETE  http://localhost:3001/api/v1/tasks/${taskid}