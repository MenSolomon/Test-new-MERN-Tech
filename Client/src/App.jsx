import { useEffect, useState } from "react";

function App() {
  const API_BASE = "http://localhost:3333";

  const [todos, setTodos] = useState([]);
  const [popupActive, setPopupActive] = useState(false);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    GetTodos();

    console.log(todos, "All todos");
  }, []);

  const GetTodos = () => {
    fetch(API_BASE + "/todos")
      .then((res) => res.json())
      .then((data) => setTodos(data))
      .catch((err) => console.error("Error:", err));
  };

  const completeTask = async (id) => {
    const data = await fetch(API_BASE + "/todos/complete/" + id).then((res) =>
      res.json()
    );

    // Reason for this is to update the state here after the data in the database has been deleted
    setTodos((todos) =>
      todos.map((todo) => {
        if (todo._id === data._id) {
          todo.complete = data.complete;
        }
        return todo;
      })
    );
  };

  const deleteTodo = async (id) => {
    const data = await fetch(API_BASE + "/todos/delete/" + id, {
      method: "DELETE",
    }).then((res) => res.json());

    setTodos((todos) => todos.filter((todo) => todo._id !== data._id));
  };

  const addTodo = async () => {
    const data = await fetch(API_BASE + "/todos/new", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: newTodo,
      }),
    }).then((res) => res.json());

    setTodos([...todos, data]);
    setPopupActive(false);
    setNewTodo("");
  };
  return (
    <div>
      <h1>Welcom, Michael</h1>
      <h4>Your Tasks</h4>

      {/* ALL TODOS */}
      <div className="todos">
        {/* ONE TODO */}

        {todos.map((data) => (
          <div
            className={"todo" + (data.complete ? " is-complete" : "")}
            key={data._id}
            onClick={() => {
              completeTask(data._id);
            }}
          >
            {/* CHECKBOX */}

            <div className="checkbox"></div>

            {/* TASK TO DO  */}
            <div className="text">{data.text}</div>

            {/* `DELETE TODO` */}
            <div
              className="delete-todo"
              onClick={() => {
                deleteTodo(data._id);
              }}
            >
              x
            </div>
          </div>
        ))}

        <div className="addPopup" onClick={() => setPopupActive(true)}>
          +{" "}
        </div>

        {popupActive ? (
          <div className="popup">
            <div className="closePopup" onClick={() => setPopupActive(false)}>
              X
            </div>
            <div className="content">
              <h3> Add Task </h3>
              {/* {newTodo} */}
              <input
                type="text"
                className="add-todo-input"
                onChange={(e) => setNewTodo(e.target.value)}
                value={newTodo}
              />

              <div className="button" onClick={addTodo}>
                Create task
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default App;
