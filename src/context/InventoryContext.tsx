
import React, { createContext, useContext, useState, useEffect } from 'react';
import { InventoryContextType, Ferragem, Retirada, Projeto } from '../types';
import { toast } from '@/hooks/use-toast';

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

// Dados iniciais para demonstração
const initialFerragens: Ferragem[] = [
  { id: '1', tipo: 'Dobradiça', marca: 'Hafele', quantidade: 2, categoria: 'Ferragens' },
  { id: '2', tipo: 'Corrediça', marca: 'Blum', quantidade: 8, categoria: 'Ferragens' },
  { id: '3', tipo: 'Puxador', marca: 'Tramontina', quantidade: 1, categoria: 'Ferragens' },
  { id: '4', tipo: 'Fechadura', marca: 'Stam', quantidade: 15, categoria: 'Ferragens' },
  { id: '5', tipo: 'Parafuso', marca: 'Wurth', quantidade: 50, categoria: 'Ferragens' },
];

const initialRetiradas: Retirada[] = [
  {
    id: '1',
    ferragemId: '1',
    ferragem: initialFerragens[0],
    quantidade: 4,
    cliente: 'João Silva',
    data: '2024-06-10',
    responsavel: 'Carlos Santos'
  },
  {
    id: '2',
    ferragemId: '2',
    ferragem: initialFerragens[1],
    quantidade: 2,
    cliente: 'Maria Oliveira',
    data: '2024-06-09',
    responsavel: 'Pedro Lima'
  },
];

const initialProjetos: Projeto[] = [
  {
    id: '1',
    nomeCliente: 'João Silva',
    marceneiroResponsavel: 'Carlos Santos',
    status: 'Em andamento',
    materiaisUsados: [
      { ferragemId: '1', quantidade: 4, ferragem: initialFerragens[0] },
      { ferragemId: '2', quantidade: 2, ferragem: initialFerragens[1] },
    ],
    dataCriacao: '2024-06-01',
    dataAtualizacao: '2024-06-10'
  },
  {
    id: '2',
    nomeCliente: 'Maria Oliveira',
    marceneiroResponsavel: 'Pedro Lima',
    status: 'Finalizado',
    materiaisUsados: [
      { ferragemId: '3', quantidade: 6, ferragem: initialFerragens[2] },
    ],
    dataCriacao: '2024-05-15',
    dataAtualizacao: '2024-06-05'
  },
];

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ferragens, setFerragens] = useState<Ferragem[]>(initialFerragens);
  const [retiradas, setRetiradas] = useState<Retirada[]>(initialRetiradas);
  const [projetos, setProjetos] = useState<Projeto[]>(initialProjetos);

  const addFerragem = (ferragem: Omit<Ferragem, 'id'>) => {
    const newFerragem = { ...ferragem, id: Date.now().toString() };
    setFerragens(prev => [...prev, newFerragem]);
    toast({
      title: "Ferragem adicionada",
      description: `${ferragem.tipo} - ${ferragem.marca} foi adicionada ao inventário.`,
    });
  };

  const updateFerragem = (id: string, updates: Partial<Ferragem>) => {
    setFerragens(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
    toast({
      title: "Ferragem atualizada",
      description: "As informações da ferragem foram atualizadas com sucesso.",
    });
  };

  const deleteFerragem = (id: string) => {
    setFerragens(prev => prev.filter(f => f.id !== id));
    toast({
      title: "Ferragem removida",
      description: "A ferragem foi removida do inventário.",
      variant: "destructive",
    });
  };

  const addRetirada = (retirada: Omit<Retirada, 'id' | 'ferragem'>) => {
    const ferragem = ferragens.find(f => f.id === retirada.ferragemId);
    if (!ferragem) {
      toast({
        title: "Erro",
        description: "Ferragem não encontrada.",
        variant: "destructive",
      });
      return;
    }

    if (ferragem.quantidade < retirada.quantidade) {
      toast({
        title: "Estoque insuficiente",
        description: "Não há quantidade suficiente em estoque para esta retirada.",
        variant: "destructive",
      });
      return;
    }

    const newRetirada = { 
      ...retirada, 
      id: Date.now().toString(),
      ferragem: ferragem
    };
    
    setRetiradas(prev => [...prev, newRetirada]);
    
    // Atualizar estoque
    setFerragens(prev => prev.map(f => 
      f.id === retirada.ferragemId 
        ? { ...f, quantidade: f.quantidade - retirada.quantidade }
        : f
    ));

    toast({
      title: "Retirada registrada",
      description: `${retirada.quantidade} unidades de ${ferragem.tipo} retiradas do estoque.`,
    });
  };

  const addProjeto = (projeto: Omit<Projeto, 'id' | 'dataCriacao' | 'dataAtualizacao'>) => {
    const now = new Date().toISOString().split('T')[0];
    const newProjeto = { 
      ...projeto, 
      id: Date.now().toString(),
      dataCriacao: now,
      dataAtualizacao: now
    };
    setProjetos(prev => [...prev, newProjeto]);
    toast({
      title: "Projeto criado",
      description: `Projeto para ${projeto.nomeCliente} foi criado com sucesso.`,
    });
  };

  const updateProjeto = (id: string, updates: Partial<Projeto>) => {
    const now = new Date().toISOString().split('T')[0];
    setProjetos(prev => prev.map(p => 
      p.id === id 
        ? { ...p, ...updates, dataAtualizacao: now }
        : p
    ));
    toast({
      title: "Projeto atualizado",
      description: "As informações do projeto foram atualizadas com sucesso.",
    });
  };

  const deleteProjeto = (id: string) => {
    setProjetos(prev => prev.filter(p => p.id !== id));
    toast({
      title: "Projeto removido",
      description: "O projeto foi removido com sucesso.",
      variant: "destructive",
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
