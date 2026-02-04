export interface Employee {
  id: number;
  username: string;
  email: string;
  name: string;
  role: string;
  employeeId?: string;
  employeeCode?: string;
  status: string; // 'A' for Active, 'I' for Inactive
  startActiveDate?: string;
  areaCode?: string;
  territoryCode?: string;
  type?: string;
  source?: string;
  country?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmployeeRequest {
  username: string;
  email: string;
  name: string;
  password: string;
  role?: string;
  employeeId?: string;
  employeeCode?: string;
  status?: string;
  startActiveDate?: string;
  areaCode?: string;
  territoryCode?: string;
  type?: string;
  source?: string;
  country?: string;
  isActive?: boolean;
}

export interface UpdateEmployeeRequest {
  username?: string;
  email?: string;
  name?: string;
  role?: string;
  employeeId?: string;
  employeeCode?: string;
  status?: string;
  startActiveDate?: string;
  areaCode?: string;
  territoryCode?: string;
  type?: string;
  source?: string;
  country?: string;
  isActive?: boolean;
}

export interface ImportEmployeeRequest {
  users: CreateEmployeeRequest[];
}