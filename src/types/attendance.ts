export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  checkInTime: string;
  checkOutTime?: string;
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  photos: {
    checkIn?: string;
    checkOut?: string;
  };
  status: 'present' | 'late' | 'absent' | 'partial';
  workingHours?: number;
  date: string;
}

export interface AttendanceFilters {
  employeeId?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
}