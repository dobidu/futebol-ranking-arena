
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Trophy, Users, BarChart3, Zap } from 'lucide-react';

const QuickActionsCard: React.FC = () => {
  const quickActions = [
    {
      title: 'Ver Rankings',
      description: 'Classificações e estatísticas',
      icon: Trophy,
      link: '/rankings',
      gradient: 'from-yellow-400 to-orange-500',
      iconColor: 'text-yellow-600',
    },
    {
      title: 'Jogadores',
      description: 'Perfis e desempenho',
      icon: Users,
      link: '/jogadores',
      gradient: 'from-blue-400 to-blue-600',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Relatórios',
      description: 'Análises detalhadas',
      icon: BarChart3,
      link: '/relatorios',
      gradient: 'from-green-400 to-emerald-500',
      iconColor: 'text-green-600',
    },
  ];

  return (
    <Card className="gradient-card hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl">⚡ Acesso Rápido</CardTitle>
            <CardDescription>Navegue rapidamente pelas principais seções</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.title} to={action.link} className="group">
                <div className="h-full p-6 rounded-xl border-2 border-muted hover:border-primary/50 bg-gradient-to-br from-white to-gray-50 hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className={`p-4 rounded-2xl bg-gradient-to-br ${action.gradient} shadow-lg group-hover:scale-110 transition-transform`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                        {action.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">{action.description}</p>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActionsCard;
