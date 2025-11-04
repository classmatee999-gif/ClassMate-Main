checkAuth('guru');

// Current selected class
let currentKelas = 'X PPLG 1';

// Get absensi data from localStorage and merge with mock data
function getAbsensiData() {
    const storedAbsensi = JSON.parse(localStorage.getItem('absensiWithPhoto') || '[]');
    
    // Mock Data - Absensi Siswa (dengan berbagai kelas) - without photos
    const mockData = [
        // X PPLG 1
        { nama: 'Ahmad Rizki', kelas: 'X PPLG 1', tanggal: '2025-07-15', waktu: '07:15:00', status: 'Hadir', foto: null },
        { nama: 'Siti Nurhaliza', kelas: 'X PPLG 1', tanggal: '2025-07-15', waktu: '07:20:00', status: 'Hadir', foto: null },
        { nama: 'Dewi Lestari', kelas: 'X PPLG 1', tanggal: '2025-07-15', waktu: '-', status: 'Izin', foto: null },
        { nama: 'Fira Anggraini', kelas: 'X PPLG 1', tanggal: '2025-07-15', waktu: '07:12:00', status: 'Hadir', foto: null },
        { nama: 'Hendra Wijaya', kelas: 'X PPLG 1', tanggal: '2025-07-15', waktu: '07:22:00', status: 'Hadir', foto: null },
        { nama: 'Joko Susilo', kelas: 'X PPLG 1', tanggal: '2025-07-15', waktu: '07:30:00', status: 'Hadir', foto: null },
        
        // X PPLG 2
        { nama: 'Budi Santoso', kelas: 'X PPLG 2', tanggal: '2025-07-15', waktu: '07:18:00', status: 'Hadir', foto: null },
        { nama: 'Eko Prasetyo', kelas: 'X PPLG 2', tanggal: '2025-07-15', waktu: '07:35:00', status: 'Hadir', foto: null },
        { nama: 'Gita Puspita', kelas: 'X PPLG 2', tanggal: '2025-07-15', waktu: '-', status: 'Alpa', foto: null },
        { nama: 'Indah Permata', kelas: 'X PPLG 2', tanggal: '2025-07-15', waktu: '07:16:00', status: 'Hadir', foto: null },
        
        // XI PPLG 1
        { nama: 'Andi Pratama', kelas: 'XI PPLG 1', tanggal: '2025-07-15', waktu: '07:14:00', status: 'Hadir', foto: null },
        { nama: 'Rina Wulandari', kelas: 'XI PPLG 1', tanggal: '2025-07-15', waktu: '07:18:00', status: 'Hadir', foto: null },
        { nama: 'Dimas Saputra', kelas: 'XI PPLG 1', tanggal: '2025-07-15', waktu: '-', status: 'Izin', foto: null },
        
        // XI PPLG 2
        { nama: 'Maya Kusuma', kelas: 'XI PPLG 2', tanggal: '2025-07-15', waktu: '07:20:00', status: 'Hadir', foto: null },
        { nama: 'Rudi Hermawan', kelas: 'XI PPLG 2', tanggal: '2025-07-15', waktu: '07:25:00', status: 'Hadir', foto: null },
        
        // XII PPLG 1
        { nama: 'Agus Setiawan', kelas: 'XII PPLG 1', tanggal: '2025-07-15', waktu: '07:10:00', status: 'Hadir', foto: null },
        { nama: 'Lina Marlina', kelas: 'XII PPLG 1', tanggal: '2025-07-15', waktu: '07:15:00', status: 'Hadir', foto: null },
        
        // XII PPLG 2
        { nama: 'Fajar Rahman', kelas: 'XII PPLG 2', tanggal: '2025-07-15', waktu: '07:12:00', status: 'Hadir', foto: null },
        { nama: 'Sari Dewi', kelas: 'XII PPLG 2', tanggal: '2025-07-15', waktu: '-', status: 'Alpa', foto: null }
    ];
    
    // Merge stored absensi with mock data (stored comes first - newer data)
    return [...storedAbsensi, ...mockData];
}

const absensiSiswaData = getAbsensiData();

// Array to store tugas (dengan kelas)
let daftarTugasGuru = [
    {
        kelas: 'X PPLG 1',
        mataPelajaran: 'Matematika',
        judul: 'Latihan Soal Aljabar',
        deskripsi: 'Kerjakan soal-soal aljabar pada halaman 45-50',
        deadline: '2025-07-20'
    },
    {
        kelas: 'X PPLG 1',
        mataPelajaran: 'Fisika',
        judul: 'Laporan Praktikum',
        deskripsi: 'Buat laporan praktikum tentang hukum newton',
        deadline: '2025-07-22'
    },
    {
        kelas: 'X PPLG 2',
        mataPelajaran: 'Matematika',
        judul: 'Tugas Geometri',
        deskripsi: 'Kerjakan soal geometri bab 3',
        deadline: '2025-07-21'
    }
];

// Handle Kelas Change
function handleKelasChange() {
    const kelasSelect = document.getElementById('kelasSelect');
    currentKelas = kelasSelect.value;
    
    // Update active kelas display
    document.getElementById('activeKelas').textContent = currentKelas;
    
    // Update tugasKelas field
    document.getElementById('tugasKelas').value = currentKelas;
    
    // Reload data based on selected class
    loadAbsensiSiswa();
    loadDaftarTugas();
}

// View Photo Function
function viewPhoto(photoData) {
    if (!photoData) {
        alert('Foto tidak tersedia');
        return;
    }
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50';
    modal.onclick = function() { document.body.removeChild(modal); };
    
    modal.innerHTML = `
        <div class="bg-white rounded-xl p-6 max-w-2xl" onclick="event.stopPropagation()">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-xl font-bold text-gray-800">Foto Absensi Siswa</h3>
                <button onclick="this.closest('.fixed').remove()" class="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
            </div>
            <img src="${photoData}" class="w-full rounded-lg shadow-lg" alt="Foto Absensi">
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Load Absensi Siswa Data (filtered by class)
function loadAbsensiSiswa() {
    const tbody = document.getElementById('absensiSiswaBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    // Refresh data from localStorage
    const updatedData = getAbsensiData();
    
    // Filter by current kelas
    const filteredData = updatedData.filter(siswa => siswa.kelas === currentKelas);
    
    if (filteredData.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="px-6 py-8 text-center text-gray-500">
                    Tidak ada data absensi untuk kelas ${currentKelas}
                </td>
            </tr>
        `;
        return;
    }
    
    filteredData.forEach((siswa, index) => {
        const row = document.createElement('tr');
        row.className = 'border-b border-gray-200 hover:bg-gray-50 transition-all';
        
        // Photo thumbnail or placeholder
        let photoCell = '';
        if (siswa.foto) {
            photoCell = `
                <td class="px-6 py-4">
                    <img src="${siswa.foto}" 
                         class="w-16 h-16 rounded-lg object-cover cursor-pointer hover:scale-110 transition-all shadow-md" 
                         onclick="viewPhoto('${siswa.foto}')"
                         alt="Foto ${siswa.nama}">
                </td>
            `;
        } else {
            photoCell = `
                <td class="px-6 py-4">
                    <div class="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center">
                        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                        </svg>
                    </div>
                </td>
            `;
        }
        
        row.innerHTML = `
            <td class="px-6 py-4 text-gray-800">${index + 1}</td>
            ${photoCell}
            <td class="px-6 py-4 text-gray-800 font-medium">${siswa.nama}</td>
            <td class="px-6 py-4 text-gray-800">${siswa.kelas}</td>
            <td class="px-6 py-4 text-gray-800">${siswa.tanggal}</td>
            <td class="px-6 py-4 text-gray-800">${siswa.waktu}</td>
            <td class="px-6 py-4">${getStatusBadge(siswa.status)}</td>
        `;
        tbody.appendChild(row);
    });
}

// Load Daftar Tugas (filtered by class)
function loadDaftarTugas() {
    const tbody = document.getElementById('daftarTugasBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    // Filter by current kelas
    const filteredTugas = daftarTugasGuru.filter(tugas => tugas.kelas === currentKelas);
    
    if (filteredTugas.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="px-6 py-8 text-center text-gray-500">
                    Belum ada tugas untuk kelas ${currentKelas}
                </td>
            </tr>
        `;
        return;
    }
    
    filteredTugas.forEach((tugas, index) => {
        const row = document.createElement('tr');
        row.className = 'border-b border-gray-200 hover:bg-gray-50 transition-all';
        row.innerHTML = `
            <td class="px-6 py-4 text-gray-800">${index + 1}</td>
            <td class="px-6 py-4 text-gray-800"><span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">${tugas.kelas}</span></td>
            <td class="px-6 py-4 text-gray-800 font-medium">${tugas.mataPelajaran}</td>
            <td class="px-6 py-4 text-gray-800">${tugas.judul}</td>
            <td class="px-6 py-4 text-gray-600">${tugas.deskripsi}</td>
            <td class="px-6 py-4 text-gray-800">${tugas.deadline}</td>
        `;
        tbody.appendChild(row);
    });
}

// Handle Tugas Form Submit
document.addEventListener('DOMContentLoaded', function() {
    const tugasForm = document.getElementById('tugasForm');
    
    if (tugasForm) {
        tugasForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const mataPelajaran = document.getElementById('mataPelajaran').value;
            const judulTugas = document.getElementById('judulTugas').value;
            const deskripsiTugas = document.getElementById('deskripsiTugas').value;
            const deadline = document.getElementById('deadline').value;
            
            // Create new tugas object (with current kelas)
            const newTugas = {
                kelas: currentKelas,
                mataPelajaran: mataPelajaran,
                judul: judulTugas,
                deskripsi: deskripsiTugas,
                deadline: deadline
            };
            
            // Add to array
            daftarTugasGuru.push(newTugas);
            
            // Reload table
            loadDaftarTugas();
            
            // Reset form
            tugasForm.reset();
            
            // Show success alert
            alert('Tugas berhasil ditambahkan!');
        });
    }
    
    // Initialize tugasKelas field
    document.getElementById('tugasKelas').value = currentKelas;
    
    // Load initial data
    loadAbsensiSiswa();
    loadDaftarTugas();
});

// Export to Excel Function (with photos)
function exportToExcel() {
    // Refresh data
    const updatedData = getAbsensiData();
    const filteredData = updatedData.filter(siswa => siswa.kelas === currentKelas);
    
    if (filteredData.length === 0) {
        alert('Tidak ada data untuk diekspor!');
        return;
    }
    
    // Create workbook
    const wb = XLSX.utils.book_new();
    
    // Prepare data with image indicators
    const excelData = [
        ['No', 'Nama Siswa', 'Kelas', 'Tanggal', 'Waktu', 'Status', 'Foto']
    ];
    
    filteredData.forEach((siswa, index) => {
        excelData.push([
            index + 1,
            siswa.nama,
            siswa.kelas,
            siswa.tanggal,
            siswa.waktu,
            siswa.status,
            siswa.foto ? 'Ada Foto (lihat browser)' : 'Tidak ada foto'
        ]);
    });
    
    // Create worksheet
    const ws = XLSX.utils.aoa_to_sheet(excelData);
    
    // Set column widths
    ws['!cols'] = [
        { wch: 5 },  // No
        { wch: 20 }, // Nama
        { wch: 12 }, // Kelas
        { wch: 12 }, // Tanggal
        { wch: 10 }, // Waktu
        { wch: 10 }, // Status
        { wch: 30 }  // Foto
    ];
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, `Absensi ${currentKelas}`);
    
    // Generate filename
    const now = new Date();
    const kelasFormatted = currentKelas.replace(/\s+/g, '_');
    const filename = `Laporan_Absensi_${kelasFormatted}_${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}.xlsx`;
    
    // Save file
    XLSX.writeFile(wb, filename);
    
    // Show info message
    const photoCount = filteredData.filter(s => s.foto).length;
    alert(`Laporan absensi kelas ${currentKelas} berhasil diekspor!\n\nTotal siswa: ${filteredData.length}\nDengan foto: ${photoCount}\n\nCatatan: Foto dapat dilihat di dashboard website.`);
}
