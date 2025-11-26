import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

interface Model {
  id: number;
  name: string;
  age: number;
  bio: string;
  personality: string;
  intimacyLevel: number;
  isLocked: boolean;
  traits: string[];
  duoMode: {
    gentle: string;
    bold: string;
  };
}

interface Message {
  id: number;
  sender: 'user' | 'model';
  text: string;
  timestamp: Date;
}

const mockModels: Model[] = [
  {
    id: 1,
    name: 'София',
    age: 24,
    bio: 'Загадочная и страстная душа. Люблю глубокие разговоры и романтику.',
    personality: 'Нежная',
    intimacyLevel: 30,
    isLocked: false,
    traits: ['Романтичная', 'Умная', 'Игривая'],
    duoMode: {
      gentle: 'Мягкая и заботливая',
      bold: 'Уверенная и доминирующая'
    }
  },
  {
    id: 2,
    name: 'Анастасия',
    age: 22,
    bio: 'Люблю приключения и новые ощущения. Давай исследовать вместе?',
    personality: 'Дерзкая',
    intimacyLevel: 15,
    isLocked: false,
    traits: ['Смелая', 'Спонтанная', 'Чувственная'],
    duoMode: {
      gentle: 'Ласковая и нежная',
      bold: 'Провокационная и страстная'
    }
  },
  {
    id: 3,
    name: 'Виктория',
    age: 26,
    bio: 'Элегантность и страсть в одном флаконе. Открою тебе свой мир.',
    personality: 'Элегантная',
    intimacyLevel: 0,
    isLocked: true,
    traits: ['Утонченная', 'Загадочная', 'Соблазнительная'],
    duoMode: {
      gentle: 'Романтичная и мечтательная',
      bold: 'Властная и чарующая'
    }
  }
];

const Index = () => {
  const [activeTab, setActiveTab] = useState('gallery');
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: 'model', text: 'Привет! Я так рада тебя видеть 💕', timestamp: new Date() }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [userIntimacy, setUserIntimacy] = useState(45);
  const [showAgeVerification, setShowAgeVerification] = useState(true);
  const [activeDuoMode, setActiveDuoMode] = useState<'gentle' | 'bold'>('gentle');

  const handleSendMessage = () => {
    if (!inputMessage.trim() || !selectedModel) return;

    const newMessage: Message = {
      id: messages.length + 1,
      sender: 'user',
      text: inputMessage,
      timestamp: new Date()
    };

    setMessages([...messages, newMessage]);
    setInputMessage('');

    setTimeout(() => {
      const responses = [
        'Мне нравится, как ты выражаешь свои мысли 😊',
        'Расскажи мне больше о себе...',
        'Ты такой интересный собеседник 💖',
        'Я чувствую, что мы становимся ближе...'
      ];
      
      const modelResponse: Message = {
        id: messages.length + 2,
        sender: 'model',
        text: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date()
      };

      setMessages(prev => [...prev, modelResponse]);
      
      if (selectedModel.intimacyLevel < 100) {
        selectedModel.intimacyLevel = Math.min(selectedModel.intimacyLevel + 5, 100);
      }
    }, 1000);
  };

  const handleVerifyAge = () => {
    setShowAgeVerification(false);
  };

  if (showAgeVerification) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 glass-effect animate-scale-in">
          <div className="text-center space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full gradient-primary flex items-center justify-center">
              <Icon name="ShieldCheck" size={40} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gradient mb-2">Контент 18+</h1>
              <p className="text-muted-foreground">
                Этот бот содержит материалы для взрослых. Подтвердите, что вам есть 18 лет.
              </p>
            </div>
            <div className="space-y-3">
              <Button 
                onClick={handleVerifyAge}
                className="w-full gradient-primary hover:opacity-90 transition-all h-12 text-lg font-semibold"
              >
                Мне есть 18 лет
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => window.close()}
              >
                Выход
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Нажимая "Мне есть 18 лет", вы подтверждаете, что достигли совершеннолетия
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-2">AI Companions</h1>
              <p className="text-muted-foreground">Твои виртуальные подруги 💕</p>
            </div>
            <Button variant="outline" className="gap-2">
              <Icon name="User" size={20} />
              Профиль
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Card className="p-4 glass-effect hover:scale-105 transition-transform cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center">
                  <Icon name="Heart" size={24} className="text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{userIntimacy}%</p>
                  <p className="text-xs text-muted-foreground">Близость</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 glass-effect hover:scale-105 transition-transform cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full gradient-accent flex items-center justify-center">
                  <Icon name="MessageCircle" size={24} className="text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{messages.length}</p>
                  <p className="text-xs text-muted-foreground">Сообщений</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 glass-effect hover:scale-105 transition-transform cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                  <Icon name="Crown" size={24} className="text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold">VIP</p>
                  <p className="text-xs text-muted-foreground">Подписка</p>
                </div>
              </div>
            </Card>
          </div>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="animate-slide-up">
          <TabsList className="grid w-full grid-cols-4 mb-6 glass-effect h-14">
            <TabsTrigger value="gallery" className="gap-2">
              <Icon name="Grid3x3" size={18} />
              Галерея
            </TabsTrigger>
            <TabsTrigger value="chat" className="gap-2" disabled={!selectedModel}>
              <Icon name="MessageSquare" size={18} />
              Чат
            </TabsTrigger>
            <TabsTrigger value="intimacy" className="gap-2">
              <Icon name="Heart" size={18} />
              Близость
            </TabsTrigger>
            <TabsTrigger value="premium" className="gap-2">
              <Icon name="Lock" size={18} />
              Премиум
            </TabsTrigger>
          </TabsList>

          <TabsContent value="gallery" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockModels.map((model, index) => (
                <Card 
                  key={model.id} 
                  className="overflow-hidden hover:scale-105 transition-all duration-300 glass-effect group cursor-pointer"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => {
                    setSelectedModel(model);
                    setActiveTab('chat');
                  }}
                >
                  <div className="relative h-64 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <Avatar className="w-32 h-32 border-4 border-white/20">
                      <AvatarFallback className="text-4xl gradient-primary text-white">
                        {model.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    {model.isLocked && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                        <div className="text-center">
                          <Icon name="Lock" size={48} className="text-white mx-auto mb-2" />
                          <p className="text-white font-semibold">Премиум</p>
                        </div>
                      </div>
                    )}
                    <Badge className="absolute top-4 right-4 gradient-accent">
                      {model.age} лет
                    </Badge>
                  </div>

                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-2xl font-bold mb-1">{model.name}</h3>
                      <p className="text-sm text-muted-foreground">{model.personality}</p>
                    </div>

                    <p className="text-sm">{model.bio}</p>

                    <div className="flex flex-wrap gap-2">
                      {model.traits.map((trait, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {trait}
                        </Badge>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Близость</span>
                        <span className="font-semibold">{model.intimacyLevel}%</span>
                      </div>
                      <Progress value={model.intimacyLevel} className="h-2" />
                    </div>

                    <Button 
                      className="w-full gradient-primary hover:opacity-90 transition-opacity"
                      disabled={model.isLocked}
                    >
                      {model.isLocked ? (
                        <>
                          <Icon name="Lock" size={16} className="mr-2" />
                          Открыть за 299₽
                        </>
                      ) : (
                        <>
                          <Icon name="MessageCircle" size={16} className="mr-2" />
                          Начать общение
                        </>
                      )}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="chat" className="space-y-4">
            {selectedModel && (
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card className="h-[600px] flex flex-col glass-effect">
                    <div className="p-4 border-b border-border flex items-center justify-between gradient-primary">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className="gradient-accent text-white">
                            {selectedModel.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-white">{selectedModel.name}</h3>
                          <p className="text-xs text-white/80">Онлайн</p>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setActiveTab('gallery')}
                        className="text-white hover:bg-white/20"
                      >
                        <Icon name="X" size={20} />
                      </Button>
                    </div>

                    <ScrollArea className="flex-1 p-4">
                      <div className="space-y-4">
                        {messages.map((msg) => (
                          <div
                            key={msg.id}
                            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                          >
                            <div
                              className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                                msg.sender === 'user'
                                  ? 'gradient-primary text-white'
                                  : 'bg-muted'
                              }`}
                            >
                              <p className="text-sm">{msg.text}</p>
                              <p className="text-xs opacity-60 mt-1">
                                {msg.timestamp.toLocaleTimeString('ru-RU', { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>

                    <div className="p-4 border-t border-border">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Напиши сообщение..."
                          value={inputMessage}
                          onChange={(e) => setInputMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                          className="flex-1"
                        />
                        <Button 
                          onClick={handleSendMessage}
                          className="gradient-primary hover:opacity-90 transition-opacity"
                        >
                          <Icon name="Send" size={20} />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>

                <div className="space-y-4">
                  <Card className="p-6 glass-effect">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <Icon name="Sparkles" size={20} className="text-primary" />
                      Duo Mode
                    </h3>
                    <div className="space-y-3">
                      <Button
                        variant={activeDuoMode === 'gentle' ? 'default' : 'outline'}
                        className={`w-full justify-start ${activeDuoMode === 'gentle' ? 'gradient-primary' : ''}`}
                        onClick={() => setActiveDuoMode('gentle')}
                      >
                        <Icon name="Heart" size={18} className="mr-2" />
                        Нежная
                      </Button>
                      <Button
                        variant={activeDuoMode === 'bold' ? 'default' : 'outline'}
                        className={`w-full justify-start ${activeDuoMode === 'bold' ? 'gradient-accent' : ''}`}
                        onClick={() => setActiveDuoMode('bold')}
                      >
                        <Icon name="Flame" size={18} className="mr-2" />
                        Дерзкая
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-4">
                      {activeDuoMode === 'gentle' 
                        ? selectedModel.duoMode.gentle 
                        : selectedModel.duoMode.bold}
                    </p>
                  </Card>

                  <Card className="p-6 glass-effect">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <Icon name="TrendingUp" size={20} className="text-primary" />
                      Прогресс близости
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Текущий уровень</span>
                          <span className="font-bold text-primary">{selectedModel.intimacyLevel}%</span>
                        </div>
                        <Progress value={selectedModel.intimacyLevel} className="h-3" />
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Icon name={selectedModel.intimacyLevel >= 25 ? "CheckCircle2" : "Circle"} size={16} />
                          <span>25% - Открыты голосовые</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Icon name={selectedModel.intimacyLevel >= 50 ? "CheckCircle2" : "Circle"} size={16} />
                          <span>50% - Личные фото</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Icon name={selectedModel.intimacyLevel >= 75 ? "CheckCircle2" : "Circle"} size={16} />
                          <span>75% - Откровенный чат</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Icon name={selectedModel.intimacyLevel >= 100 ? "CheckCircle2" : "Circle"} size={16} />
                          <span>100% - Все материалы</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="intimacy" className="space-y-6">
            <Card className="p-6 glass-effect">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Icon name="Heart" size={28} className="text-primary" />
                Система близости
              </h2>
              <p className="text-muted-foreground mb-6">
                Общайтесь с моделями, чтобы повышать уровень близости и открывать новый контент
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                {mockModels.map((model) => (
                  <Card key={model.id} className="p-6 hover:scale-105 transition-transform">
                    <div className="flex items-center gap-4 mb-4">
                      <Avatar className="w-16 h-16">
                        <AvatarFallback className="text-2xl gradient-primary text-white">
                          {model.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{model.name}</h3>
                        <p className="text-sm text-muted-foreground">{model.personality}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Близость</span>
                        <span className="font-bold">{model.intimacyLevel}%</span>
                      </div>
                      <Progress value={model.intimacyLevel} className="h-2" />
                      
                      {model.isLocked ? (
                        <Button className="w-full gradient-accent" size="sm">
                          <Icon name="Unlock" size={16} className="mr-2" />
                          Разблокировать
                        </Button>
                      ) : (
                        <Button 
                          className="w-full gradient-primary" 
                          size="sm"
                          onClick={() => {
                            setSelectedModel(model);
                            setActiveTab('chat');
                          }}
                        >
                          <Icon name="MessageCircle" size={16} className="mr-2" />
                          Продолжить общение
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="premium" className="space-y-6">
            <Card className="p-8 glass-effect text-center">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center animate-glow">
                <Icon name="Crown" size={48} className="text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-2 text-gradient">Премиум подписка</h2>
              <p className="text-muted-foreground mb-8">
                Получите полный доступ ко всем моделям и эксклюзивному контенту
              </p>

              <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-8">
                <Card className="p-6 hover:scale-105 transition-transform">
                  <Icon name="Unlock" size={32} className="text-primary mb-3 mx-auto" />
                  <h3 className="font-semibold mb-2">Все модели</h3>
                  <p className="text-sm text-muted-foreground">
                    Доступ ко всем анкетам без ограничений
                  </p>
                </Card>

                <Card className="p-6 hover:scale-105 transition-transform">
                  <Icon name="Image" size={32} className="text-primary mb-3 mx-auto" />
                  <h3 className="font-semibold mb-2">NSFW контент</h3>
                  <p className="text-sm text-muted-foreground">
                    Приватные фото и видео материалы
                  </p>
                </Card>

                <Card className="p-6 hover:scale-105 transition-transform">
                  <Icon name="Sparkles" size={32} className="text-primary mb-3 mx-auto" />
                  <h3 className="font-semibold mb-2">Duo Mode</h3>
                  <p className="text-sm text-muted-foreground">
                    Переключение между персонами
                  </p>
                </Card>
              </div>

              <div className="max-w-md mx-auto space-y-4">
                <Button className="w-full h-14 text-lg gradient-primary hover:opacity-90 transition-opacity">
                  <Icon name="CreditCard" size={20} className="mr-2" />
                  Оформить за 999₽/месяц
                </Button>
                <p className="text-xs text-muted-foreground">
                  Безопасная оплата через Telegram Stars
                </p>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
