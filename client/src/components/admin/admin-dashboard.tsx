import React, { useState } from 'react';
import { Link } from 'wouter';
import {
  Users,
  Calendar,
  Settings,
  BarChart,
  ShoppingCart,
  List,
  PlusCircle,
  Search,
  Bell,
  UserCircle,
  ChevronDown,
  Menu,
  X,
  LogOut,
  Home
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, Section, Container, ResponsiveText } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AdminDashboardProps {
  children?: React.ReactNode;
}

export default function AdminDashboard({ children }: AdminDashboardProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  return (
    <div className="flex h-screen bg-neutral-100 dark:bg-neutral-900">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar - fixed on desktop, off-canvas on mobile */}
      <div 
        className={cn(
          "fixed inset-y-0 left-0 z-30 w-[var(--admin-sidebar-width)] lg:w-[var(--admin-sidebar-width)]",
          "transform transition-transform duration-300 ease-in-out lg:translate-x-0",
          "bg-white dark:bg-neutral-800 border-r border-neutral-200 dark:border-neutral-700",
          "flex flex-col",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Sidebar Header */}
        <div className="h-[var(--admin-header-height)] border-b border-neutral-200 dark:border-neutral-700 px-6 flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="font-serif font-bold text-xl bg-gradient-to-r from-amber-700 to-amber-500 dark:from-amber-400 dark:to-amber-300 text-transparent bg-clip-text">
              KARI STYLEZ
            </div>
          </Link>
        </div>
        
        {/* Sidebar Content */}
        <div className="flex-1 overflow-y-auto py-4 px-4">
          {/* Navigation */}
          <nav className="space-y-1">
            <p className="px-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mt-2 mb-2">
              Dashboard
            </p>
            
            <NavItem icon={<Home size={20} />} href="/admin" label="Overview" active />
            <NavItem icon={<Calendar size={20} />} href="/admin/appointments" label="Appointments" badgeCount={5} />
            <NavItem icon={<Users size={20} />} href="/admin/clients" label="Clients" />
            <NavItem icon={<BarChart size={20} />} href="/admin/analytics" label="Analytics" />
            
            <p className="px-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mt-6 mb-2">
              Content
            </p>
            
            <NavItem icon={<List size={20} />} href="/admin/services" label="Services" />
            <NavItem icon={<ShoppingCart size={20} />} href="/admin/products" label="Products" />
            <NavItem icon={<Users size={20} />} href="/admin/stylists" label="Stylists" />
            
            <p className="px-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mt-6 mb-2">
              Settings
            </p>
            
            <NavItem icon={<Settings size={20} />} href="/admin/settings" label="General" />
          </nav>
        </div>
        
        {/* Sidebar Footer */}
        <div className="border-t border-neutral-200 dark:border-neutral-700 p-4">
          <Link href="/auth/logout">
            <Button variant="ghost" className="w-full justify-start text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-300">
              <LogOut className="mr-2 h-4 w-4" />
              Log Out
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Main Content */}
      <div className={cn(
        "flex-1 flex flex-col",
        "lg:ml-[var(--admin-sidebar-width)]"
      )}>
        {/* Header */}
        <header className="h-[var(--admin-header-height)] bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 px-4 lg:px-8 flex items-center justify-between sticky top-0 z-10">
          {/* Mobile Menu Button */}
          <button
            type="button"
            className="lg:hidden rounded-md p-2 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:outline-none"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            <span className="sr-only">{sidebarOpen ? 'Close sidebar' : 'Open sidebar'}</span>
          </button>
          
          {/* Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-neutral-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400"
                placeholder="Search..."
              />
            </div>
          </div>
          
          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            <button className="p-1 rounded-full text-neutral-500 hover:text-neutral-600 dark:text-neutral-400 dark:hover:text-neutral-300 relative">
              <span className="sr-only">View notifications</span>
              <Bell className="h-6 w-6" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 dark:bg-red-500"></span>
            </button>
            
            {/* User Menu */}
            <div className="relative">
              <button
                type="button"
                className="flex items-center space-x-2 rounded-md p-2 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:outline-none"
              >
                <UserCircle className="h-6 w-6" />
                <span className="hidden md:block text-sm font-medium">Admin User</span>
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-neutral-100 dark:bg-neutral-900 p-[var(--admin-content-padding-y)] px-[var(--admin-content-padding-x)]">
          {children ? children : <AdminContent />}
        </main>
      </div>
    </div>
  );
}

// Navigation item component
function NavItem({ 
  icon, 
  href, 
  label, 
  active = false,
  badgeCount,
}: { 
  icon: React.ReactNode;
  href: string;
  label: string;
  active?: boolean;
  badgeCount?: number;
}) {
  return (
    <Link href={href}>
      <a className={cn(
        "group flex items-center px-3 py-2 text-sm font-medium rounded-md",
        active
          ? "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300"
          : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700/50"
      )}>
        <span className={cn(
          "mr-3",
          active 
            ? "text-amber-500 dark:text-amber-400" 
            : "text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-300"
        )}>
          {icon}
        </span>
        <span className="flex-1">{label}</span>
        {badgeCount && (
          <span className="ml-auto inline-block py-0.5 px-2 text-xs rounded-full bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300">
            {badgeCount}
          </span>
        )}
      </a>
    </Link>
  );
}

// Default admin content
function AdminContent() {
  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Overview of your salon's performance and operations
          </p>
        </div>
        <div>
          <Button className="bg-amber-600 hover:bg-amber-700 text-white">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Appointment
          </Button>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Appointments"
          value="24"
          description="Today"
          trend="up"
          trendValue="12%"
          icon={<Calendar className="h-6 w-6 text-blue-500" />}
        />
        <StatsCard
          title="Clients"
          value="1,432"
          description="Total registered"
          trend="up"
          trendValue="5.2%"
          icon={<Users className="h-6 w-6 text-green-500" />}
        />
        <StatsCard
          title="Revenue"
          value="$8,254"
          description="This month"
          trend="up"
          trendValue="16.8%"
          icon={<BarChart className="h-6 w-6 text-amber-500" />}
        />
        <StatsCard
          title="Products"
          value="$1,230"
          description="Sales this month"
          trend="down"
          trendValue="3.5%"
          icon={<ShoppingCart className="h-6 w-6 text-red-500" />}
        />
      </div>
      
      {/* Tabs for different sections */}
      <Tabs defaultValue="appointments" className="w-full">
        <TabsList>
          <TabsTrigger value="appointments">Today's Appointments</TabsTrigger>
          <TabsTrigger value="recent">Recent Activity</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="appointments">
          <Card className="bg-white dark:bg-neutral-800">
            <div className="p-[var(--portal-card-padding)]">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Client</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Service</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Stylist</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-neutral-800 divide-y divide-neutral-200 dark:divide-neutral-700">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <tr key={index} className="hover:bg-neutral-50 dark:hover:bg-neutral-700/50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900 dark:text-white h-[var(--admin-table-row-height)]">
                          Sarah Johnson
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400 h-[var(--admin-table-row-height)]">
                          {index % 2 === 0 ? '10:30 AM' : '2:00 PM'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400 h-[var(--admin-table-row-height)]">
                          {index % 3 === 0 ? 'Box Braids' : index % 3 === 1 ? 'Goddess Braids' : 'Knotless Braids'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400 h-[var(--admin-table-row-height)]">
                          {index % 2 === 0 ? 'Kari Johnson' : 'Taylor Smith'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap h-[var(--admin-table-row-height)]">
                          <span className={cn(
                            "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
                            index % 3 === 0 
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" 
                              : index % 3 === 1 
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" 
                                : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                          )}>
                            {index % 3 === 0 ? 'Confirmed' : index % 3 === 1 ? 'In Progress' : 'Pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium h-[var(--admin-table-row-height)]">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-neutral-900 dark:text-neutral-200 hover:text-amber-600 dark:hover:text-amber-400"
                          >
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </TabsContent>
        <TabsContent value="recent">
          <Card className="bg-white dark:bg-neutral-800">
            <div className="p-[var(--portal-card-padding)]">
              <ul className="divide-y divide-neutral-200 dark:divide-neutral-700">
                {Array.from({ length: 5 }).map((_, index) => (
                  <li key={index} className="py-4 flex">
                    <span 
                      className={cn(
                        "h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0",
                        index % 4 === 0 
                          ? "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400" 
                          : index % 4 === 1 
                            ? "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" 
                            : index % 4 === 2 
                              ? "bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400" 
                              : "bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400"
                      )}
                    >
                      {index % 4 === 0 ? <Calendar className="h-5 w-5" /> : 
                       index % 4 === 1 ? <Users className="h-5 w-5" /> : 
                       index % 4 === 2 ? <ShoppingCart className="h-5 w-5" /> : 
                       <Settings className="h-5 w-5" />}
                    </span>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-neutral-900 dark:text-white">
                        {index % 4 === 0 ? 'New appointment booked' : 
                         index % 4 === 1 ? 'New client registered' : 
                         index % 4 === 2 ? 'Product purchase completed' : 
                         'System settings updated'}
                      </p>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        {index % 4 === 0 ? 'Sarah Johnson booked a Knotless Braids session for May 15, 2:00 PM' : 
                         index % 4 === 1 ? 'Michael Davis created a new account' : 
                         index % 4 === 2 ? 'Lisa Wang purchased Hair Care Bundle for $75.99' : 
                         'Email notification settings were updated'}
                      </p>
                      <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
                        {index === 0 ? '5 minutes ago' : 
                         index === 1 ? '2 hours ago' : 
                         index === 2 ? 'Yesterday at 4:30 PM' : 
                         index === 3 ? 'Yesterday at 1:15 PM' : 
                         '2 days ago'}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </TabsContent>
        <TabsContent value="reports">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white dark:bg-neutral-800">
              <div className="p-[var(--portal-card-padding)]">
                <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-6">Monthly Revenue</h3>
                {/* Chart placeholder */}
                <div className="bg-neutral-100 dark:bg-neutral-700 rounded-lg h-64 flex items-center justify-center">
                  <p className="text-neutral-500 dark:text-neutral-400">Chart Component</p>
                </div>
              </div>
            </Card>
            <Card className="bg-white dark:bg-neutral-800">
              <div className="p-[var(--portal-card-padding)]">
                <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-6">Service Popularity</h3>
                {/* Chart placeholder */}
                <div className="bg-neutral-100 dark:bg-neutral-700 rounded-lg h-64 flex items-center justify-center">
                  <p className="text-neutral-500 dark:text-neutral-400">Chart Component</p>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Stats card component
function StatsCard({ 
  title, 
  value, 
  description, 
  trend, 
  trendValue, 
  icon 
}: { 
  title: string;
  value: string;
  description: string;
  trend: 'up' | 'down' | 'neutral';
  trendValue: string;
  icon: React.ReactNode;
}) {
  return (
    <Card className="bg-white dark:bg-neutral-800">
      <div className="p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            {icon}
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-neutral-500 dark:text-neutral-400 truncate">
                {title}
              </dt>
              <dd>
                <div className="text-lg font-semibold text-neutral-900 dark:text-white">
                  {value}
                </div>
                <div className="flex items-center text-xs mt-1">
                  <span className="text-neutral-500 dark:text-neutral-400 mr-1">
                    {description}
                  </span>
                  <span className={cn(
                    "ml-2 flex items-center text-xs font-medium",
                    trend === 'up' ? "text-green-600 dark:text-green-400" : 
                    trend === 'down' ? "text-red-600 dark:text-red-400" : 
                    "text-neutral-500 dark:text-neutral-400"
                  )}>
                    {trend === 'up' ? (
                      <svg className="self-center flex-shrink-0 h-4 w-4 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : trend === 'down' ? (
                      <svg className="self-center flex-shrink-0 h-4 w-4 text-red-500 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : null}
                    <span className="sr-only">{trend === 'up' ? 'Increased' : 'Decreased'} by</span>
                    {trendValue}
                  </span>
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </Card>
  );
}