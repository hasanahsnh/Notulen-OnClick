document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('notulenForm');
    const textarea = document.getElementById('notulenInput');
    const resultSection = document.getElementById('resultSection');
    const resultContent = document.getElementById('resultContent');
    const submitButton = document.getElementById('submitBtn');

    let response,
        result,
        isSubmitting = false;

    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        // Cek apakah sudah dalam proses pengiriman
        if (isSubmitting) return;
        isSubmitting = true;

        // Validasi input
        if (!textarea.value) {
            alert('Silakan masukkan notulen Anda terlebih dahulu.');
            isSubmitting = false;
            return;
        }

        // Menonaktifkan tombol submit untuk mencegah pengiriman ganda
        submitButton.disabled = true;
        submitButton.classList.add('opacity-50', 'cursor-not-allowed');
        submitButton.style.pointerEvents = 'none';

        // Reset hasil sebelumnya
        resultContent.textContent = '';
        resultSection.classList.add('hidden');

        try {
            // Mengirim notulen ke server untuk mendapatkan rangkuman
            response = await fetch('/api/rangkuman', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ notulen: textarea.value })
            });

            // Memeriksa apakah respons berhasil
            result = await response.json();

            // Menampilkan hasil rangkuman
            if (response.ok) {
                resultSection.classList.remove('hidden');
                resultContent.textContent = '';
                await typeEffect(result.rangkuman, resultContent, 20);
            } else {
                throw new Error('Network response was not ok');
            }

        } catch (error) {
            console.error('Error:', error);
            alert('Terjadi kesalahan saat memproses notulen.');
            // Mengaktifkan tombol submit setelah terjadi kesalahan
            submitButton.disabled = false;
            submitButton.classList.remove('opacity-50', 'cursor-not-allowed');
            submitButton.style.pointerEvents = 'auto';
            // Menampilkan pesan kesalahan
            resultContent.textContent = 'Gagal mendapatkan rangkuman. Silakan coba lagi.';
        }

        // Mengaktifkan tombol submit setelah selesai
        isSubmitting = false;
        submitButton.disabled = false;
        submitButton.classList.remove('opacity-50', 'cursor-not-allowed');
        submitButton.style.pointerEvents = 'auto';
    });

    // 4 parameters
    function typeEffect(text, element, speed = 20) {
        return new Promise((resolve) => {
            element.innerHTML = ''; // Clear previous content
            if (!text) {
                resolve();
                return;
            }
            
            let index = 0;

            function type() {
                if (index < text.length) {
                    element.innerHTML += text.charAt(index);
                    index++;
                    setTimeout(type, speed);
                } else {
                    resolve();
                }
            }

            type();
        });
    }

    submitButton.addEventListener('click', function (e) {
        if (submitButton.disabled) {
            e.preventDefault();
            e.stopPropagation();
        }
    });
});