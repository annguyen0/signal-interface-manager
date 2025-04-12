import { loadWorkspaces } from './workspace-manager.js';
import { handleWorkspaceChange } from './workspace-manager.js';
import { handleBaselineFilterChange, resetFilter } from './filter-manager.js';
import { setupSearch } from './filter-manager.js';
import { showCreateWorkspaceModal, closeCreateWorkspaceModal } from './ui-manager.js';
import { createNewWorkspace, saveData } from './workspace-manager.js';
import { addNewRow, undoDelete } from './table-manager.js';

// Define global functions that need to be accessible from HTML
window.showCreateWorkspaceModal = showCreateWorkspaceModal;
window.closeCreateWorkspaceModal = closeCreateWorkspaceModal;
window.createNewWorkspace = createNewWorkspace;
window.addNewRow = addNewRow;
window.saveData = saveData;
window.resetFilter = resetFilter;
window.undoDelete = undoDelete;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Setup workspace selector event
    document.getElementById('workspace').addEventListener('change', handleWorkspaceChange);
    
    // Setup baseline filter event
    document.getElementById('baseline-filter').addEventListener('change', handleBaselineFilterChange);
    
    // Load workspaces from localStorage nếu có
    loadWorkspaces();

    // Thêm xử lý sự kiện khi nhấn phím Escape để đóng modal
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            const modal = document.getElementById('createWorkspaceModal');
            if (modal.style.display === 'block') {
                closeCreateWorkspaceModal();
            }
        }
    });

    // Setup search functionality
    setupSearch();
});