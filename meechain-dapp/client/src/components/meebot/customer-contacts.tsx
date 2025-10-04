
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  Plus, 
  Copy, 
  ExternalLink, 
  Search,
  Trash2,
  Edit3,
  CheckCircle,
  AlertCircle,
  Globe
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CustomerContact {
  id: string;
  address: string;
  name?: string;
  network: 'fuse' | 'ethereum' | 'polygon';
  status: 'active' | 'inactive' | 'verified';
  addedAt: Date;
  lastInteraction?: Date;
}

export function CustomerContacts() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [contacts, setContacts] = useState<CustomerContact[]>([
    {
      id: '1',
      address: '0xE29270c4387684c6492fe690508E31740cFd4458',
      name: 'Customer A',
      network: 'fuse',
      status: 'verified',
      addedAt: new Date('2024-01-15'),
      lastInteraction: new Date('2024-01-20')
    },
    {
      id: '2', 
      address: '0xa669b1F45F84368fBe48882bF8d1814aae7a4422',
      name: 'Customer B',
      network: 'fuse',
      status: 'active',
      addedAt: new Date('2024-01-16'),
      lastInteraction: new Date('2024-01-19')
    },
    {
      id: '3',
      address: '0xb7C7a8ccee95A5D44c0A9E02fa7dd3551BeB2E4E',
      network: 'fuse',
      status: 'active',
      addedAt: new Date('2024-01-17')
    },
    {
      id: '4',
      address: '0xE3Df2C1f1ca54707AB49747eeBc7658bb1c8Bf1C',
      network: 'fuse',
      status: 'verified',
      addedAt: new Date('2024-01-18')
    },
    {
      id: '5',
      address: '0x68c9736781E9316ebf5c3d49FE0C1f45D2D104Cd',
      network: 'fuse',
      status: 'active',
      addedAt: new Date('2024-01-19')
    },
    {
      id: '6',
      address: '0x28C3d1cD466Ba22f6cae51b1a4692a831696391A',
      network: 'fuse',
      status: 'verified',
      addedAt: new Date('2024-01-20')
    },
    {
      id: '7',
      address: '0x8295cA03e00409B21b8f7cE065Dd590d8eF9d56e',
      network: 'fuse',
      status: 'active',
      addedAt: new Date('2024-01-21')
    }
  ]);

  const filteredContacts = contacts.filter(contact =>
    contact.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopyAddress = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address);
      toast({
        title: "คัดลอกแล้ว",
        description: "Wallet address ถูกคัดลอกแล้ว",
      });
    } catch (error) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถคัดลอกได้",
        variant: "destructive"
      });
    }
  };

  const handleViewOnExplorer = (address: string) => {
    window.open(`https://explorer.fuse.io/address/${address}`, '_blank');
  };

  const getStatusBadge = (status: CustomerContact['status']) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
          <CheckCircle className="w-3 h-3 mr-1" />
          Verified
        </Badge>;
      case 'active':
        return <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
          <Globe className="w-3 h-3 mr-1" />
          Active
        </Badge>;
      case 'inactive':
        return <Badge className="bg-gray-500/20 text-gray-300 border-gray-500/30">
          <AlertCircle className="w-3 h-3 mr-1" />
          Inactive
        </Badge>;
    }
  };

  const getNetworkColor = (network: string) => {
    switch (network) {
      case 'fuse':
        return 'bg-green-400';
      case 'ethereum':
        return 'bg-blue-400';
      case 'polygon':
        return 'bg-purple-400';
      default:
        return 'bg-gray-400';
    }
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <Card className="bg-slate-800/80 border-slate-600/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-green-300">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Customer Contacts - Fuse Network
          </div>
          <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
            {contacts.length} contacts
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            placeholder="ค้นหาด้วย address หรือชื่อ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder-slate-400"
          />
        </div>

        {/* Contact List */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredContacts.map((contact) => (
            <div 
              key={contact.id}
              className="bg-slate-700/50 rounded-lg p-4 hover:bg-slate-700/70 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${getNetworkColor(contact.network)}`} />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-mono text-sm">
                        {truncateAddress(contact.address)}
                      </span>
                      {contact.name && (
                        <span className="text-slate-300 text-sm">({contact.name})</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      {getStatusBadge(contact.status)}
                      <span className="text-xs text-slate-400">
                        Added: {contact.addedAt.toLocaleDateString('th-TH')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopyAddress(contact.address)}
                    className="h-8 w-8 p-0 border-slate-600 hover:bg-slate-600"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleViewOnExplorer(contact.address)}
                    className="h-8 w-8 p-0 border-slate-600 hover:bg-slate-600"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              {contact.lastInteraction && (
                <div className="mt-2 text-xs text-slate-400">
                  Last interaction: {contact.lastInteraction.toLocaleDateString('th-TH')}
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredContacts.length === 0 && (
          <div className="text-center py-8 text-slate-400">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>ไม่พบ customer contacts</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t border-slate-600/30">
          <Button 
            className="flex-1 bg-green-600/20 hover:bg-green-600/30 border border-green-500/50 text-green-300"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Contact
          </Button>
          <Button 
            variant="outline"
            className="border-slate-600 hover:bg-slate-600"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Fuse Explorer
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
