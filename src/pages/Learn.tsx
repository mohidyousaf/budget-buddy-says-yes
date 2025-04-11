
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { BookOpen, GraduationCap, Lightbulb, CheckCircle2 } from "lucide-react";

const Learn = () => {
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  
  // Mark a lesson as completed
  const markLessonCompleted = (lessonId: string) => {
    setCompletedLessons(prev => new Set([...prev, lessonId]));
  };
  
  // Calculate progress for each category
  const getBudgetingProgress = () => {
    const total = budgetingLessons.length;
    const completed = [...budgetingLessons].filter(lesson => completedLessons.has(lesson.id)).length;
    return Math.round((completed / total) * 100);
  };
  
  const getSavingProgress = () => {
    const total = savingLessons.length;
    const completed = [...savingLessons].filter(lesson => completedLessons.has(lesson.id)).length;
    return Math.round((completed / total) * 100);
  };
  
  const getInvestingProgress = () => {
    const total = investingLessons.length;
    const completed = [...investingLessons].filter(lesson => completedLessons.has(lesson.id)).length;
    return Math.round((completed / total) * 100);
  };
  
  // Educational content
  const budgetingLessons = [
    {
      id: "budget-1",
      title: "Budgeting Basics",
      description: "Learn the fundamental concepts of creating and maintaining a personal budget",
      content: "A budget is simply a plan for your money. It helps you track your income and expenses so you know exactly where your money is going. Creating a budget involves listing all your income sources and categorizing your expenses, then allocating specific amounts to each category. The most effective budgets are realistic and include savings goals."
    },
    {
      id: "budget-2",
      title: "The 50/30/20 Rule",
      description: "A simple budgeting framework that's easy to follow",
      content: "The 50/30/20 rule suggests allocating 50% of your income to needs (housing, utilities, groceries), 30% to wants (entertainment, shopping), and 20% to savings and debt repayment. This framework provides flexibility while ensuring you're saving adequately. For those with high debt burdens, consider adjusting to a 50/20/30 approach to prioritize debt reduction."
    },
    {
      id: "budget-3",
      title: "Tracking Expenses",
      description: "Techniques and tools for monitoring your spending",
      content: "Consistently tracking expenses is crucial for budget success. Use apps like Mohid Budget Buddy, spreadsheets, or even a simple notebook. Review your spending weekly to catch patterns and make adjustments. Categorize expenses accurately and be honest with yourself about needs versus wants. Small daily expenses often add up to significant amounts over time."
    }
  ];
  
  const savingLessons = [
    {
      id: "save-1",
      title: "Emergency Fund Essentials",
      description: "Why and how to build your financial safety net",
      content: "An emergency fund is your financial buffer against unexpected expenses like medical bills, car repairs, or job loss. Aim to save 3-6 months of essential expenses in an easily accessible account. Start small with a goal of PKR 50,000, then build from there. Keep this money separate from your regular savings to avoid the temptation to spend it."
    },
    {
      id: "save-2",
      title: "Saving Strategies",
      description: "Effective approaches to increase your savings rate",
      content: "Pay yourself first by automatically transferring money to savings when you get paid. Look for areas to reduce expenses, such as dining out less or negotiating bills. Consider the 24-hour rule for non-essential purchases over PKR 5,000 - wait a day before buying to avoid impulse purchases. Remember that consistently saving small amounts is better than irregular larger contributions."
    },
    {
      id: "save-3",
      title: "Setting Financial Goals",
      description: "Creating achievable savings targets",
      content: "Effective financial goals are Specific, Measurable, Achievable, Relevant, and Time-bound (SMART). Break large goals into smaller milestones to maintain motivation. Common savings goals include buying a home (aim for a 20% down payment), education expenses, or travel. Track your progress regularly and celebrate when you reach milestones."
    }
  ];
  
  const investingLessons = [
    {
      id: "invest-1",
      title: "Investment Fundamentals",
      description: "Basic concepts every investor should understand",
      content: "Investing is using money to buy assets that may generate income or appreciate in value over time. Key concepts include: risk vs. return (higher potential returns come with higher risk), diversification (spreading investments across different assets), compound interest (earnings generating more earnings), and time horizon (longer investing periods typically reduce overall risk)."
    },
    {
      id: "invest-2",
      title: "Investment Options in Pakistan",
      description: "Overview of investment vehicles available locally",
      content: "Pakistan offers various investment opportunities including: National Savings Certificates (government-backed with stable returns), Mutual Funds (professionally managed portfolios suitable for beginners), Stocks (direct company ownership through the PSX), Real Estate (property investment for rental income and appreciation), and Islamic investment options (Shariah-compliant alternatives like Sukuk). Research each option carefully before investing."
    },
    {
      id: "invest-3",
      title: "Building an Investment Strategy",
      description: "Creating a personalized approach to investing",
      content: "A solid investment strategy depends on your age, financial goals, risk tolerance, and time horizon. Younger investors can typically accept more risk for growth potential. Always invest only after establishing an emergency fund and eliminating high-interest debt. Consider seeking advice from a financial advisor for personalized guidance, especially when starting with larger amounts."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container py-6 md:py-8 px-3 md:px-8 space-y-6 md:space-y-8">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-center gap-3 mb-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Financial Education</h1>
          </div>
          <p className="text-muted-foreground">
            Enhance your financial literacy with these educational resources
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-green-500" />
                  <span>Budgeting</span>
                </CardTitle>
                <CardDescription>Learn to manage your money effectively</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{getBudgetingProgress()}% Complete</span>
                  </div>
                  <Progress value={getBudgetingProgress()} className="h-2" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-500" />
                  <span>Saving</span>
                </CardTitle>
                <CardDescription>Build wealth through smart saving habits</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{getSavingProgress()}% Complete</span>
                  </div>
                  <Progress value={getSavingProgress()} className="h-2" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-purple-500" />
                  <span>Investing</span>
                </CardTitle>
                <CardDescription>Grow your money through investments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{getInvestingProgress()}% Complete</span>
                  </div>
                  <Progress value={getInvestingProgress()} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-8">
            <Tabs defaultValue="budgeting">
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="budgeting">Budgeting</TabsTrigger>
                <TabsTrigger value="saving">Saving</TabsTrigger>
                <TabsTrigger value="investing">Investing</TabsTrigger>
              </TabsList>
              
              <TabsContent value="budgeting">
                <div className="space-y-6">
                  {budgetingLessons.map((lesson) => (
                    <Card key={lesson.id}>
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <CardTitle>{lesson.title}</CardTitle>
                          {completedLessons.has(lesson.id) && (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          )}
                        </div>
                        <CardDescription>{lesson.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <p className="text-sm text-muted-foreground">{lesson.content}</p>
                          <div className="flex justify-end">
                            <button 
                              onClick={() => markLessonCompleted(lesson.id)}
                              className="text-sm text-primary hover:underline flex items-center gap-1"
                            >
                              <span>Mark as Completed</span>
                              {completedLessons.has(lesson.id) && <CheckCircle2 className="h-3 w-3" />}
                            </button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="saving">
                <div className="space-y-6">
                  {savingLessons.map((lesson) => (
                    <Card key={lesson.id}>
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <CardTitle>{lesson.title}</CardTitle>
                          {completedLessons.has(lesson.id) && (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          )}
                        </div>
                        <CardDescription>{lesson.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <p className="text-sm text-muted-foreground">{lesson.content}</p>
                          <div className="flex justify-end">
                            <button 
                              onClick={() => markLessonCompleted(lesson.id)}
                              className="text-sm text-primary hover:underline flex items-center gap-1"
                            >
                              <span>Mark as Completed</span>
                              {completedLessons.has(lesson.id) && <CheckCircle2 className="h-3 w-3" />}
                            </button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="investing">
                <div className="space-y-6">
                  {investingLessons.map((lesson) => (
                    <Card key={lesson.id}>
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <CardTitle>{lesson.title}</CardTitle>
                          {completedLessons.has(lesson.id) && (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          )}
                        </div>
                        <CardDescription>{lesson.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <p className="text-sm text-muted-foreground">{lesson.content}</p>
                          <div className="flex justify-end">
                            <button 
                              onClick={() => markLessonCompleted(lesson.id)}
                              className="text-sm text-primary hover:underline flex items-center gap-1"
                            >
                              <span>Mark as Completed</span>
                              {completedLessons.has(lesson.id) && <CheckCircle2 className="h-3 w-3" />}
                            </button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-amber-500" />
                <span>Financial Tip of the Day</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <blockquote className="border-l-4 pl-4 italic">
                "Pay yourself first by automating your savings. Set up an automatic transfer from your checking account to your savings account on payday. What you don't see, you won't miss."
              </blockquote>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Learn;
