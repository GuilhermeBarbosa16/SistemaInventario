
import React from 'react';
import { useInventory } from '../context/InventoryContext';
import { StatsCard } from '../components/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  AlertTriangle, 
  TrendingDown, 
  Users, 
  ClipboardList,
  Calendar
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { ferragens, retiradas, projetos } = useInventory();

  const totalFerragens = ferragens.length;
  const estoqueAlerta = ferragens.filter(f => f.quantidade <= 3).length;
  const totalRetiradas = retiradas.length;
  const projetosAtivos = projetos.filter(p => p.status === 'Em andamento').length;

  const retiradasRecentes = retiradas
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
    .slice(0, 5);

  const projetosRecentes = projetos
    .sort((a, b) => new Date(b.dataAtualizacao).getTime() - new Date(a.dataAtualizacao).getTime())
    .slice(0, 4);

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

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-wood-800 mb-2">Dashboard</h1>
        <p className="text-wood-600">Visão geral do sistema de marcenaria</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total de Ferragens"
          value={totalFerragens}
          icon={Package}
          description="Itens cadastrados"
        />
        
        <StatsCard
          title="Alerta de Estoque"
          value={estoqueAlerta}
          icon={AlertTriangle}
          description="Itens com estoque baixo"
          className={estoqueAlerta > 0 ? "border-red-200 bg-red-50" : ""}
        />
        
        <StatsCard
          title="Retiradas do Mês"
          value={totalRetiradas}
          icon={TrendingDown}
          description="Total de movimentações"
        />
        
        <StatsCard
          title="Projetos Ativos"
          value={projetosAtivos}
          icon={Users}
          description="Em andamento"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Retiradas Recentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5" />
              Retiradas Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {retiradasRecentes.map((retirada) => (
                <div key={retirada.id} className="flex items-center justify-between p-3 bg-wood-50 rounded-lg">
                  <div>
                    <p className="font-medium text-wood-800">
                      {retirada.ferragem.tipo} - {retirada.ferragem.marca}
                    </p>
                    <p className="text-sm text-wood-600">
                      Cliente: {retirada.cliente} | Qtd: {retirada.quantidade}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-wood-600">{retirada.data}</p>
                    <p className="text-xs text-wood-500">{retirada.responsavel}</p>
                  </div>
                </div>
              ))}
              {retiradasRecentes.length === 0 && (
                <p className="text-center text-wood-500 py-8">
                  Nenhuma retirada registrada ainda
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Projetos Recentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Projetos Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projetosRecentes.map((projeto) => (
                <div key={projeto.id} className="flex items-center justify-between p-3 bg-wood-50 rounded-lg">
                  <div>
                    <p className="font-medium text-wood-800">{projeto.nomeCliente}</p>
                    <p className="text-sm text-wood-600">
                      Marceneiro: {projeto.marceneiroResponsavel}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge className={getStatusColor(projeto.status)}>
                      {projeto.status}
                    </Badge>
                    <p className="text-xs text-wood-500 mt-1">
                      Atualizado: {projeto.dataAtualizacao}
                    </p>
                  </div>
                </div>
              ))}
              {projetosRecentes.length === 0 && (
                <p className="text-center text-wood-500 py-8">
                  Nenhum projeto cadastrado ainda
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertas de Estoque */}
      {estoqueAlerta > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="h-5 w-5" />
              Alertas de Estoque Baixo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ferragens
                .filter(f => f.quantidade <= 3)
                .map((ferragem) => (
                  <div key={ferragem.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-200">
                    <div>
                      <p className="font-medium text-red-800">
                        {ferragem.tipo} - {ferragem.marca}
                      </p>
                      <p className="text-sm text-red-600">
                        Estoque: {ferragem.quantidade} unidades
                      </p>
                    </div>
                    <div className="text-red-600">
                      <Package className="h-5 w-5" />
                    </div>
                  </div>
                ))
              }
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
