const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const Task = require("../models/Task");

exports.addTask = catchAsync(async (req, res, next) => {
  const data = req.body;
  const task = await Task.create(data);

  if (!task) {
    return next(new AppError("Error adding question", 400));
  }

  res.status(201).json({
    status: "success",
    task,
  });
});

exports.getAllTasks = catchAsync(async (req, res, next) => {
  const tasks = await Task.find();

  if (!tasks) {
    return next(new AppError("Error getting tasks", 400));
  }

  res.status(200).json({
    status: "success",
    data: {
      tasks,
    },
  });
});

exports.getTask = catchAsync(async (req, res, next) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return next(new AppError("No task found with that id", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      task,
    },
  });
});

const filter = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

exports.updateTask = catchAsync(async (req, res, next) => {
  const filterBody = filter(
    req.body,
    "title",
    "description",
    "status",
    "dueDate",
    "priority",
  );

  const updatedTask = await Task.findByIdAndUpdate(req.params.id, filterBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
        updatedTask
    }
  })
});

exports.deleteTask = catchAsync(async(req, res, next) => {
    await Task.findByIdAndDelete(req.params.id)
    res.status(204).json({
        status: "success",
        data: null
    })
})
