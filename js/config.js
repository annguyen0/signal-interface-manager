// Constants and initial data
export const signals = ["Signal 1", "Signal 2", "Signal 3", "Signal 4", "Signal 5"];
export const interfaces = ["Interface 1", "Interface 2", "Interface 3", "Interface 4", "Interface 5"];
export const baselines = ["BL01", "BL02", "BL03", "BL04", "BL05", "BL06", "BL07", "BL08", "BL09"];

// Data structure
export const workspaceData = {
    "workspace1": [
        { signal: "Signal 1", interface: "Interface 2", baseline: "BL01", logic: "Logic cho Signal 1 và Interface 2", lastUpdated: "2025-04-10 14:30:22" },
        { signal: "Signal 3", interface: "Interface 1", baseline: "BL02", logic: "Logic cho Signal 3 và Interface 1", lastUpdated: "2025-04-11 09:15:47" }
    ],
    "workspace2": [
        { signal: "Signal 2", interface: "Interface 3", baseline: "BL03", logic: "Logic cho Signal 2 và Interface 3", lastUpdated: "2025-04-09 16:45:33" },
        { signal: "Signal 4", interface: "Interface 2", baseline: "BL01", logic: "Logic cho Signal 4 và Interface 2", lastUpdated: "2025-04-11 11:20:15" }
    ],
    "workspace3": []
};

// Global state
export const state = {
    nextWorkspaceId: 4,
    initialStates: {},
    lastDeletedRow: null,
    lastDeletedRowData: null
};