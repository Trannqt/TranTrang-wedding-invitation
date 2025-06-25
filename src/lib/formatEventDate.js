/**
 * Formats a date string into Indonesian format
 * @param {string} isoString - The ISO date string to format
 * @param {('full'|'short'|'time')} [format='full'] - The format type to use
 * @returns {string} The formatted date string in Indonesian
 * 
 * @example
 * // returns "Senin, 1 Januari 2024"
 * formatEventDate("2024-01-01T00:00:00.000Z", "full")
 * 
 * // returns "1 Januari 2024"
 * formatEventDate("2024-01-01T00:00:00.000Z", "short")
 * 
 * // returns "00:00"
 * formatEventDate("2024-01-01T00:00:00.000Z", "time")
 */
export const formatEventDate = (isoString, format = 'short') => {
    const date = new Date(isoString);

    const formats = {
        full: {
            weekday: 'long',
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            timeZone: 'Asia/Ho_Chi_Minh'
        },
        short: {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
            timeZone: 'Asia/Ho_Chi_Minh'
        },
        time: {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
            timeZone: 'Asia/Ho_Chi_Minh'
        }
    };

    // Indonesian month names mapping
    const monthsIndonesian = {
        'January': 'Januari',
        'February': 'Februari',
        'March': 'Maret',
        'April': 'April',
        'May': 'Mei',
        'June': 'Juni',
        'July': 'Juli',
        'August': 'Agustus',
        'September': 'September',
        'October': 'Oktober',
        'November': 'November',
        'December': 'Desember'
    };

    // Indonesian day names mapping
    const daysIndonesian = {
        'Sunday': 'Minggu',
        'Monday': 'Senin',
        'Tuesday': 'Selasa',
        'Wednesday': 'Rabu',
        'Thursday': 'Kamis',
        'Friday': 'Jumat',
        'Saturday': 'Sabtu'
    };

    let formatted = date.toLocaleDateString('vi-VN', formats[format]);

    // Handle time format separately
    if (format === 'time') {
        return date.toLocaleTimeString('vi-VN', formats[format]);
    }

    // Replace English month and day names with Indonesian ones
    Object.keys(monthsIndonesian).forEach(english => {
        formatted = formatted.replace(english, monthsIndonesian[english]);
    });

    Object.keys(daysIndonesian).forEach(english => {
        formatted = formatted.replace(english, daysIndonesian[english]);
    });

    // Format adjustment for full date
    if (format === 'full') {
        // Convert "Hari, Tanggal Bulan Tahun" format
        const parts = formatted.split(', ');
        if (parts.length === 2) {
            formatted = `${parts[0]}, ${parts[1]}`;
        }
    }

    return formatted;
};

export const formatDayOfWeek = (isoDateString) => {
  const date = new Date(isoDateString);
  const options = { weekday: 'long' }; // 'long' cho Thứ Hai, 'short' cho T2
  return date.toLocaleDateString('vi-VN', options);
};

//kết hợp cả ngày và thứ nếu cần trong các trường hợp khác
export const formatFullDateWithDay = (isoDateString) => {
  const date = new Date(isoDateString);
  const options = { weekday: 'long', day: 'numeric', month: 'numeric', year: 'numeric' };
  return date.toLocaleDateString('vi-VN', options);
};