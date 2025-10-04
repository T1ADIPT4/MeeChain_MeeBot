import { useState } from 'react';
import {
  Calendar,
  Home,
  Inbox,
  Search,
  Settings,
  Bot,
  Trophy,
  Wallet,
  BookOpen,
  Target,
  Sparkles,
  Coins,
  GitBranch,
  MessageCircle,
  Shield,
  Users,
  Activity,
  TrendingUp,
  Zap,
  Heart,
  Star,
  Award,
  Map,
  Clock,
  Gamepad2,
  Crown,
  FileText,
  BarChart,
  PieChart,
  Database,
  Globe,
  Lock,
  Eye,
  Bell,
  Download,
  Upload,
  RefreshCw,
  Power,
  HelpCircle,
  User,
  LogOut,
  Menu,
  X
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useLocation } from 'wouter';
import logoUrl from '@assets/branding/logo.png';

// Menu items data
const menuItems = {
  main: [
    {
      title: "หน้าหลัก",
      url: "/",
      icon: Home,
      badge: null,
    },
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: TrendingUp,
      badge: "Active",
    },
    {
      title: "กระเป๋าเงิน",
      url: "#",
      icon: Wallet,
      badge: null,
      items: [
        {
          title: "ยอดคงเหลือ",
          url: "/wallet",
          icon: Coins,
        },
        {
          title: "ส่งโทเค็น",
          url: "/send",
          icon: Upload,
        },
        {
          title: "รับโทเค็น",
          url: "/receive",
          icon: Download,
        },
        {
          title: "Swap/Bridge",
          url: "/swap-bridge",
          icon: GitBranch,
        },
        {
          title: "รับโทเค็นฟรี",
          url: "/faucet",
          icon: Star,
        },
      ],
    },
  ],
  nft: [
    {
      title: "NFT Collection",
      url: "/nft-collection",
      icon: Sparkles,
      badge: "New",
    },
    {
      title: "Badge & Awards",
      url: "#",
      icon: Award,
      badge: null,
      items: [
        {
          title: "Badge Collection",
          url: "/badges",
          icon: Trophy,
        },
        {
          title: "Mint Badge",
          url: "/mint-badge",
          icon: Zap,
        },
        {
          title: "Badge Upgrade",
          url: "/badge-upgrade",
          icon: Crown,
        },
      ],
    },
    {
      title: "ฟุตบอล Zone",
      url: "#",
      icon: Target,
      badge: "⚽",
      items: [
        {
          title: "Football NFTs",
          url: "/football",
          icon: Trophy,
        },
        {
          title: "Football Quests",
          url: "/football-quests",
          icon: Map,
        },
      ],
    },
  ],
  quests: [
    {
      title: "ภารกิจ",
      url: "#",
      icon: Target,
      badge: "3",
      items: [
        {
          title: "Quest Tracker",
          url: "/quest-tracker",
          icon: Activity,
        },
        {
          title: "Daily Quests",
          url: "/daily-quests",
          icon: Calendar,
        },
        {
          title: "Weekly Challenges",
          url: "/weekly-challenges",
          icon: Clock,
        },
      ],
    },
    {
      title: "รายได้",
      url: "/earnings",
      icon: PieChart,
      badge: null,
    },
    {
      title: "ประวัติการทำงาน",
      url: "/transaction-history",
      icon: FileText,
      badge: null,
    },
  ],
  tools: [
    {
      title: "MeeBot",
      url: "/meebot",
      icon: Bot,
      badge: "AI",
    },
    {
      title: "Academy",
      url: "/academy",
      icon: BookOpen,
      badge: null,
    },
    {
      title: "Team Dashboard",
      url: "/team",
      icon: Users,
      badge: null,
    },
    {
      title: "Scheduled Tasks",
      url: "/scheduled-tasks",
      icon: Clock,
      badge: null,
    },
  ],
  system: [
    {
      title: "การตั้งค่า",
      url: "/settings",
      icon: Settings,
      badge: null,
    },
    {
      title: "ความปลอดภัย",
      url: "/security",
      icon: Shield,
      badge: null,
    },
    {
      title: "เครือข่าย",
      url: "/network",
      icon: Globe,
      badge: "Online",
    },
    {
      title: "ความช่วยเหลือ",
      url: "/help",
      icon: HelpCircle,
      badge: null,
    },
  ],
};

interface AppSidebarProps {
  userAddress?: string;
  isConnected?: boolean;
  userName?: string;
  userLevel?: number;
  userTier?: string;
}

export function AppSidebar({ 
  userAddress, 
  isConnected = false, 
  userName = "Anonymous User",
  userLevel = 1,
  userTier = "Bronze"
}: AppSidebarProps) {
  const [, navigate] = useLocation();

  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="relative">
            <img
              src={logoUrl}
              alt="MeeBot Logo"
              className="w-8 h-8 rounded-full"
            />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-semibold text-foreground truncate">
              MeeChain
            </h2>
            <p className="text-xs text-muted-foreground">
              Web3 Assistant
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* User Profile Section */}
        <SidebarGroup>
          <div className="px-4 py-3 border-b border-sidebar-border">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src="/api/placeholder/40/40" alt="Profile" />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold">
                  {userName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {userName}
                </p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs px-1 py-0">
                    {userTier}
                  </Badge>
                  <Badge variant="outline" className="text-xs px-1 py-0">
                    Lv {userLevel}
                  </Badge>
                </div>
                {userAddress && (
                  <p className="text-xs text-muted-foreground font-mono">
                    {userAddress.slice(0, 6)}...{userAddress.slice(-4)}
                  </p>
                )}
              </div>
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-500'}`}></div>
            </div>
          </div>
        </SidebarGroup>

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>หลัก</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.main.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.items ? (
                    <Collapsible>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton>
                          <item.icon className="w-3.5 h-3.5" />
                          <span className="text-xs">{item.title}</span>
                          {item.badge && (
                            <Badge variant="outline" className="ml-auto text-xs px-1">
                              {item.badge}
                            </Badge>
                          )}
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton 
                                asChild
                                onClick={() => navigate(subItem.url)}
                              >
                                <a href={subItem.url}>
                                  <subItem.icon className="w-3 h-3" />
                                  <span className="text-xs">{subItem.title}</span>
                                </a>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <SidebarMenuButton 
                      asChild
                      onClick={() => navigate(item.url)}
                    >
                      <a href={item.url}>
                        <item.icon className="w-3.5 h-3.5" />
                        <span className="text-xs">{item.title}</span>
                        {item.badge && (
                          <Badge variant="outline" className="ml-auto text-xs px-1">
                            {item.badge}
                          </Badge>
                        )}
                      </a>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* NFT & Collectibles */}
        <SidebarGroup>
          <SidebarGroupLabel>NFT & สะสม</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.nft.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.items ? (
                    <Collapsible>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton>
                          <item.icon className="w-3.5 h-3.5" />
                          <span className="text-xs">{item.title}</span>
                          {item.badge && (
                            <Badge variant="outline" className="ml-auto text-xs px-1">
                              {item.badge}
                            </Badge>
                          )}
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton 
                                asChild
                                onClick={() => navigate(subItem.url)}
                              >
                                <a href={subItem.url}>
                                  <subItem.icon className="w-3 h-3" />
                                  <span className="text-xs">{subItem.title}</span>
                                </a>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <SidebarMenuButton 
                      asChild
                      onClick={() => navigate(item.url)}
                    >
                      <a href={item.url}>
                        <item.icon className="w-3.5 h-3.5" />
                        <span className="text-xs">{item.title}</span>
                        {item.badge && (
                          <Badge variant="outline" className="ml-auto text-xs px-1">
                            {item.badge}
                          </Badge>
                        )}
                      </a>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Quests & Activities */}
        <SidebarGroup>
          <SidebarGroupLabel>ภารกิจ & กิจกรรม</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.quests.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.items ? (
                    <Collapsible>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton>
                          <item.icon className="w-3.5 h-3.5" />
                          <span className="text-xs">{item.title}</span>
                          {item.badge && (
                            <Badge variant="outline" className="ml-auto text-xs px-1">
                              {item.badge}
                            </Badge>
                          )}
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton 
                                asChild
                                onClick={() => navigate(subItem.url)}
                              >
                                <a href={subItem.url}>
                                  <subItem.icon className="w-3 h-3" />
                                  <span className="text-xs">{subItem.title}</span>
                                </a>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <SidebarMenuButton 
                      asChild
                      onClick={() => navigate(item.url)}
                    >
                      <a href={item.url}>
                        <item.icon className="w-3.5 h-3.5" />
                        <span className="text-xs">{item.title}</span>
                        {item.badge && (
                          <Badge variant="outline" className="ml-auto text-xs px-1">
                            {item.badge}
                          </Badge>
                        )}
                      </a>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Tools & AI */}
        <SidebarGroup>
          <SidebarGroupLabel>เครื่องมือ & AI</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.tools.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    onClick={() => navigate(item.url)}
                  >
                    <a href={item.url}>
                      <item.icon className="w-3.5 h-3.5" />
                      <span className="text-xs">{item.title}</span>
                      {item.badge && (
                        <Badge variant="outline" className="ml-auto text-xs px-1">
                          {item.badge}
                        </Badge>
                      )}
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* System */}
        <SidebarGroup>
          <SidebarGroupLabel>ระบบ</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.system.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    onClick={() => navigate(item.url)}
                  >
                    <a href={item.url}>
                      <item.icon className="w-3.5 h-3.5" />
                      <span className="text-xs">{item.title}</span>
                      {item.badge && (
                        <Badge variant="outline" className="ml-auto text-xs px-1">
                          {item.badge}
                        </Badge>
                      )}
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <User className="w-4 h-4" />
              <span>โปรไฟล์</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <LogOut className="w-4 h-4" />
              <span>ออกจากระบบ</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}