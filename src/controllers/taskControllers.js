import Task from "../models/task.js";

const getTasks = async (req, res) => {
  const tasks = await Task.find();

  res.json({
    tasks,
  });
};

const postTask = async (req, res) => {
  const { title, description } = req.body;

  const task = new Task({ title, description });

  await task.save();

  res.json({
    msg: "Tarea nueva guardada!",
    task,
  });
};

//Actualizar una tarea
const putTask = async (req, res) => {
  const { id } = req.params;

  const tarea = await Task.findById(id);

  // const completada = await Task.findByIdAndUpdate(id, { completed: true });

  if (!tarea) {
    return res.status(404).json({
      msg: "Tarea no encontrada",
    });
  }

  tarea.completed = !tarea.completed;

  await tarea.save();

  return res.status(200).json({
    msg: "Tarea actualizada",
    completada,
  });
};

const deleteTask = async (req, res) => {
  const { id } = req.params;
  const tarea = await Task.findById(id);

  if (!tarea) {
    return res.status(404).json({
      msg: "Tarea no encontrada",
    });
  }

  await Task.findByIdAndDelete(id);

  return res.status(200).json({
    msg: "Tarea eliminada",
  });
};

export { getTasks, postTask, putTask, deleteTask };
