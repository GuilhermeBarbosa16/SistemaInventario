import React, { createContext, useContext, useState, useEffect } from 'react';
import { InventoryContextType, Ferragem, Retirada, Projeto } from '../types';
import { toast } from '@/hooks/use-toast';
import apiService from '@/lib/api';

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ferragens, setFerragens] = useState<Ferragem[]>([]);
  const [retiradas, setRetiradas] = useState<Retirada[]>([]);
  const [projetos, setProjetos] = useState<Projeto[]>([]);

  // Buscar histórico real de retiradas
  const fetchRetiradas = async () => {
    try {
      const response = await apiService.getToolMovements();
      if (response.status === 'success' && response.data) {
        // Mapeia cada retirada para garantir que tenha o campo ferragem
        const mapped = (response.data as any[]).map((r) => ({
          ...r,
          ferragem: r.tool,
          quantidade: r.quantity,
          data: r.data || r.created_at,
        }));
        setRetiradas(mapped);
      }
    } catch (error) {
      toast({
        title: 'Erro ao carregar histórico',
        description: 'Não foi possível buscar o histórico de retiradas.',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    const fetchFerragens = async () => {
      try {
        const response = await apiService.getTools();
        if (response.status === 'success' && response.data) {
          setFerragens(response.data as Ferragem[]);
        }
      } catch (error) {
        toast({
          title: 'Erro ao carregar ferragens',
          description: 'Não foi possível buscar as ferragens do servidor.',
          variant: 'destructive',
        });
      }
    };
    const fetchProjetos = async () => {
      try {
        const response = await apiService.getProjects();
        if (response.status === 'success' && response.data) {
          setProjetos(response.data as Projeto[]);
        }
      } catch (error) {
        toast({
          title: 'Erro ao carregar projetos',
          description: 'Não foi possível buscar os projetos do servidor.',
          variant: 'destructive',
        });
      }
    };
    fetchFerragens();
    fetchProjetos();
    fetchRetiradas();
  }, []);

  const addFerragem = async (ferragem: Omit<Ferragem, 'id'>) => {
    try {
      const response = await apiService.createTool(ferragem);
      if (response.status === 'success' && response.data) {
        setFerragens(prev => [...prev, response.data as Ferragem]);
        const ferragemData = response.data as Ferragem;
        toast({
          title: "Ferragem adicionada",
          description: `${ferragemData.tipo} - ${ferragemData.marca} foi adicionada ao estoque.`,
        });
      } else {
        throw new Error(response.message || 'Erro ao cadastrar ferragem');
      }
    } catch (error: any) {
      toast({
        title: "Erro ao cadastrar ferragem",
        description: error?.message || "Erro desconhecido",
        variant: "destructive",
      });
    }
  };

  const updateFerragem = (id: string, updates: Partial<Ferragem>) => {
    toast({
      title: 'Funcionalidade não implementada',
      description: 'Adicione a integração com a API para atualizar ferragens.',
      variant: 'destructive',
    });
  };

  const deleteFerragem = (id: string) => {
    toast({
      title: 'Funcionalidade não implementada',
      description: 'Adicione a integração com a API para remover ferragens.',
      variant: 'destructive',
    });
  };

  // Registrar retirada via API e atualizar estoque/histórico
  const addRetirada = async (retirada: Omit<Retirada, 'id' | 'ferragem'>) => {
    try {
      const response = await apiService.createToolMovement({
        tool_id: retirada.ferragemId,
        type: 'saida',
        quantity: retirada.quantidade,
        data: retirada.data,
        cliente: retirada.cliente,
        responsavel: retirada.responsavel,
      });
      if (response.status === 'success') {
        toast({
          title: 'Retirada registrada',
          description: 'A retirada foi registrada com sucesso.',
        });
        // Atualiza o estoque e o histórico
        const ferragensResp = await apiService.getTools();
        if (ferragensResp.status === 'success' && ferragensResp.data) {
          setFerragens(ferragensResp.data as Ferragem[]);
        }
        fetchRetiradas();
      } else {
        throw new Error(response.message || 'Erro ao registrar retirada');
      }
    } catch (error: any) {
      toast({
        title: 'Erro ao registrar retirada',
        description: error?.message || 'Erro desconhecido',
        variant: 'destructive',
      });
    }
  };

  const addProjeto = async (projeto: Omit<Projeto, 'id' | 'dataCriacao' | 'dataAtualizacao'>) => {
    try {
      const response = await apiService.createProject(projeto);
      if (response.status === 'success' && response.data) {
        setProjetos(prev => [...prev, response.data as Projeto]);
        toast({
          title: "Projeto criado",
          description: "Projeto criado com sucesso!",
        });
      } else {
        throw new Error(response.message || 'Erro ao criar projeto');
      }
    } catch (error: any) {
      toast({
        title: "Erro ao criar projeto",
        description: error?.message || "Erro desconhecido",
        variant: "destructive",
      });
    }
  };

  const updateProjeto = (id: string, updates: Partial<Projeto>) => {
    toast({
      title: 'Funcionalidade não implementada',
      description: 'Adicione a integração com a API para atualizar projetos.',
      variant: 'destructive',
    });
  };

  const deleteProjeto = (id: string) => {
    toast({
      title: 'Funcionalidade não implementada',
      description: 'Adicione a integração com a API para remover projetos.',
      variant: 'destructive',
    });
  };

  return (
    <InventoryContext.Provider value={{
      ferragens,
      retiradas,
      projetos,
      addFerragem,
      updateFerragem,
      deleteFerragem,
      addRetirada,
      addProjeto,
      updateProjeto,
      deleteProjeto,
    }}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};
