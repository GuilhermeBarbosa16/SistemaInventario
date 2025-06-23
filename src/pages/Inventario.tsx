import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Package, Search, Edit, Trash2 } from 'lucide-react';
import { Ferragem } from '../types';
import apiService from '@/lib/api';
import { toast } from 'sonner';

export const Inventario: React.FC = () => {
  const { ferragens, addFerragem, updateFerragem, deleteFerragem } = useInventory();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEntradaModalOpen, setIsEntradaModalOpen] = useState(false);
  const [editingFerragem, setEditingFerragem] = useState<Ferragem | null>(null);
  const [formData, setFormData] = useState({
    tipo: '',
    marca: '',
    quantidade: 0,
    categoria: 'Ferragens'
  });
  const [entradaData, setEntradaData] = useState({
    ferragemId: '',
    quantidade: 0,
    motivo: ''
  });
  const [isLoadingEntrada, setIsLoadingEntrada] = useState(false);

  const filteredFerragens = ferragens.filter(ferragem =>
    ferragem.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ferragem.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ferragem.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addFerragem(formData);
    setFormData({ tipo: '', marca: '', quantidade: 0, categoria: 'Ferragens' });
    setIsAddModalOpen(false);
  };

  const handleEdit = (ferragem: Ferragem) => {
    setEditingFerragem(ferragem);
    setFormData({
      tipo: ferragem.tipo,
      marca: ferragem.marca,
      quantidade: ferragem.quantidade,
      categoria: ferragem.categoria
    });
    setIsEditModalOpen(true);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingFerragem) {
      updateFerragem(editingFerragem.id, formData);
      setIsEditModalOpen(false);
      setEditingFerragem(null);
      setFormData({ tipo: '', marca: '', quantidade: 0, categoria: 'Ferragens' });
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja remover esta ferragem?')) {
      deleteFerragem(id);
    }
  };

  const handleEntradaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ferragem = ferragens.find(f => f.id === entradaData.ferragemId);
    if (!ferragem) {
      toast.error('Selecione uma ferragem válida.');
      return;
    }
    if (entradaData.quantidade <= 0) {
      toast.error('Informe uma quantidade válida.');
      return;
    }
    setIsLoadingEntrada(true);
    try {
      await apiService.createStockMovement({
        product_id: ferragem.id,
        type: 'entrada',
        quantity: entradaData.quantidade,
        reason: entradaData.motivo,
      });
      toast.success('Entrada registrada com sucesso!');
      setEntradaData({ ferragemId: '', quantidade: 0, motivo: '' });
      setIsEntradaModalOpen(false);
      // Aqui você pode atualizar o estoque local, buscar novamente, etc.
    } catch (err: any) {
      toast.error('Erro ao registrar entrada', {
        description: err?.message || 'Erro desconhecido',
      });
    } finally {
      setIsLoadingEntrada(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-wood-800 mb-2">Estoque de Ferragens</h1>
          <p className="text-wood-600">Gerencie o estoque de ferragens e materiais</p>
        </div>
        
        <div className="flex gap-2">
          <Dialog open={isEntradaModalOpen} onOpenChange={setIsEntradaModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Entrada de Produto
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Registrar Entrada de Produto</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleEntradaSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="ferragemId">Ferragem/Produto</Label>
                  <select
                    id="ferragemId"
                    value={entradaData.ferragemId}
                    onChange={e => setEntradaData({ ...entradaData, ferragemId: e.target.value })}
                    required
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="">Selecione...</option>
                    {ferragens.map(f => (
                      <option key={f.id} value={f.id}>
                        {f.tipo} - {f.marca}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="quantidadeEntrada">Quantidade</Label>
                  <Input
                    id="quantidadeEntrada"
                    type="number"
                    min="1"
                    value={entradaData.quantidade}
                    onChange={e => setEntradaData({ ...entradaData, quantidade: parseInt(e.target.value) || 0 })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="motivoEntrada">Motivo/Observação</Label>
                  <Input
                    id="motivoEntrada"
                    value={entradaData.motivo}
                    onChange={e => setEntradaData({ ...entradaData, motivo: e.target.value })}
                    placeholder="Ex: Compra, devolução, ajuste..."
                  />
                </div>
                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isLoadingEntrada}>
                  {isLoadingEntrada ? 'Registrando...' : 'Registrar Entrada'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-wood-600 hover:bg-wood-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Ferragem
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Nova Ferragem</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="tipo">Tipo da Ferragem</Label>
                  <Input
                    id="tipo"
                    value={formData.tipo}
                    onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                    placeholder="Ex: Dobradiça, Corrediça, Puxador..."
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="marca">Marca</Label>
                  <Input
                    id="marca"
                    value={formData.marca}
                    onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
                    placeholder="Ex: Hafele, Blum, Tramontina..."
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="quantidade">Quantidade</Label>
                  <Input
                    id="quantidade"
                    type="number"
                    min="0"
                    value={formData.quantidade}
                    onChange={(e) => setFormData({ ...formData, quantidade: parseInt(e.target.value) || 0 })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="categoria">Categoria</Label>
                  <Input
                    id="categoria"
                    value={formData.categoria}
                    onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                    placeholder="Ex: Ferragens, Parafusos, Acessórios..."
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-wood-600 hover:bg-wood-700">
                  Adicionar Ferragem
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Busca */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-wood-500 h-4 w-4" />
            <Input
              placeholder="Buscar por tipo, marca ou categoria..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Lista de Ferragens */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFerragens.map((ferragem) => (
          <Card key={ferragem.id} className="hover-lift">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-wood-800">
                  {ferragem.tipo}
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(ferragem)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(ferragem.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-wood-600">Marca</p>
                  <p className="font-medium text-wood-800">{ferragem.marca}</p>
                </div>
                
                <div>
                  <p className="text-sm text-wood-600">Categoria</p>
                  <Badge variant="secondary" className="bg-wood-100 text-wood-700">
                    {ferragem.categoria}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-wood-600">Quantidade</p>
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-wood-500" />
                      <span className={`text-lg font-bold ${
                        ferragem.quantidade <= 3 ? 'text-red-600' : 'text-wood-800'
                      }`}>
                        {ferragem.quantidade}
                      </span>
                    </div>
                  </div>
                  
                  {ferragem.quantidade <= 3 && (
                    <Badge variant="destructive" className="animate-pulse">
                      Estoque Baixo
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredFerragens.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Package className="h-12 w-12 text-wood-400 mx-auto mb-4" />
            <p className="text-wood-600">
              {searchTerm ? 'Nenhuma ferragem encontrada com esses critérios.' : 'Nenhuma ferragem cadastrada ainda.'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Modal de Edição */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Ferragem</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <Label htmlFor="edit-tipo">Tipo da Ferragem</Label>
              <Input
                id="edit-tipo"
                value={formData.tipo}
                onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-marca">Marca</Label>
              <Input
                id="edit-marca"
                value={formData.marca}
                onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-quantidade">Quantidade</Label>
              <Input
                id="edit-quantidade"
                type="number"
                min="0"
                value={formData.quantidade}
                onChange={(e) => setFormData({ ...formData, quantidade: parseInt(e.target.value) || 0 })}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-categoria">Categoria</Label>
              <Input
                id="edit-categoria"
                value={formData.categoria}
                onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                required
              />
            </div>
            <Button type="submit" className="w-full bg-wood-600 hover:bg-wood-700">
              Atualizar Ferragem
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
