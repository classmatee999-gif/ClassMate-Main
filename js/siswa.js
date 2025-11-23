checkAuth('siswa');

console.log("siswa.js loaded!");

let stream = null;
let photoTaken = false;
let currentFacingMode = 'user';

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM loaded, menjalankan fungsi...");
    try {
        loadTugasData();
        loadAbsensiHistory();
        updateCurrentTime();
        
        const today = new Date().toDateString();
        const lastAbsensiDate = localStorage.getItem('lastAbsensiDate');
         if (lastAbsensiDate === today) {
            disableAbsenButton();
            document.getElementById('absensiStatus').textContent = 'Anda sudah absen hari ini.';
            document.getElementById('absensiStatus').classList.remove("hidden");
        }
       
        
    } catch (e) {
        console.error("Terjadi error saat menjalankan fungsi:", e);
    }
});

const daftarTugas = [
    {
        mataPelajaran: 'Matematika',
        judul: 'Latihan Soal Aljabar',
        deskripsi: 'Kerjakan soal-soal aljabar pada halaman 45-50',
        deadline: '2025-07-20'
    },
    {
        mataPelajaran: 'Bahasa Indonesia',
        judul: 'Esai tentang Lingkungan',
        deskripsi: 'Buat esai minimal 500 kata tentang pentingnya menjaga lingkungan',
        deadline: '2025-07-18'
    },
    {
        mataPelajaran: 'Bahasa Inggris',
        judul: 'Reading Comprehension',
        deskripsi: 'Baca teks pada halaman 30 dan jawab pertanyaan',
        deadline: '2025-07-19'
    }
];


const riwayatAbsensi = [
    { tanggal: '2025-07-15', waktu: '07:15:00', status: 'Hadir', keterangan: 'Tepat waktu' },
    { tanggal: '2025-07-14', waktu: '07:20:00', status: 'Hadir', keterangan: 'Tepat waktu' },
    { tanggal: '2025-07-13', waktu: '07:10:00', status: 'Hadir', keterangan: 'Tepat waktu' },
    { tanggal: '2025-07-12', waktu: '-', status: 'Izin', keterangan: 'Sakit' },
    { tanggal: '2025-07-11', waktu: '07:30:00', status: 'Hadir', keterangan: 'Terlambat 15 menit' },
    { tanggal: '2025-07-10', waktu: '07:15:00', status: 'Hadir', keterangan: 'Tepat waktu' },
    { tanggal: '2025-07-09', waktu: '07:12:00', status: 'Hadir', keterangan: 'Tepat waktu' }
];


function updateCurrentTime() {
    const now = new Date();
    const timeElement = document.getElementById('currentTime');
    const dateElement = document.getElementById('currentDate');
    
    if (timeElement) {
        timeElement.textContent = formatTime(now);
    }
    
    if (dateElement) {
        dateElement.textContent = formatDateIndonesian(now);
    }
}


updateCurrentTime();
setInterval(updateCurrentTime, 1000);


function loadTugasData() {
    const tbody = document.getElementById('tugasTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    daftarTugas.forEach(tugas => {
        const row = document.createElement('tr');
        row.className = 'border-b border-gray-200 hover:bg-gray-50 transition-all';
        row.innerHTML = `
            <td class="px-6 py-4 text-gray-800 font-medium">${tugas.mataPelajaran}</td>
            <td class="px-6 py-4 text-gray-800">${tugas.judul}</td>
            <td class="px-6 py-4 text-gray-600">${tugas.deskripsi}</td>
            <td class="px-6 py-4 text-gray-800">${tugas.deadline}</td>
        `;
        tbody.appendChild(row);
    });
}


function loadAbsensiHistory() {
    const tbody = document.getElementById('absensiTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    riwayatAbsensi.forEach(absensi => {
        const row = document.createElement('tr');
        row.className = 'border-b border-gray-200 hover:bg-gray-50 transition-all';
        row.innerHTML = `
            <td class="px-6 py-4 text-gray-800">${absensi.tanggal}</td>
            <td class="px-6 py-4 text-gray-800">${absensi.waktu}</td>
            <td class="px-6 py-4">${getStatusBadge(absensi.status)}</td>
            <td class="px-6 py-4 text-gray-600">${absensi.keterangan}</td>
        `;
        tbody.appendChild(row);
    });
}


async function startCamera() {
    try {
        const video = document.getElementById('video');
        const startBtn = document.getElementById('startCameraBtn');
        const captureBtn = document.getElementById('captureBtn');
        const switchBtn = document.getElementById('switchCameraBtn');
        
        
        stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
                width: { ideal: 1280 },
                height: { ideal: 720 },
                facingMode: currentFacingMode
            } 
        });
        
        video.srcObject = stream;
        video.style.display = 'block';
        
        startBtn.classList.add('hidden');
        captureBtn.classList.remove('hidden');
        switchBtn.classList.remove('hidden');
        
    } catch (error) {
        console.error('Error accessing camera:', error);
        alert('Tidak dapat mengakses kamera. Pastikan Anda memberikan izin akses kamera.');
    }
}

function switchCamera() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null; 
    }
    currentFacingMode = (currentFacingMode === 'user') ? 'environment' : 'user';
    startCamera();
}

function capturePhoto() {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const capturedPhoto = document.getElementById('capturedPhoto');
    const captureBtn = document.getElementById('captureBtn');
    const retakeBtn = document.getElementById('retakeBtn');
    const absenButton = document.getElementById('absenButton');
    const switchBtn = document.getElementById('switchCameraBtn');
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    
    const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
    capturedPhoto.src = imageDataUrl;
    
    
    video.style.display = 'none';
    capturedPhoto.style.display = 'block';
    
    
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
    
    
    captureBtn.classList.add('hidden');
    retakeBtn.classList.remove('hidden');
    switchBtn.classList.add('hidden');
    
    absenButton.disabled = false;
    absenButton.textContent = 'Absen Sekarang';
    absenButton.classList.remove('bg-gray-400', 'cursor-not-allowed');
    absenButton.classList.add('bg-blue-500', 'hover:bg-blue-600');
    
    photoTaken = true;
}


function retakePhoto() {
    const video = document.getElementById('video');
    const capturedPhoto = document.getElementById('capturedPhoto');
    const retakeBtn = document.getElementById('retakeBtn');
    const startBtn = document.getElementById('startCameraBtn');
    const absenButton = document.getElementById('absenButton');
    const switchBtn = document.getElementById('switchCameraBtn');
    
    capturedPhoto.style.display = 'none';
    retakeBtn.classList.add('hidden');
    startBtn.classList.remove('hidden');
    switchBtn.classList.add('hidden');
    
    absenButton.disabled = true;
    absenButton.textContent = 'Ambil Foto Dulu untuk Absen';
    absenButton.classList.add('bg-gray-400', 'cursor-not-allowed');
    absenButton.classList.remove('bg-blue-500', 'hover:bg-blue-600');
    
    photoTaken = false;
}

function toggleKeterangan() {
    const status = document.querySelector('input[name="status"]:checked').value;
    const keteranganContainer = document.getElementById("keteranganContainer");

    if (status === "Izin") {
      keteranganContainer.style.display = "block"; 
    } else {
      keteranganContainer.style.display = "none"; 
      document.getElementById("keterangan").value = ""; 
    }
  } 

function tandaiAlpa() {
    const now = new Date();
    const newAbsensi = {
        tanggal: now.toISOString().split('T')[0],
        waktu: formatTime(now),
        status: 'Alpa',
        keterangan: 'Otomatis dicatat karena absen setelah jam 08:00'
    };
    
    
    riwayatAbsensi.unshift(newAbsensi);
    loadAbsensiHistory();

    
    const absensiStatus = document.getElementById('absensiStatus');
    absensiStatus.textContent = '❌ Absensi Gagal! Sudah lewat jam 08:00, Anda dicatat Alpa.';
    absensiStatus.classList.remove('hidden');
    absensiStatus.classList.add('slide-down');
    
    
    const absenButton = document.getElementById('absenButton');
    if (absenButton) {
        absenButton.disabled = true;
        absenButton.textContent = 'Sudah Dicatat Alpa Hari Ini';
        absenButton.classList.remove('bg-blue-500', 'hover:bg-blue-600');
        absenButton.classList.add('bg-gray-400', 'cursor-not-allowed');
    }

    alert('Absensi Gagal. Sudah dicatat Alpa secara otomatis.');
}


const sekolahLocation = {
  latitude: -7.65363, 
  longitude: 109.6636 
};


function hitungJarak(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}


function tampilkanPeta(lat, lon, jarak) {
  const mapContainer = document.getElementById("mapContainer");
  if (!mapContainer) return;

  
  const mapSrc = `https://www.google.com/maps?q=${lat},${lon}&z=17&output=embed`;

  mapContainer.innerHTML = `
    <h3 class="font-semibold mt-3 text-gray-800">📍 Lokasi Anda Saat Ini</h3>
    <p>Jarak dari sekolah: <b>${Math.round(jarak)} meter</b></p>
    <iframe
      width="100%"
      height="250"
      style="border:0; border-radius:12px; margin-top:8px;"
      loading="lazy"
      allowfullscreen
      src="${mapSrc}">
    </iframe>
  `;
}

function lanjutkanAbsensi(now, hour, minute, status, photo, keterangan = "") {
    const waktu = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00`;

    // ------------------------------------------------------------------
    // ✅ LOGIKA BARU UNTUK KETERANGAN
    let finalKeterangan = keterangan;

    if (status === "Izin") {
        // Jika status Izin, gunakan input user (keterangan), jika kosong gunakan "Izin diberikan"
        finalKeterangan = keterangan || "Izin diberikan"; 
    } else if (status === "Hadir") {
        // Jika status Hadir, gunakan keterangan yang didapat dari kalkulasi (terlambat), jika kosong gunakan "Tepat waktu"
        finalKeterangan = keterangan || "Tepat waktu"; 
    }
    // ------------------------------------------------------------------

    const newAbsensi = {
        tanggal: now.toISOString().split('T')[0],
        waktu,
        status,
        keterangan: finalKeterangan // Menggunakan hasil perhitungan yang sudah disederhanakan
    };

    riwayatAbsensi.unshift(newAbsensi);
    loadAbsensiHistory();

    const absensiStatus = document.getElementById("absensiStatus");
    absensiStatus.textContent = `✅ Absensi ${status} berhasil! (${newAbsensi.keterangan})`;
    absensiStatus.classList.remove("hidden");
    absensiStatus.classList.add("slide-down");
    
    // ------------------------------------------------------------------
    // ✅ LOGIKA PENYIMPANAN ABSENSI BERHASIL DI SINI ✅
     const today = new Date().toDateString();
      localStorage.setItem('lastAbsensiDate', today);
    
    // Nonaktifkan tombol absensi setelah berhasil
     disableAbsenButton();
    // ------------------------------------------------------------------
}

function doAbsensi() {
  const now = new Date();
  const minute = now.getMinutes();
  const hour = now.getHours();

  const selectedStatus = (document.querySelector('input[name="status"]:checked') || {}).value || 'Hadir';
  const capturedPhoto = document.getElementById('capturedPhoto');
  const photoData = capturedPhoto ? capturedPhoto.src : null;
  const today = new Date().toDateString(); // Contoh: "Wed Nov 19 2025"
  const lastAbsensiDate = localStorage.getItem('lastAbsensiDate');

  if (lastAbsensiDate === today) {
        alert("Anda sudah melakukan absensi hari ini. Tidak perlu absen lagi.");
        // Opsional: Nonaktifkan tombol Absen setelah ini
        disableAbsenButton(); 
        return; // Hentikan fungsi
    }
    // ------------------------------------------------------------------

  
  if (!photoTaken && selectedStatus === 'Hadir') {
    alert('Silakan ambil foto terlebih dahulu untuk absen hadir!');
    return;
  }

  
  const keteranganInput = document.getElementById('keterangan');
  const keteranganValue = keteranganInput.value;

  if (selectedStatus === 'Izin') {
    lanjutkanAbsensi(now, hour, minute, selectedStatus, photoData, keteranganValue);
    return;
  } 

  
 if (hour >= 8) {
     tandaiAlpa();
     return;
   }

  
  if (hour >= 6 && hour < 8) {
    if (!navigator.geolocation) {
      alert('Perangkat Anda tidak mendukung GPS.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userLat = pos.coords.latitude;
        const userLon = pos.coords.longitude;
        const jarak = hitungJarak(userLat, userLon, sekolahLocation.latitude, sekolahLocation.longitude);

        
        tampilkanPeta(userLat, userLon, jarak);

        const batasJarak = 100000; 
        if (jarak > batasJarak) {
          alert('Anda terlalu jauh dari sekolah. Absensi Hadir tidak bisa dilakukan.');
          return;
        }

        
        const jamMasuk = 7 * 60; 
        const waktuAbsen = hour * 60 + minute;
        const selisih = waktuAbsen - jamMasuk;

        let keterangan = "Tepat waktu";
        if (selisih > 0) {
          keterangan = `Terlambat ${selisih} menit`;
        }

        lanjutkanAbsensi(now, hour, minute, selectedStatus, photoData, keterangan);
      },
      (error) => {
        alert('Gagal mendapatkan lokasi. Pastikan GPS aktif dan izinkan akses lokasi.');
        console.error(error);
      }
    );
  } else {
    alert('Absensi hanya bisa dilakukan antara jam 06:00 - 08:00.');
  }
  
}
