
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlusCircle, Users, MessageSquare, Heart, Calendar } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const CommunityPage = () => {
  const { user } = useAuth();
  
  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Community</h1>
          <p className="text-muted-foreground">Connect with like-minded health enthusiasts</p>
        </div>
        <Button className="mt-4 md:mt-0" size="sm">
          <PlusCircle className="h-4 w-4 mr-2" /> Create Group
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <h2 className="text-xl font-bold mb-4">Featured Groups</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Morning Runners</CardTitle>
                    <CardDescription>Early birds who love to run</CardDescription>
                  </div>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://images.unsplash.com/photo-1502230831726-fe5549140034?q=80&w=1000" />
                    <AvatarFallback>MR</AvatarFallback>
                  </Avatar>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 text-sm mb-4">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">128 members</span>
                </div>
                <p className="text-sm">A community of early risers who enjoy running at dawn. Share routes, achievements, and organize group runs.</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Join Group</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Healthy Meal Prep</CardTitle>
                    <CardDescription>Share recipes and meal ideas</CardDescription>
                  </div>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?q=80&w=1000" />
                    <AvatarFallback>HM</AvatarFallback>
                  </Avatar>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 text-sm mb-4">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">256 members</span>
                </div>
                <p className="text-sm">Enthusiasts sharing healthy recipes, meal prep tips, and nutrition advice. New meal ideas posted daily.</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Join Group</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Yoga & Meditation</CardTitle>
                    <CardDescription>Find your inner peace</CardDescription>
                  </div>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1000" />
                    <AvatarFallback>YM</AvatarFallback>
                  </Avatar>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 text-sm mb-4">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">145 members</span>
                </div>
                <p className="text-sm">A sanctuary for yoga and meditation practitioners. Share techniques, experiences, and organize group sessions.</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Join Group</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Weight Loss Support</CardTitle>
                    <CardDescription>Achieve your goals together</CardDescription>
                  </div>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1000" />
                    <AvatarFallback>WL</AvatarFallback>
                  </Avatar>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 text-sm mb-4">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">312 members</span>
                </div>
                <p className="text-sm">A supportive community for those on a weight loss journey. Share tips, challenges, victories, and get motivation.</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Join Group</Button>
              </CardFooter>
            </Card>
          </div>
          
          <h2 className="text-xl font-bold mt-8 mb-4">Featured Content</h2>
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarImage src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1000" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">10 Healthy Breakfast Ideas Under 300 Calories</CardTitle>
                    <CardDescription>By John Doe • 2 days ago</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Start your day right with these nutritious and delicious breakfast options that are quick to prepare and under 300 calories...</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Heart className="h-4 w-4 mr-1" />
                    <span>48</span>
                  </div>
                  <div className="flex items-center">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    <span>12</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm">Read More</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000" />
                    <AvatarFallback>AS</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">How I Lost 30 Pounds in 6 Months</CardTitle>
                    <CardDescription>By Alice Smith • 5 days ago</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm">My journey to losing 30 pounds wasn't about crash diets or extreme workouts. It was about sustainable lifestyle changes...</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Heart className="h-4 w-4 mr-1" />
                    <span>86</span>
                  </div>
                  <div className="flex items-center">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    <span>24</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm">Read More</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>Join these community activities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <div className="bg-primary/10 h-14 w-14 rounded-md flex flex-col items-center justify-center text-primary">
                  <span className="text-xs font-medium">JUN</span>
                  <span className="text-lg font-bold">15</span>
                </div>
                <div>
                  <h3 className="font-medium">Group Run in Central Park</h3>
                  <p className="text-sm text-muted-foreground">8:00 AM • Central Park</p>
                  <div className="flex items-center mt-1 text-xs text-muted-foreground">
                    <Users className="h-3 w-3 mr-1" />
                    <span>18 going</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="bg-primary/10 h-14 w-14 rounded-md flex flex-col items-center justify-center text-primary">
                  <span className="text-xs font-medium">JUN</span>
                  <span className="text-lg font-bold">18</span>
                </div>
                <div>
                  <h3 className="font-medium">Nutrition Workshop</h3>
                  <p className="text-sm text-muted-foreground">6:30 PM • Online</p>
                  <div className="flex items-center mt-1 text-xs text-muted-foreground">
                    <Users className="h-3 w-3 mr-1" />
                    <span>42 going</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="bg-primary/10 h-14 w-14 rounded-md flex flex-col items-center justify-center text-primary">
                  <span className="text-xs font-medium">JUN</span>
                  <span className="text-lg font-bold">22</span>
                </div>
                <div>
                  <h3 className="font-medium">Yoga in the Park</h3>
                  <p className="text-sm text-muted-foreground">9:00 AM • Riverside Park</p>
                  <div className="flex items-center mt-1 text-xs text-muted-foreground">
                    <Users className="h-3 w-3 mr-1" />
                    <span>24 going</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <Calendar className="h-4 w-4 mr-2" />
                View All Events
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>My Groups</CardTitle>
              <CardDescription>Groups you've joined</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://images.unsplash.com/photo-1502230831726-fe5549140034?q=80&w=1000" />
                    <AvatarFallback>MR</AvatarFallback>
                  </Avatar>
                  <span>Morning Runners</span>
                </div>
                <Button variant="ghost" size="sm">View</Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?q=80&w=1000" />
                    <AvatarFallback>HM</AvatarFallback>
                  </Avatar>
                  <span>Healthy Meal Prep</span>
                </div>
                <Button variant="ghost" size="sm">View</Button>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">Find More Groups</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
