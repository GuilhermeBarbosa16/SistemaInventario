import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, FolderOpen, User, Calendar, Edit, Trash2, Package } from 'lucide-react';
import { Projeto, Ferragem } from '../types';

const statusOptions = [
  'Em andamento',
  'Finalizado',
  'Aguardando materiais',
  'Pausado',
  'Cancelado'
] as const;

type StatusType = typeof statusOptions[number];

export const Projetos: React.FC = () => {
  const { projetos, addProjeto, updateProjeto, deleteProjeto, retiradas } = useInventory();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProjeto, setEditingProjeto] = useState<Projeto | null>(null);
  const [formData, setFormData] = useState({
    nomeCliente: '',
    marceneiroResponsavel: '',
    status: 'Em andamento' as StatusType,
    materiaisUsados: [] as Array<{
      ferragemId: string;
      quantidade: number;
      ferragem: Ferragem;
    }>
  });

  const filteredProjetos = projetos.filter(projeto => {
    const matchesSearch = 
      projeto.nomeCliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      projeto.marceneiroResponsavel.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || statusFilter === 'all' || projeto.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Em andamento': return 'bg-blue-100 text-blue-800';
      case 'Finalizado': return 'bg-green-100 text-green-800';
      case 'Aguardando materiais': return 'bg-yellow-100 text-yellow-800';
      case 'Pausado': return 'bg-gray-100 text-gray-800';
      case 'Cancelado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMateriaisUsadosByCliente = (nomeCliente: string) => {
    const retiradasCliente = retiradas.filter(r => r.cliente === nomeCliente);
    const materiaisMap = new Map();
    
    retiradasCliente.forEach(retirada => {
      const key = `${retirada.ferragem.tipo}-${retirada.ferragem.marca}`;
      if (materiaisMap.has(key)) {
        materiaisMap.set(key, {
          ...materiaisMap.get(key),
          quantidade: materiaisMap.get(key).quantidade + retirada.quantidade
        });
      } else {
        materiaisMap.set(key, {
          ferragem: retirada.ferragem,
          quantidade: retirada.quantidade
        });
      }
    });
    
    return Array.from(materiaisMap.values());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const materiaisUsados = getMateriaisUsadosByCliente(formData.nomeCliente);
    addProjeto({
      ...formData,
      materiaisUsados: materiaisUsados.map(m => ({
        ferragemId: m.ferragem.id,
        quantidade: m.quantidade,
        ferragem: m.ferragem
      }))
    });
    setFormData({
      nomeCliente: '',
      marceneiroResponsavel: '',
      status: 'Em andamento',
      materiaisUsados: []
    });
    setIsAddModalOpen(false);
  };

  const handleEdit = (projeto: Projeto) => {
    setEditingProjeto(projeto);
    setFormData({
      nomeCliente: projeto.nomeCliente,
      marceneiroResponsavel: projeto.marceneiroResponsavel,
      status: projeto.status,
      materiaisUsados: projeto.materiaisUsados
    });
    setIsEditModalOpen(true);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProjeto) {
      const materiaisUsados = getMateriaisUsadosByCliente(formData.nomeCliente);
      updateProjeto(editingProjeto.id, {
        ...formData,
        materiaisUsados: materiaisUsados.map(m => ({
          ferragemId: m.ferragem.id,
          quantidade: m.quantidade,
          ferragem: m.ferragem
        }))
      });
      setIsEditModalOpen(false);
      setEditingProjeto(null);
      setFormData({
        nomeCliente: '',
        marceneiroResponsavel: '',
        status: 'Em andamento',
        materiaisUsados: []
      });
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja remover este projeto?')) {
      deleteProjeto(id);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-wood-800 mb-2">Gerenciamento de Projetos</h1>
          <p className="text-wood-600">Organize e acompanhe os projetos de marcenaria</p>
        </div>
        
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-wood-600 hover:bg-wood-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Novo Projeto
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Novo Projeto</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="nomeCliente">Nome do Cliente</Label>
                <Input
                  id="nomeCliente"
                  value={formData.nomeCliente}
                  onChange={(e) => setFormData({ ...formData, nomeCliente: e.target.value })}
                  placeholder="Nome do cliente"
                  required
                />
              </div>
              <div>
                <Label htmlFor="marceneiroResponsavel">Marceneiro Responsável</Label>
                <Input
                  id="marceneiroResponsavel"
                  value={formData.marceneiroResponsavel}
                  onChange={(e) => setFormData({ ...formData, marceneiroResponsavel: e.target.value })}
                  placeholder="Nome do marceneiro"
                  required
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value as StatusType })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full bg-wood-600 hover:bg-wood-700">
                Criar Projeto
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Buscar por cliente ou marceneiro..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                {statusOptions.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Projetos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredProjetos.map((projeto) => {
          const materiaisUsados = getMateriaisUsadosByCliente(projeto.nomeCliente);
          
          return (
            <Card key={projeto.id} className="hover-lift">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-wood-800">
                    {projeto.nomeCliente}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(projeto)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(projeto.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Badge className={getStatusColor(projeto.status)}>
                  {projeto.status}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-wood-600">Marceneiro</p>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-wood-500" />
                      <span className="font-medium text-wood-800">{projeto.marceneiroResponsavel}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-wood-600">Criado em</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-wood-500" />
                      <span className="text-wood-800">{new Date(projeto.dataCriacao).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-wood-600 mb-2">Materiais Utilizados</p>
                  {materiaisUsados.length > 0 ? (
                    <div className="space-y-2">
                      {materiaisUsados.slice(0, 3).map((material, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-wood-50 rounded">
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-wood-500" />
                            <span className="text-sm text-wood-700">
                              {material.ferragem.tipo} - {material.ferragem.marca}
                            </span>
                          </div>
                          <Badge variant="secondary" className="bg-wood-100 text-wood-700">
                            {material.quantidade}
                          </Badge>
                        </div>
                      ))}
                      {materiaisUsados.length > 3 && (
                        <p className="text-xs text-wood-500 text-center">
                          +{materiaisUsados.length - 3} materiais adicionais
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-wood-500 italic">Nenhum material registrado</p>
                  )}
                </div>

                <div className="text-xs text-wood-500">
                  Última atualização: {new Date(projeto.dataAtualizacao).toLocaleDateString('pt-BR')}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredProjetos.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <FolderOpen className="h-12 w-12 text-wood-400 mx-auto mb-4" />
            <p className="text-wood-600">
              {searchTerm || statusFilter ? 'Nenhum projeto encontrado com esses filtros.' : 'Nenhum projeto cadastrado ainda.'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Modal de Edição */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Projeto</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <Label htmlFor="edit-nomeCliente">Nome do Cliente</Label>
              <Input
                id="edit-nomeCliente"
                value={formData.nomeCliente}
                onChange={(e) => setFormData({ ...formData, nomeCliente: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-marceneiroResponsavel">Marceneiro Responsável</Label>
              <Input
                id="edit-marceneiroResponsavel"
                value={formData.marceneiroResponsavel}
                onChange={(e) => setFormData({ ...formData, marceneiroResponsavel: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as StatusType })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full bg-wood-600 hover:bg-wood-700">
              Atualizar Projeto
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
