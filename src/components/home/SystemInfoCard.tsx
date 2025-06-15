
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { 
  BarChart3, 
  Trophy, 
  Users, 
  Calendar, 
  Clock, 
  Award, 
  Target 
} from 'lucide-react';

const SystemInfoCard: React.FC = () => {
  const mainFeatures = [
    {
      icon: Trophy,
      text: 'Rankings automáticos com sistema de descartes',
      color: 'green'
    },
    {
      icon: Users,
      text: 'Gestão completa de jogadores e temporadas',
      color: 'blue'
    },
    {
      icon: Calendar,
      text: 'Súmula digital para registro de jogos',
      color: 'purple'
    },
    {
      icon: BarChart3,
      text: 'Relatórios e estatísticas avançadas',
      color: 'orange'
    },
    {
      icon: Clock,
      text: 'Controle de presenças e disciplina',
      color: 'red'
    }
  ];

  const adminFeatures = [
    {
      icon: Award,
      text: 'Acesso completo ao painel administrativo',
      color: 'indigo'
    },
    {
      icon: Target,
      text: 'Configuração de regras por temporada',
      color: 'yellow'
    },
    {
      icon: Users,
      text: 'Gestão de jogadores mensalistas e convidados',
      color: 'green'
    },
    {
      icon: Calendar,
      text: 'Preenchimento da súmula digital',
      color: 'blue'
    },
    {
      icon: BarChart3,
      text: 'Relatórios detalhados de desempenho',
      color: 'purple'
    }
  ];

  return (
    <Card className="gradient-card hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-lg">
            <BarChart3 className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl">📊 Sobre o Sistema</CardTitle>
            <CardDescription>Conheça as funcionalidades disponíveis</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-primary mb-3">🚀 Funcionalidades Principais:</h3>
            <div className="space-y-3">
              {mainFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`p-1 bg-${feature.color}-100 rounded`}>
                      <Icon className={`h-4 w-4 text-${feature.color}-600`} />
                    </div>
                    <span className="text-sm">{feature.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-primary mb-3">👨‍💼 Para Administradores:</h3>
            <div className="space-y-3">
              {adminFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`p-1 bg-${feature.color}-100 rounded`}>
                      <Icon className={`h-4 w-4 text-${feature.color}-600`} />
                    </div>
                    <span className="text-sm">{feature.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemInfoCard;
