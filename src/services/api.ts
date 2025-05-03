import { toast } from "sonner";

const API_BASE_URL = 'http://127.0.0.1:8000';

export type LoginCredentials = {
  username: string;
  password: string;
};

export type Token = {
  access_token: string;
  token_type: string;
};

export type Member = {
  id: number;
  nome: string;
  cargo: string;
  descricao: string;
  username: string;
  senha?: string;
  foto_perfil: string;
  twitter: string;
  facebook: string;
  email: string;
  created_at: string;
  updated_at: string;
};

export type Publication = {
  id: number;
  titulo: string;
  conteudo: string;
  categoria: string;
  fotos: string[];
  autor_id: number;
  created_at: string;
  updated_at: string;
};

export type Subscriber = {
  id: number;
  email: string;
  created_at: string;
};

export type Category = {
  id: number;
  nome: string;
  created_at: string;
  updated_at: string;
};

export const login = async (credentials: LoginCredentials): Promise<Token> => {
  try {
    const formData = new URLSearchParams();
    formData.append('grant_type', 'password');
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);
    formData.append('client_id', 'string');
    formData.append('client_secret', 'string');

    const response = await fetch(`${API_BASE_URL}/token`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      throw new Error('Authentication failed');
    }

    const data = await response.json();
    // Store token in localStorage
    localStorage.setItem('token', data.access_token);
    localStorage.setItem('token_type', data.token_type);
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('token_type');
};

export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }
  return {
    'Authorization': `Bearer ${token}`,
    'accept': 'application/json',
  };
};

export const getMembers = async (): Promise<Member[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/membros/?skip=0&limit=100`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch members');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching members:', error);
    throw error;
  }
};

export const deleteMember = async (id: number): Promise<{ message: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/membros/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete member');
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting member:', error);
    throw error;
  }
};

export const updateMember = async (id: number, formData: FormData): Promise<Member> => {
  try {
    const response = await fetch(`${API_BASE_URL}/membros/${id}`, {
      method: 'PUT',
      headers: {
        ...getAuthHeaders(),
        // Content-Type is set automatically when using FormData
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to update member');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating member:', error);
    throw error;
  }
};

export const uploadProfilePhoto = async (file: File): Promise<{ foto_url: string }> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/membros/foto/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload profile photo');
    }

    return await response.json();
  } catch (error) {
    console.error('Error uploading photo:', error);
    throw error;
  }
};

export const getPublications = async (): Promise<Publication[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/publicacoes/?skip=0&limit=100`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch publications');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching publications:', error);
    throw error;
  }
};

export const createPublication = async (formData: FormData): Promise<Publication> => {
  try {
    const response = await fetch(`${API_BASE_URL}/publicacoes/`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        // Content-Type is set automatically when using FormData
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to create publication');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating publication:', error);
    throw error;
  }
};

export const updatePublication = async (id: number, formData: FormData): Promise<Publication> => {
  try {
    const response = await fetch(`${API_BASE_URL}/publicacoes/${id}`, {
      method: 'PUT',
      headers: {
        ...getAuthHeaders(),
        // Content-Type is set automatically when using FormData
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to update publication');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating publication:', error);
    throw error;
  }
};

export const deletePublication = async (id: number): Promise<{ message: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/publicacoes/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete publication');
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting publication:', error);
    throw error;
  }
};

export const uploadPublicationPhoto = async (file: File): Promise<{ foto_url: string }> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/publicacoes/fotos/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload publication photo');
    }

    return await response.json();
  } catch (error) {
    console.error('Error uploading photo:', error);
    throw error;
  }
};

export const getSubscribers = async (): Promise<Subscriber[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/subscribers/?skip=0&limit=100`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch subscribers');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    throw error;
  }
};

export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/categorias/?skip=0&limit=100`, {
      headers: {
        'accept': 'application/json'
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};
