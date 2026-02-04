export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  joinDate: string;
  status: 'active' | 'inactive';
}

export interface CreateEmployeeRequest {
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  joinDate: string;
}

export interface ImportEmployeeRequest {
  employees: CreateEmployeeRequest[];
}