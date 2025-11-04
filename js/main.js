// Main JavaScript for ClassMate

// Logout Function
function logout() {
    if (confirm('Apakah Anda yakin ingin logout?')) {
        localStorage.clear();
        window.location.href = 'login.html';
    }
}

// Login Form Handler
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const role = document.getElementById('role').value;
            
            // Validasi role
            if (!role) {
                alert('Silakan pilih role terlebih dahulu!');
                return;
            }
            
            // Demo credentials validation
            const validCredentials = {
                siswa: { username: 'siswa', password: 'siswa123' },
                guru: { username: 'guru', password: 'guru123' },
                wali: { username: 'wali', password: 'wali123' }
            };
            
            if (validCredentials[role] && 
                username === validCredentials[role].username && 
                password === validCredentials[role].password) {
                
                // Save user info to localStorage
                localStorage.setItem('userRole', role);
                localStorage.setItem('username', username);
                
                // Redirect based on role
                if (role === 'siswa') {
                    window.location.href = 'siswa.html';
                } else if (role === 'guru') {
                    window.location.href = 'guru.html';
                } else if (role === 'wali') {
                    window.location.href = 'wali.html';
                }
            } else {
                alert('Username atau password salah!');
            }
        });
    }
});

// Format Date Indonesian
function formatDateIndonesian(date) {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    
    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    return `${dayName}, ${day} ${month} ${year}`;
}

// Format Time
function formatTime(date) {
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

// Get Status Badge HTML
function getStatusBadge(status) {
    let badgeClass = 'status-badge ';
    if (status === 'Hadir') {
        badgeClass += 'status-hadir';
    } else if (status === 'Izin') {
        badgeClass += 'status-izin';
    } else if (status === 'Alpa') {
        badgeClass += 'status-alpa';
    }
    return `<span class="${badgeClass}">${status}</span>`;
}

// Check Authentication
function checkAuth(requiredRole) {
    const userRole = localStorage.getItem('userRole');
    
    if (!userRole || userRole !== requiredRole) {
        alert('Anda tidak memiliki akses ke halaman ini!');
        window.location.href = 'login.html';
    }
}
