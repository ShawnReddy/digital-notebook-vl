
import React, { useState } from 'react';
import { Search, Filter, Building, Phone, Mail, MapPin, Target, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

interface MHAAccount {
  id: string;
  name: string;
  organization: string;
  email: string;
  phone: string;
  location: string;
  potentialValue: string;
  lastContact: string;
  status: 'hot-lead' | 'warm-lead' | 'cold-lead';
  selected: boolean;
}

const MHA = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [mhaAccounts, setMhaAccounts] = useState<MHAAccount[]>([
    {
      id: '1',
      name: 'Dr. Sandra Martinez',
      organization: 'Metro Health Alliance',
      email: 's.martinez@metrohealth.org',
      phone: '+1 (555) 234-5678',
      location: 'Los Angeles, CA',
      potentialValue: '$450K',
      lastContact: '2024-12-15',
      status: 'hot-lead',
      selected: false
    },
    {
      id: '2',
      name: 'Dr. Michael Thompson',
      organization: 'Regional Medical Group',
      email: 'm.thompson@regionalmed.com',
      phone: '+1 (555) 345-6789',
      location: 'Dallas, TX',
      potentialValue: '$320K',
      lastContact: '2024-12-10',
      status: 'warm-lead',
      selected: false
    },
    {
      id: '3',
      name: 'Dr. Lisa Wang',
      organization: 'Community Healthcare Network',
      email: 'l.wang@communityhealth.org',
      phone: '+1 (555) 456-7890',
      location: 'Atlanta, GA',
      potentialValue: '$280K',
      lastContact: '2024-11-28',
      status: 'cold-lead',
      selected: false
    },
    {
      id: '4',
      name: 'Dr. Robert Johnson',
      organization: 'Integrated Care Systems',
      email: 'r.johnson@integratedcare.com',
      phone: '+1 (555) 567-8901',
      location: 'Phoenix, AZ',
      potentialValue: '$520K',
      lastContact: '2024-12-20',
      status: 'hot-lead',
      selected: false
    }
  ]);

  const handleAccountSelect = (accountId: string) => {
    setMhaAccounts(mhaAccounts.map(account => 
      account.id === accountId ? { ...account, selected: !account.selected } : account
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'hot-lead': return 'bg-red-100 text-red-800';
      case 'warm-lead': return 'bg-yellow-100 text-yellow-800';
      case 'cold-lead': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'hot-lead': return 'Hot Lead';
      case 'warm-lead': return 'Warm Lead';
      case 'cold-lead': return 'Cold Lead';
      default: return status;
    }
  };

  const filteredAccounts = mhaAccounts.filter(account =>
    account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.organization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedCount = mhaAccounts.filter(a => a.selected).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Must Have Accounts (MHA)</h1>
        <p className="text-gray-600">Priority accounts targeted for client conversion - track leads and conversion opportunities.</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search priority accounts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="flex items-center">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
        {selectedCount > 0 && (
          <Button className="bg-blue-600 hover:bg-blue-700">
            Add {selectedCount} to Pipeline
          </Button>
        )}
      </div>

      {/* MHA Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAccounts.map((account) => (
          <Card key={account.id} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    checked={account.selected}
                    onCheckedChange={() => handleAccountSelect(account.id)}
                  />
                  <div>
                    <CardTitle className="text-lg">{account.name}</CardTitle>
                    <p className="text-sm text-gray-600 flex items-center">
                      <Building className="w-3 h-3 mr-1" />
                      {account.organization}
                    </p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(account.status)}`}>
                  {getStatusText(account.status)}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="w-4 h-4 mr-2" />
                {account.email}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="w-4 h-4 mr-2" />
                {account.phone}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-2" />
                {account.location}
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                <div>
                  <p className="text-sm text-gray-500">Potential Value</p>
                  <p className="font-semibold text-green-600 flex items-center">
                    <Target className="w-4 h-4 mr-1" />
                    {account.potentialValue}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Last Contact</p>
                  <p className="text-sm font-medium">{new Date(account.lastContact).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAccounts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No priority accounts found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default MHA;
