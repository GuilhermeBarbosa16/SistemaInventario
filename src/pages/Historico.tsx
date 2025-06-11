
import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { History, Search, Calendar, User, Package } from 'lucide-react';

export const Historico: React.FC = () => {
  const { retiradas } = useInventory();
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const filteredRetiradas = retiradas
    .filter(retirada => {
      const matchesSearch = 
        retirada.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
        retirada.responsavel.toLowerCase().includes(searchTerm.toLowerCase()) ||
        retirada.ferragem.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        retirada.ferragem.marca.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDate = !dateFilter || retirada.data === dateFilter;
      
      return matchesSearch && matchesDate;
    })
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

  const totalRetiradas = filteredRetiradas.length;
  const totalQuantidade = filteredRetiradas.reduce((sum, r) => sum + r.quantidade, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-wood-800 mb-2">Histórico de Retiradas</h1>
        <p className="text-wood-600">Visualize todas as movimentações do estoque</p>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <History className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-wood-600">Total de Retiradas</p>
                <p className="text-xl font-bold text-wood-800">{totalRetiradas}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Package className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-wood-600">Itens Retirados</p>
                <p className="text-xl font-bold text-wood-800">{totalQuantidade}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <User className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-wood-600">Clientes Únicos</p>
                <p className="text-xl font-bold text-wood-800">
                  {new Set(filteredRetiradas.map(r => r.cliente)).size}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-wood-500 h-4 w-4" />
              <Input
                placeholder="Buscar por cliente, responsável ou ferragem..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-wood-500 h-4 w-4" />
              <Input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Histórico */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Registros de Retirada
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredRetiradas.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Ferragem</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Responsável</TableHead>
                  <TableHead>Status Estoque</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRetiradas.map((retirada) => (
                  <TableRow key={retirada.id} className="hover:bg-wood-50">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-wood-500" />
                        {new Date(retirada.data).toLocaleDateString('pt-BR')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-wood-800">
                          {retirada.ferragem.tipo}
                        </p>
                        <p className="text-sm text-wood-600">
                          {retirada.ferragem.marca}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-wood-100 text-wood-700">
                        {retirada.quantidade} un.
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-wood-500" />
                        {retirada.cliente}
                      </div>
                    </TableCell>
                    <TableCell>{retirada.responsavel}</TableCell>
                    <TableCell>
                      {retirada.ferragem.quantidade <= 3 ? (
                        <Badge variant="destructive">Estoque Baixo</Badge>
                      ) : (
                        <Badge className="bg-green-100 text-green-800">Normal</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <History className="h-12 w-12 text-wood-400 mx-auto mb-4" />
              <p className="text-wood-600">
                {searchTerm || dateFilter 
                  ? 'Nenhuma retirada encontrada com esses filtros.' 
                  : 'Nenhuma retirada registrada ainda.'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
