"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import api from "../../../utils/api.js"; // adjust path
import { useSetup } from "../../../context/SetupContext.jsx"; // adjust path

export default function SetupItem({
  setupKey = "Rank", // "Branch" | "Rank" | ...
  title = "Setup",
  placeholder = "Name",
}) {
  const { setup, loadingSetup, fetchSetup } = useSetup();

  // ===============================
  // Data from SetupContext
  // ===============================
  const rows = useMemo(() => {
    const arr = setup?.[setupKey] || [];
    return arr.map((name, index) => ({
      id: index + 1,
      name,
    }));
  }, [setup, setupKey]);

  // ===============================
  // Search + Pagination
  // ===============================
  const itemsPerPage = 10;
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return rows.filter(
      (r) => r.name.toLowerCase().includes(q) || String(r.id).includes(q),
    );
  }, [rows, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const safePage = Math.min(page, totalPages);
  const startIndex = (safePage - 1) * itemsPerPage;
  const currentData = filtered.slice(startIndex, startIndex + itemsPerPage);

  // ===============================
  // ADD Dropdown
  // ===============================
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newValue, setNewValue] = useState("");
  const addRef = useRef(null);

  // ===============================
  // UPDATE Modal
  // ===============================
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [editValue, setEditValue] = useState("");

  // ===============================
  // DELETE Modal
  // ===============================
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingRow, setDeletingRow] = useState(null);

  // ===============================
  // Global Close (ESC + Outside)
  // ===============================
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setIsAddOpen(false);
        setIsUpdateOpen(false);
        setIsDeleteOpen(false);
      }
    };

    const onClick = (e) => {
      if (addRef.current && !addRef.current.contains(e.target)) {
        setIsAddOpen(false);
      }
    };

    window.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, []);

  // ===============================
  // API Actions
  // ===============================
  const addItem = async () => {
    const value = newValue.trim();
    if (!value) return;

    try {
      await api.post("/setup/add", { key: setupKey, value });
      setNewValue("");
      setIsAddOpen(false);
      await fetchSetup();
    } catch (err) {
      // console.log("Add error:", err);
      alert(err.response?.data?.message || "Failed to add item");
    }
  };

  const openUpdateModal = (row) => {
    setEditingRow(row);
    setEditValue(row.name);
    setIsUpdateOpen(true);
  };

  // backend doesn't have update endpoint:
  // UPDATE = remove old + add new
  const saveUpdate = async () => {
    const newVal = editValue.trim();
    if (!newVal) return;

    try {
      await api.post("/setup/remove", {
        key: setupKey,
        value: editingRow.name,
      });

      await api.post("/setup/add", {
        key: setupKey,
        value: newVal,
      });

      setIsUpdateOpen(false);
      await fetchSetup();
    } catch (err) {
      // console.log("Update error:", err);
      alert(err.response?.data?.message || "Failed to update item");
    }
  };

  const openDeleteModal = (row) => {
    setDeletingRow(row);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await api.post("/setup/remove", {
        key: setupKey,
        value: deletingRow.name,
      });

      setIsDeleteOpen(false);
      await fetchSetup();
    } catch (err) {
      // console.log("Delete error:", err);
      alert(err.response?.data?.message || "Failed to delete item");
    }
  };

  // ===============================
  // UI
  // ===============================
  return (
    <div className="min-h-screen bg-slate-100 p-4">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center gap-3">
          <h2 className="text-lg font-semibold">{title}</h2>

          <div className="flex items-center gap-3 relative" ref={addRef}>
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search..."
              className="border rounded-lg px-3 py-2 text-sm w-64"
            />

            {/* ADD Button */}
            <button
              onClick={() => setIsAddOpen((p) => !p)}
              className="w-10 h-10 rounded-full bg-sky-600 hover:bg-sky-700 text-white text-xl flex items-center justify-center disabled:opacity-50"
              disabled={loadingSetup}
              title={loadingSetup ? "Loading..." : "Add"}
            >
              +
            </button>

            {/* ADD Dropdown */}
            {isAddOpen && (
              <div className="absolute right-0 top-12 w-80 bg-white border rounded-xl shadow-xl p-4 z-20">
                <h4 className="font-semibold text-sm mb-3">Add {setupKey}</h4>

                <input
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  placeholder={placeholder}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />

                <div className="mt-4 flex justify-end gap-2">
                  <button
                    onClick={() => setIsAddOpen(false)}
                    className="px-4 py-2 bg-amber-500 text-white rounded text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addItem}
                    className="px-4 py-2 bg-sky-600 text-white rounded text-sm"
                  >
                    Save
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        <table className="w-full text-sm">
          <thead className="bg-slate-800 text-white">
            <tr>
              <th className="px-4 py-3 text-left">SL</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {loadingSetup ? (
              <tr>
                <td
                  colSpan={3}
                  className="px-4 py-8 text-center text-slate-500"
                >
                  Loading...
                </td>
              </tr>
            ) : currentData.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="px-4 py-8 text-center text-slate-500"
                >
                  No data found
                </td>
              </tr>
            ) : (
              currentData.map((row) => (
                <tr key={row.id} className="border-b hover:bg-slate-50">
                  <td className="px-4 py-3">{row.id}</td>
                  <td className="px-4 py-3 font-medium">{row.name}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => openUpdateModal(row)}
                        className="bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-1.5 rounded text-xs"
                      >
                        ✎ Edit
                      </button>
                      <button
                        onClick={() => openDeleteModal(row)}
                        className="bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded text-xs"
                      >
                        🗑 Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="p-4 flex justify-between items-center">
          <p className="text-sm text-slate-600">
            Page {safePage} of {totalPages}
          </p>

          <div className="flex gap-2">
            <button
              disabled={safePage === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1.5 border rounded disabled:opacity-50"
            >
              Prev
            </button>
            <button
              disabled={safePage === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1.5 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* UPDATE MODAL */}
      {isUpdateOpen && (
        <ModalShell onClose={() => setIsUpdateOpen(false)}>
          <div className="bg-white rounded-xl w-full max-w-md p-5">
            <h3 className="font-semibold mb-3">Update {setupKey}</h3>

            <input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setIsUpdateOpen(false)}
                className="px-4 py-2 bg-amber-500 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={saveUpdate}
                className="px-4 py-2 bg-sky-600 text-white rounded"
              >
                Update
              </button>
            </div>
          </div>
        </ModalShell>
      )}

      {/* DELETE MODAL */}
      {isDeleteOpen && (
        <ModalShell onClose={() => setIsDeleteOpen(false)}>
          <div className="bg-white rounded-xl w-full max-w-md p-5">
            <h3 className="font-semibold text-rose-600">Confirm Delete</h3>
            <p className="mt-2 text-sm">
              Delete <b>{deletingRow?.name}</b>?
            </p>

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setIsDeleteOpen(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-rose-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </ModalShell>
      )}
    </div>
  );
}

/* ================= Modal Shell ================= */
function ModalShell({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
