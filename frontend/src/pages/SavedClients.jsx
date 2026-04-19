import React, { useEffect, useState } from "react";
import WorkerLayout from "../components/WorkerLayout.jsx";
import { fetchSavedWorkers } from "../api/client.js";

// Reuse saved workers endpoint from client perspective for now placeholder
const SavedClients = () => {
  const [saved, setSaved] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchSavedWorkers(); // will be empty for worker role; placeholder
        setSaved(data);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
    };
    load();
  }, []);

  return (
    <WorkerLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Saved Clients</h1>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {saved.map((c) => (
            <div key={c.worker_id} className="p-4 rounded-lg border border-gray-200 bg-white space-y-2">
              <p className="font-semibold">{c.name}</p>
              <p className="text-sm text-gray-500">{c.skills?.join(", ")}</p>
              <p className="text-sm text-gray-500">${c.hourly_rate}/hr</p>
            </div>
          ))}
          {!saved.length && <p className="text-sm text-gray-500">No saved clients yet.</p>}
        </div>
      </div>
    </WorkerLayout>
  );
};

export default SavedClients;

