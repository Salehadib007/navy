import { useEffect, useMemo, useState } from "react";
import api from "../../../utils/api.js";
import { useSetup } from "../../../context/SetupContext.jsx"; // adjust path if needed

export default function MenuDistribution() {
  const { setup, loadingSetup } = useSetup();

  // ===============================
  // Users
  // ===============================
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // ===============================
  // State
  // ===============================
  const [selectedUserId, setSelectedUserId] = useState("");
  const [checked, setChecked] = useState([]); // backend format values like "Setup.Branch"
  const [expanded, setExpanded] = useState({
    Setup: true,
    Operation: true,
    Admin: true,
    Report: true,
  });

  // ===============================
  // Helpers
  // ===============================
  const toBackendValue = (section, label) => {
    // keep Setup as "Setup.X"
    if (section === "Setup") return `Setup.${label}`;

    // other than setup => only label
    return label;
  };

  // ===============================
  // Fetch Users
  // ===============================
  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const res = await api.get("/auth");
      setUsers(res.data || []);
    } catch (err) {
      // console.log("Fetch users error:", err);
      alert(err?.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ===============================
  // Permissions (Frontend Labels)
  // ===============================
  const permissions = useMemo(() => {
    // setup keys must match your Setup model fields
    const setupKeys = [
      "Branch",
      "Rank",
      "VehicleBrand",
      "UserCategory",
      "JobLocation",
      "BRTALocation",
      "BRTADigit",
      "BloodGroup",
      "VehicleModel",
      "VehicleType",
      "SMSCategory",
      "Employee",
      "Department",
      "Designation",
    ];

    // Only show setup keys that exist in DB setup response
    const availableSetupKeys =
      setupKeys?.filter(
        (k) => setup && Object.prototype.hasOwnProperty.call(setup, k),
      ) || [];

    return {
      Setup: availableSetupKeys, // frontend labels only
      Operation: ["Enrollment"],
      Admin: ["CreateUser", "MenuDistribution"],
      Report: ["CustomerDetailsReport", "EnrollmentList"],
    };
  }, [setup]);

  // ===============================
  // Toggle single permission
  // ===============================
  const togglePermission = (section, label) => {
    const backendValue = toBackendValue(section, label);

    setChecked((prev) => {
      if (prev.includes(backendValue)) {
        return prev.filter((x) => x !== backendValue);
      }
      return [...prev, backendValue];
    });
  };

  // ===============================
  // Toggle full section
  // ===============================
  const toggleSection = (sectionName) => {
    const sectionLabels = permissions[sectionName] || [];
    const sectionBackendValues = sectionLabels.map((lbl) =>
      toBackendValue(sectionName, lbl),
    );

    setChecked((prev) => {
      const allSelected = sectionBackendValues.every((p) => prev.includes(p));

      if (allSelected) {
        return prev.filter((x) => !sectionBackendValues.includes(x));
      } else {
        const next = new Set(prev);
        sectionBackendValues.forEach((x) => next.add(x));
        return Array.from(next);
      }
    });
  };

  const isSectionChecked = (sectionName) => {
    const sectionLabels = permissions[sectionName] || [];
    if (!sectionLabels.length) return false;

    const sectionBackendValues = sectionLabels.map((lbl) =>
      toBackendValue(sectionName, lbl),
    );

    return sectionBackendValues.every((p) => checked.includes(p));
  };

  const isSectionIndeterminate = (sectionName) => {
    const sectionLabels = permissions[sectionName] || [];
    if (!sectionLabels.length) return false;

    const sectionBackendValues = sectionLabels.map((lbl) =>
      toBackendValue(sectionName, lbl),
    );

    const selectedCount = sectionBackendValues.filter((p) =>
      checked.includes(p),
    ).length;

    return selectedCount > 0 && selectedCount < sectionBackendValues.length;
  };

  // ===============================
  // Submit
  // ===============================
  const handleSubmit = async () => {
    if (!selectedUserId) {
      alert("Please select a user");
      return;
    }

    // Here you can send to backend (example endpoint)
    // POST /menu-distribution or PUT /auth/:id/access
    // depends on your backend structure

    try {
      // Example: update user's access permissions
      const res = await api.put(`/auth/${selectedUserId}`, {
        access: checked, // sending backend format values
      });

      alert(res?.data?.message || "Menu permissions updated!");
    } catch (err) {
      // console.log("Submit error:", err);
      alert(err?.response?.data?.message || "Failed to update permissions");
    }
  };

  // ===============================
  // UI
  // ===============================
  return (
    <div className="min-h-screen bg-slate-100 p-4">
      <div className="max-w-6xl mx-auto space-y-4">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow p-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">Menu Distribution</h2>
            <p className="text-sm text-slate-500">
              Assign menu permissions to users
            </p>
          </div>

          <button
            onClick={fetchUsers}
            className="px-4 py-2 rounded-xl border bg-white hover:bg-slate-50 font-semibold"
          >
            Refresh Users
          </button>
        </div>

        {/* User Select */}
        <div className="bg-white rounded-2xl shadow p-4">
          <div className="grid md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="text-sm font-semibold">User</label>
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="w-full mt-1 border rounded-xl px-3 py-2"
              >
                <option value="">Select user</option>
                {loadingUsers ? (
                  <option value="">Loading...</option>
                ) : (
                  users.map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.username}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div className="md:col-span-2 flex justify-end gap-2">
              <button
                onClick={() => setChecked([])}
                className="px-5 py-2 rounded-xl border bg-white hover:bg-slate-50 font-semibold"
              >
                Clear
              </button>

              <button
                onClick={handleSubmit}
                className="px-6 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold"
              >
                SUBMIT
              </button>
            </div>
          </div>
        </div>

        {/* Loading Setup */}
        {loadingSetup && (
          <div className="bg-white rounded-2xl shadow p-4 text-sm text-slate-600">
            Loading setup data...
          </div>
        )}

        {/* Menu Sections */}
        <div className="bg-white rounded-2xl shadow p-4">
          <div className="grid md:grid-cols-2 gap-4">
            {Object.keys(permissions).map((section) => (
              <div key={section} className="border rounded-2xl bg-slate-50 p-4">
                {/* Section header */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isSectionChecked(section)}
                      ref={(el) => {
                        if (el)
                          el.indeterminate = isSectionIndeterminate(section);
                      }}
                      onChange={() => toggleSection(section)}
                    />
                    <h3 className="font-bold text-slate-800">{section}</h3>
                  </div>

                  <button
                    onClick={() =>
                      setExpanded((p) => ({ ...p, [section]: !p[section] }))
                    }
                    className="px-3 py-1 rounded-lg border bg-white text-sm font-semibold"
                  >
                    {expanded[section] ? "Hide" : "Show"}
                  </button>
                </div>

                {/* Section items */}
                {expanded[section] && (
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {permissions[section].map((label) => {
                      const backendValue = toBackendValue(section, label);

                      return (
                        <label
                          key={backendValue}
                          className="flex items-center gap-2 text-sm bg-white border rounded-xl px-3 py-2 hover:bg-slate-50"
                        >
                          <input
                            type="checkbox"
                            checked={checked.includes(backendValue)}
                            onChange={() => togglePermission(section, label)}
                          />
                          {label}
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
          {/* Debug (optional) */}
          {/* <div className="bg-white rounded-2xl shadow p-4 text-xs text-slate-600">
            <p className="font-bold mb-2">
              Selected permissions (backend format):
            </p>
            <pre className="whitespace-pre-wrap">
              {JSON.stringify(checked, null, 2)}
            </pre>
          </div> */}
        </div>
      </div>
    </div>
  );
}
