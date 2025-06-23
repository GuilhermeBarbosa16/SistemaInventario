import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Minus, AlertTriangle, CheckCircle } from 'lucide-react';
import apiService from '@/lib/api';
import { toast } from 'sonner';

export const Retirada: React.FC = () => {
  const { ferragens } = useInventory();
  const [formData, setFormData] = useState({
    ferragemId: '',
    quantidade: 0,
    cliente: '',
    data: new Date().toISOString().split('T')[0],
    responsavel: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const selectedFerragem = ferragens.find(f => String(f.id) === formData.ferragemId);
  const isQuantityValid = selectedFerragem ? formData.quantidade <= selectedFerragem.quantidade : false;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFerragem) return;
    setIsLoading(true);
    try {
      const response = await apiService.createToolMovement({
        tool_id: selectedFerragem.id,
        type: 'saida',
        quantity: formData.quantidade,
        reason: `Retirada para o cliente: ${formData.cliente} - Responsável: ${formData.responsavel}`,
        // outros campos se quiser
      });
      toast.success('Retirada registrada com sucesso!');
      setFormData({
        ferragemId: '',
        quantidade: 0,
        cliente: '',
        data: new Date().toISOString().split('T')[0],
        responsavel: ''
      });
      // Aqui você pode atualizar o estoque local, buscar novamente, etc.
    } catch (err: any) {
      toast.error('Erro ao registrar retirada', {
        description: err?.message || 'Erro desconhecido',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-wood-800 mb-2">Nova Retirada</h1>
        <p className="text-wood-600">Registre a retirada de ferragens do estoque</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Minus className="h-5 w-5" />
            Registro de Retirada
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="ferragem">Ferragem *</Label>
                <Select
                  value={formData.ferragemId}
                  onValueChange={(value) => setFormData({ ...formData, ferragemId: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a ferragem" />
                  </SelectTrigger>
                  <SelectContent>
                    {ferragens.map((ferragem) => (
                      <SelectItem key={ferragem.id} value={String(ferragem.id)}>
                        <div className="flex items-center justify-between w-full">
                          <span>
                            {ferragem.tipo} - {ferragem.marca}
                          </span>
                          <span className={`ml-4 text-sm ${
                            ferragem.quantidade <= 3 ? 'text-red-600 font-bold' : 'text-wood-600'
                          }`}>
                            (Estoque: {ferragem.quantidade})
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedFerragem && selectedFerragem.quantidade <= 3 && (
                  <div className="flex items-center gap-2 mt-2 text-sm text-red-600">
                    <AlertTriangle className="h-4 w-4" />
                    Atenção: Esta ferragem está com estoque baixo!
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="quantidade">Quantidade *</Label>
                <Input
                  id="quantidade"
                  type="number"
                  min="1"
                  max={selectedFerragem?.quantidade || 1}
                  value={formData.quantidade}
                  onChange={(e) => setFormData({ ...formData, quantidade: parseInt(e.target.value) || 0 })}
                  required
                />
                {selectedFerragem && (
                  <div className="mt-2 text-sm">
                    <div className="flex items-center gap-2">
                      {isQuantityValid ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                      )}
                      <span className={isQuantityValid ? 'text-green-600' : 'text-red-600'}>
                        {isQuantityValid 
                          ? 'Quantidade disponível' 
                          : `Apenas ${selectedFerragem.quantidade} unidades disponíveis`
                        }
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="data">Data da Retirada *</Label>
                <Input
                  id="data"
                  type="date"
                  value={formData.data}
                  onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="cliente">Cliente *</Label>
                <Input
                  id="cliente"
                  value={formData.cliente}
                  onChange={(e) => setFormData({ ...formData, cliente: e.target.value })}
                  placeholder="Nome do cliente"
                  required
                />
              </div>

              <div>
                <Label htmlFor="responsavel">Responsável *</Label>
                <Input
                  id="responsavel"
                  value={formData.responsavel}
                  onChange={(e) => setFormData({ ...formData, responsavel: e.target.value })}
                  placeholder="Nome do colaborador"
                  required
                />
              </div>
            </div>

            {selectedFerragem && (
              <div className="p-4 bg-wood-50 rounded-lg border border-wood-200">
                <h3 className="font-semibold text-wood-800 mb-2">Resumo da Retirada</h3>
                <div className="space-y-1 text-sm text-wood-600">
                  <p><strong>Ferragem:</strong> {selectedFerragem.tipo} - {selectedFerragem.marca}</p>
                  <p><strong>Quantidade atual:</strong> {selectedFerragem.quantidade} unidades</p>
                  <p><strong>Quantidade a retirar:</strong> {formData.quantidade} unidades</p>
                  <p><strong>Estoque após retirada:</strong> 
                    <span className={`ml-2 font-semibold ${
                      (selectedFerragem.quantidade - formData.quantidade) <= 3 
                        ? 'text-red-600' 
                        : 'text-green-600'
                    }`}>
                      {selectedFerragem.quantidade - formData.quantidade} unidades
                    </span>
                  </p>
                </div>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-wood-600 hover:bg-wood-700"
              disabled={!selectedFerragem || formData.quantidade <= 0 || !isQuantityValid || isLoading}
            >
              {isLoading ? 'Registrando...' : 'Registrar Retirada'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
