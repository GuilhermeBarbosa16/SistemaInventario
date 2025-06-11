
export interface Ferragem {
  id: string;
  tipo: string;
  marca: string;
  quantidade: number;
  categoria: string;
}

export interface Retirada {
  id: string;
  ferragemId: string;
  ferragem: Ferragem;
  quantidade: number;
  cliente: string;
  data: string;
  responsavel: string;
}

export interface Projeto {
  id: string;
  nomeCliente: string;
  marceneiroResponsavel: string;
  status: 'Em andamento' | 'Finalizado' | 'Aguardando materiais' | 'Pausado' | 'Cancelado';
  materiaisUsados: {
    ferragemId: string;
    quantidade: number;
    ferragem: Ferragem;
  }[];
  dataCriacao: string;
  dataAtualizacao: string;
}

export interface InventoryContextType {
  ferragens: Ferragem[];
  retiradas: Retirada[];
  projetos: Projeto[];
  addFerragem: (ferragem: Omit<Ferragem, 'id'>) => void;
  updateFerragem: (id: string, ferragem: Partial<Ferragem>) => void;
  deleteFerragem: (id: string) => void;
  addRetirada: (retirada: Omit<Retirada, 'id' | 'ferragem'>) => void;
  addProjeto: (projeto: Omit<Projeto, 'id' | 'dataCriacao' | 'dataAtualizacao'>) => void;
  updateProjeto: (id: string, projeto: Partial<Projeto>) => void;
  deleteProjeto: (id: string) => void;
}
