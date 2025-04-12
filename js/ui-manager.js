export function showCreateWorkspaceModal() {
    document.getElementById('createWorkspaceModal').style.display = 'block';
    const nameInput = document.getElementById('new-workspace-name');
    nameInput.value = '';
    document.getElementById('workspace-error').textContent = '';
    
    // Focus vào ô input
    setTimeout(() => {
        nameInput.focus();
    }, 100);
    
    // Thêm sự kiện input để xóa lỗi khi người dùng bắt đầu nhập lại
    nameInput.oninput = function() {
        document.getElementById('workspace-error').textContent = '';
    };
}

export function closeCreateWorkspaceModal() {
    document.getElementById('createWorkspaceModal').style.display = 'none';
}

export function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}