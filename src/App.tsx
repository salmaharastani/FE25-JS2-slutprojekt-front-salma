import { useEffect, useState } from "react";

type Category = "ux" | "frontend" | "backend";
type Status = "new" | "doing" | "done";

interface Member {
  id: number;
  name: string;
  category: Category;
}

interface Task {
  id: number;
  title: string;
  description: string;
  category: Category;
  status: Status;
  assignedTo: number | null;
  timestamp: string;
}

interface TaskCardProps {
  task: Task;
  reload: () => void;
  members: Member[];
}

const CATEGORIES: Category[] = ["ux", "frontend", "backend"];

function TaskCard({ task, reload, members }: TaskCardProps) {
  const deleteTask = async (): Promise<void> => {
    await fetch(`http://localhost:3000/assignments/${task.id}`, {
      method: "DELETE",
    });
    reload();
  };

  const moveTask = async (): Promise<void> => {
    const next: Status =
      task.status === "new"
        ? "doing"
        : task.status === "doing"
        ? "done"
        : "done";

    await fetch(`http://localhost:3000/assignments/${task.id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });

    reload();
  };

  const assign = async (memberId: number): Promise<void> => {
    if (!memberId) return;

    await fetch(`http://localhost:3000/assignments/${task.id}/assign`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ memberId }),
    });

    reload();
  };

  const assignedMember = members.find((m) => m.id === task.assignedTo);
  const eligibleMembers = members.filter((m) => m.category === task.category);

  const formatTimestamp = (ts: string): string => {
    if (!ts) return "-";
    try {
      return new Date(ts).toLocaleString();
    } catch {
      return String(ts);
    }
  };

  return (
    <div
      style={{
        border: "1px solid #ddd",
        padding: 15,
        marginBottom: 15,
        width: 260,
        background: "#fff",
        borderRadius: 10,
        boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
      }}
    >
      <h4 style={{ marginTop: 0 }}>{task.title}</h4>
      <p style={{ marginTop: 0 }}>{task.description}</p>

      <small>Category: {task.category}</small>
      <br />
      <small>Timestamp: {formatTimestamp(task.timestamp)}</small>
      <br />
      <small>Status: {task.status}</small>
      <br />
      <small>Assigned: {assignedMember ? assignedMember.name : "None"}</small>

      {task.status === "new" && (
        <>
          <br />
          <br />
          <select
            value={task.assignedTo ?? ""}
            onChange={(e) => assign(Number(e.target.value))}
            style={{ width: "100%" }}
          >
            <option value="">Assign member</option>
            {eligibleMembers.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </>
      )}

      <br />
      <br />

      {task.status !== "done" && (
        <button
          onClick={moveTask}
          disabled={task.status === "new" && !task.assignedTo}
          style={{ marginRight: 10 }}
        >
          ➡ Move
        </button>
      )}

      {task.status === "done" && <button onClick={deleteTask}>❌ Delete</button>}
    </div>
  );
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [members, setMembers] = useState<Member[]>([]);

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [category, setCategory] = useState<Category>(CATEGORIES[0]);

  const [memberName, setMemberName] = useState<string>("");
  const [memberCategory, setMemberCategory] = useState<Category>(CATEGORIES[0]);

  const loadTasks = (): void => {
    fetch("http://localhost:3000/assignments")
      .then((res) => res.json())
      .then((data: Task[]) => setTasks(data));
  };

  const loadMembers = (): void => {
    fetch("http://localhost:3000/members")
      .then((res) => res.json())
      .then((data: Member[]) => setMembers(data));
  };

  useEffect(() => {
    loadTasks();
    loadMembers();
  }, []);

  const createTask = async (): Promise<void> => {
    if (!title.trim() || !description.trim()) return;

    await fetch("http://localhost:3000/assignments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: title.trim(),
        description: description.trim(),
        category,
      }),
    });

    setTitle("");
    setDescription("");
    setCategory(CATEGORIES[0]);
    loadTasks();
  };

  const createMember = async (): Promise<void> => {
    if (!memberName.trim()) return;

    await fetch("http://localhost:3000/members", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: memberName.trim(),
        category: memberCategory,
      }),
    });

    setMemberName("");
    setMemberCategory(CATEGORIES[0]);
    loadMembers();
  };

  return (
    <div
      style={{
        padding: 40,
        background: "#f5f6fa",
        minHeight: "100vh",
        fontFamily: "sans-serif",
      }}
    >
      <h1>Scrum board</h1>

      <h2>Lägg till medlem</h2>
      <input
        placeholder="Namn"
        value={memberName}
        onChange={(e) => setMemberName(e.target.value)}
        style={{ padding: 8, width: 250 }}
      />
      <br />
      <br />
      <select
        value={memberCategory}
        onChange={(e) => setMemberCategory(e.target.value as Category)}
        style={{ padding: 8, width: 250 }}
      >
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <br />
      <br />
      <button onClick={createMember} style={{ padding: "8px 16px" }}>
        Lägg till medlem
      </button>

      <hr style={{ margin: "30px 0" }} />

      <h2>Skapa task</h2>
      <input
        placeholder="Titel"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ padding: 8, width: 250 }}
      />
      <br />
      <br />
      <input
        placeholder="Beskrivning"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={{ padding: 8, width: 250 }}
      />
      <br />
      <br />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value as Category)}
        style={{ padding: 8, width: 250 }}
      >
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <br />
      <br />
      <button onClick={createTask} style={{ padding: "8px 16px" }}>
        Skapa
      </button>

      <hr style={{ margin: "30px 0" }} />

      <div style={{ display: "flex", gap: 40 }}>
        <div>
          <h2>New</h2>
          {tasks
            .filter((t) => t.status === "new")
            .map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                reload={loadTasks}
                members={members}
              />
            ))}
        </div>

        <div>
          <h2>Doing</h2>
          {tasks
            .filter((t) => t.status === "doing")
            .map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                reload={loadTasks}
                members={members}
              />
            ))}
        </div>

        <div>
          <h2>Done</h2>
          {tasks
            .filter((t) => t.status === "done")
            .map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                reload={loadTasks}
                members={members}
              />
            ))}
        </div>
      </div>
    </div>
  );
}

export default App;