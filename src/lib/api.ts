const API_BASE_URL = 'http://localhost:8000/api/v1';

interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
}

interface AuthData {
  user: User;
  token: string;
  token_type: string;
}

interface ApiResponse<T = unknown> {
  status: 'success' | 'error';
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}

class ApiService {
  private baseURL: string;
  private token: string | null;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('auth_token');
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: this.getHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro na requisição');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Métodos de autenticação
  async login(email: string, password: string) {
    const response = await this.request<AuthData>('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.data?.token) {
      this.token = response.data.token;
      localStorage.setItem('auth_token', this.token);
    }

    return response;
  }

  async register(name: string, email: string, password: string, password_confirmation: string) {
    const response = await this.request<AuthData>('/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, password_confirmation }),
    });

    if (response.data?.token) {
      this.token = response.data.token;
      localStorage.setItem('auth_token', this.token);
    }

    return response;
  }

  async logout() {
    try {
      await this.request('/logout', {
        method: 'POST',
      });
    } finally {
      this.token = null;
      localStorage.removeItem('auth_token');
    }
  }

  async getUserProfile() {
    return this.request<{ user: User }>('/user/profile');
  }

  // Rota de teste
  async healthCheck() {
    return this.request<{ timestamp: string }>('/health');
  }

  // Método para verificar se o usuário está autenticado
  isAuthenticated(): boolean {
    return !!this.token;
  }

  // Método para obter o token atual
  getToken(): string | null {
    return this.token;
  }

  // Criar movimentação de estoque
  async createStockMovement(data: any) {
    return this.request('/stock-movements', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Buscar movimentações de estoque
  async getStockMovements() {
    return this.request('/stock-movements', { method: 'GET' });
  }

  // Criar movimentação de ferramenta
  async createToolMovement(data: any) {
    return this.request('/tool-movements', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Buscar movimentações de ferramentas
  async getToolMovements() {
    return this.request('/tool-movements', { method: 'GET' });
  }

  // Buscar ferramentas/ferragens
  async getTools() {
    return this.request('/tools', { method: 'GET' });
  }

  // Criar ferramenta/ferragem
  async createTool(data: any) {
    return this.request('/tools', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Criar projeto
  async createProject(data: any) {
    return this.request('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Buscar projetos
  async getProjects() {
    return this.request('/projects', { method: 'GET' });
  }
}

export const apiService = new ApiService();
export default apiService; 