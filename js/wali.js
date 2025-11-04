// JavaScript for Wali Murid Dashboard

// Check authentication on page load
checkAuth('wali');

// Mock Data - Riwayat Absensi Anak
const riwayatAbsensiAnak = [
    { tanggal: '2025-07-15', waktu: '07:15:00', status: 'Hadir', keterangan: 'Tepat waktu' },
    { tanggal: '2025-07-14', waktu: '07:20:00', status: 'Hadir', keterangan: 'Tepat waktu' },
    { tanggal: '2025-07-13', waktu: '07:10:00', status: 'Hadir', keterangan: 'Tepat waktu' },
    { tanggal: '2025-07-12', waktu: '-', status: 'Izin', keterangan: 'Sakit' },
    { tanggal: '2025-07-11', waktu: '07:30:00', status: 'Hadir', keterangan: 'Terlambat 15 menit' },
    { tanggal: '2025-07-10', waktu: '07:15:00', status: 'Hadir', keterangan: 'Tepat waktu' },
    { tanggal: '2025-07-09', waktu: '07:12:00', status: 'Hadir', keterangan: 'Tepat waktu' },
    { tanggal: '2025-07-08', waktu: '07:18:00', status: 'Hadir', keterangan: 'Tepat waktu' },
    { tanggal: '2025-07-07', waktu: '-', status: 'Alpa', keterangan: 'Tanpa keterangan' },
    { tanggal: '2025-07-06', waktu: '07:16:00', status: 'Hadir', keterangan: 'Tepat waktu' }
];

// Calculate Summary Statistics
function calculateSummary() {
    let hadir = 0;
    let izin = 0;
    let alpa = 0;
    
    riwayatAbsensiAnak.forEach(absensi => {
        if (absensi.status === 'Hadir') {
            hadir++;
        } else if (absensi.status === 'Izin') {
            izin++;
        } else if (absensi.status === 'Alpa') {
            alpa++;
        }
    });
    
    return { hadir, izin, alpa };
}

// Load Summary Cards
function loadSummary() {
    const summary = calculateSummary();
    
    const totalHadirEl = document.getElementById('totalHadir');
    const totalIzinEl = document.getElementById('totalIzin');
    const totalAlpaEl = document.getElementById('totalAlpa');
    
    if (totalHadirEl) totalHadirEl.textContent = summary.hadir;
    if (totalIzinEl) totalIzinEl.textContent = summary.izin;
    if (totalAlpaEl) totalAlpaEl.textContent = summary.alpa;
}

// Load Riwayat Absensi
function loadRiwayatAbsensi() {
    const tbody = document.getElementById('riwayatAbsensiBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    riwayatAbsensiAnak.forEach((absensi, index) => {
        const row = document.createElement('tr');
        row.className = 'border-b border-gray-200 hover:bg-gray-50 transition-all';
        row.innerHTML = `
            <td class="px-6 py-4 text-gray-800">${index + 1}</td>
            <td class="px-6 py-4 text-gray-800">${absensi.tanggal}</td>
            <td class="px-6 py-4 text-gray-800">${absensi.waktu}</td>
            <td class="px-6 py-4">${getStatusBadge(absensi.status)}</td>
            <td class="px-6 py-4 text-gray-600">${absensi.keterangan}</td>
        `;
        tbody.appendChild(row);
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadSummary();
    loadRiwayatAbsensi();
});
